from flask import Blueprint, request, jsonify
from models import Pagamento, db, Venda, Cliente
from datetime import datetime

pagamentos_bp = Blueprint("pagamentos", __name__)

@pagamentos_bp.route("/pagamentos", methods=["POST"])
def registrar_pagamento():
    data = request.json
    cliente_id = data.get("cliente_id")
    valor_pago = float(data.get("valor_pago", 0))

    if not cliente_id or valor_pago <= 0:
        return jsonify({"error": "Cliente e valor do pagamento são obrigatórios!"}), 400

    # Busca o cliente
    cliente = Cliente.query.get(cliente_id)
    if not cliente:
        return jsonify({"error": "Cliente não encontrado!"}), 404

    # Busca as vendas pendentes do cliente, ordenadas pela data mais antiga
    vendas_pendentes = Venda.query.filter(
        Venda.cliente_id == cliente_id,
        Venda.saldo_restante > 0
    ).order_by(Venda.data.asc()).all()

    if not vendas_pendentes:
        return jsonify({"message": "Nenhuma dívida encontrada para este cliente."}), 200

    saldo_restante = valor_pago  # O valor disponível para pagamento

    for venda in vendas_pendentes:
        if saldo_restante <= 0:
            break  # Se já pagamos tudo que podíamos, saímos do loop

        if venda.saldo_restante <= saldo_restante:
            # Se o pagamento cobre essa venda, zeramos o saldo restante da venda
            saldo_restante -= venda.saldo_restante
            venda.saldo_restante = 0
            venda.status = "Pago"
        else:
            # Caso contrário, apenas reduzimos o saldo da venda
            venda.saldo_restante -= saldo_restante
            saldo_restante = 0

    # Atualiza o saldo devedor do cliente
    cliente.saldo_devedor = sum(venda.saldo_restante for venda in vendas_pendentes)
    
    # Criar o pagamento e salvar no banco
    novo_pagamento = Pagamento(
        cliente_id=cliente_id,
        valor_pago=valor_pago,
        data_pagamento=datetime.utcnow()
    )
    db.session.add(novo_pagamento)

    db.session.commit()

    return jsonify({
        "message": "Pagamento registrado com sucesso!",
        "saldo_restante": cliente.saldo_devedor
    }), 200
    
    


# 🔹 **Listar todos os pagamentos**
@pagamentos_bp.route("/pagamentos", methods=["GET"])
def listar_pagamentos():
    pagamentos = Pagamento.query.all()
    return jsonify([pagamento.to_dict() for pagamento in pagamentos]), 200