from flask import Blueprint, request, jsonify
from models import db, Venda, ItemVenda, Produto, Cliente
from datetime import datetime

vendas_bp = Blueprint("vendas", __name__)

# Criar uma nova venda
@vendas_bp.route("/vendas", methods=["POST"])
def criar_venda():
    data = request.json

    cliente_id = data.get("cliente_id")
    itens = data.get("itens", [])
    entrada = float(data.get("entrada", 0))
    parcelas = int(data.get("parcelas", 1))

    if not cliente_id or not itens:
        return jsonify({"error": "Cliente e itens são obrigatórios!"}), 400

    valor_total = sum(item["quantidade"] * item["preco_venda"] for item in itens)
    saldo_restante = valor_total - entrada

    # Atualizar saldo devedor do cliente
    cliente = Cliente.query.get(cliente_id)
    if not cliente:
        return jsonify({"error": "Cliente não encontrado"}), 404

    cliente.saldo_devedor += saldo_restante

    nova_venda = Venda(
        cliente_id=cliente_id,
        data=datetime.utcnow(),
        valor_total=valor_total,
        entrada=entrada,
        saldo_restante=saldo_restante,
        parcelas=parcelas,
        status="Pendente" if saldo_restante > 0 else "Pago"
    )
    db.session.add(nova_venda)
    db.session.flush()

    for item in itens:
        produto = Produto.query.get(item["produto_id"])
        if not produto or produto.quantidade < item["quantidade"]:
            return jsonify({"error": f"Produto {produto.nome} sem estoque suficiente!"}), 400
        
        produto.quantidade -= item["quantidade"]

        novo_item = ItemVenda(
            venda_id=nova_venda.id,
            produto_id=item["produto_id"],
            quantidade=item["quantidade"],
            preco_pago=item["preco_pago"],
            preco_vendido=item["preco_venda"],
            subtotal=item["quantidade"] * item["preco_venda"]
        )
        db.session.add(novo_item)

    db.session.commit()
    return jsonify(nova_venda.to_dict()), 201

# Listar todas as vendas
@vendas_bp.route("/vendas", methods=["GET"])
def listar_vendas():
    vendas = Venda.query.all()
    return jsonify([venda.to_dict() for venda in vendas])

# Detalhar uma venda específica
@vendas_bp.route("/vendas/<int:venda_id>", methods=["GET"])
def detalhar_venda(venda_id):
    venda = Venda.query.get(venda_id)
    if not venda:
        return jsonify({"error": "Venda não encontrada"}), 404
    return jsonify(venda.to_dict())

# Deletar uma venda
@vendas_bp.route("/vendas/<int:venda_id>", methods=["DELETE"])
def deletar_venda(venda_id):
    venda = Venda.query.get(venda_id)
    if not venda:
        return jsonify({"error": "Venda não encontrada"}), 404
    
    # Restaurar estoque
    for item in venda.itens:
        produto = Produto.query.get(item.produto_id)
        if produto:
            produto.quantidade += item.quantidade
        db.session.delete(item)

    # Ajustar saldo devedor do cliente ao excluir a venda
    cliente = Cliente.query.get(venda.cliente_id)
    if cliente:
        cliente.saldo_devedor -= venda.saldo_restante

    db.session.delete(venda)
    db.session.commit()
    return jsonify({"message": "Venda removida com sucesso"})
