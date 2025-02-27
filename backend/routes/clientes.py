from flask import Blueprint, request, jsonify
from models import db, Cliente

clientes_bp = Blueprint("clientes", __name__)

# Listar todos os clientes
@clientes_bp.route("/clientes", methods=["GET"])
def listar_clientes():
    clientes = Cliente.query.all()
    return jsonify([cliente.to_dict() for cliente in clientes])

# Criar um novo cliente
@clientes_bp.route("/clientes", methods=["POST"])
def adicionar_cliente():
    data = request.json
    novo_cliente = Cliente(
        nome=data["nome"],
        telefone=data["telefone"],
        email=data["email"],
        status=data["status"],
        saldo_devedor=float(data.get("saldo_devedor", 0.0))  # Novo campo com valor padrão
    )
    db.session.add(novo_cliente)
    db.session.commit()
    return jsonify(novo_cliente.to_dict()), 201



# Editar um cliente
@clientes_bp.route("/clientes/<int:id>", methods=["PUT"])
def editar_cliente(id):
    cliente = Cliente.query.get(id)
    if not cliente:
        return jsonify({"error": "Cliente não encontrado"}), 404

    data = request.json
    cliente.nome = data.get("nome", cliente.nome)
    cliente.telefone = data.get("telefone", cliente.telefone)
    cliente.email = data.get("email", cliente.email)
    cliente.status = data.get("status", cliente.status)
    cliente.saldo_devedor = float(data.get("saldo_devedor", cliente.saldo_devedor))  # Atualiza o saldo

    db.session.commit()
    return jsonify(cliente.to_dict())



# Remover um cliente
@clientes_bp.route("/clientes/<int:id>", methods=["DELETE"])
def remover_cliente(id):
    cliente = Cliente.query.get(id)
    if not cliente:
        return jsonify({"error": "Cliente não encontrado"}), 404
    
    db.session.delete(cliente)
    db.session.commit()
    return jsonify({"message": "Cliente removido com sucesso"})
