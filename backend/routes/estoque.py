from flask import Blueprint, request, jsonify
from models import db, Produto
from werkzeug.utils import secure_filename
import os

estoque_bp = Blueprint("estoque", __name__)
UPLOAD_FOLDER = "uploads/"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Listar todos os produtos
@estoque_bp.route("/produtos", methods=["GET"])
def listar_produtos():
    produtos = Produto.query.all()
    return jsonify([produto.to_dict() for produto in produtos])

# Criar um novo produto
@estoque_bp.route("/produtos", methods=["POST"])
def adicionar_produto():
    data = request.form
    imagem = request.files.get("imagem")
    
    if imagem:
        filename = secure_filename(imagem.filename)
        imagem_path = os.path.join(UPLOAD_FOLDER, filename)
        imagem.save(imagem_path)
        imagem_path = f"/uploads/{filename}"
    else:
        imagem_path = ""

    novo_produto = Produto(
        nome=data["nome"],
        quantidade=int(data["quantidade"]),
        preco_pago=float(data["preco_pago"]),
        preco_venda=float(data["preco_venda"]),
        imagem=imagem_path
    )
    db.session.add(novo_produto)
    db.session.commit()
    return jsonify(novo_produto.to_dict()), 201

# Editar um produto
@estoque_bp.route("/produtos/<int:id>", methods=["PUT"])
def editar_produto(id):
    produto = Produto.query.get(id)
    if not produto:
        return jsonify({"error": "Produto não encontrado"}), 404

    if request.content_type == "application/json":
        # Caso seja JSON (sem imagem)
        data = request.json
        produto.nome = data.get("nome", produto.nome)
        produto.quantidade = data.get("quantidade", produto.quantidade)
        produto.preco_pago = data.get("preco_pago", produto.preco_pago)
        produto.preco_venda = data.get("preco_venda", produto.preco_venda)
    
    else:
        # Caso seja multipart/form-data (com imagem)
        data = request.form
        imagem = request.files.get("imagem")

        if imagem:
            filename = secure_filename(imagem.filename)
            imagem_path = os.path.join(UPLOAD_FOLDER, filename)
            imagem.save(imagem_path)
            produto.imagem = f"/uploads/{filename}"  # Atualiza a imagem
        else:
            # Se nenhuma imagem for enviada, mantém a imagem atual
            produto.imagem = produto.imagem 

        produto.nome = data.get("nome", produto.nome)
        produto.quantidade = int(data.get("quantidade", produto.quantidade))
        produto.preco_pago = float(data.get("preco_pago", produto.preco_pago))
        produto.preco_venda = float(data.get("preco_venda", produto.preco_venda))

    db.session.commit()
    return jsonify(produto.to_dict())



# Remover um produto
@estoque_bp.route("/produtos/<int:id>", methods=["DELETE"])
def remover_produto(id):
    produto = Produto.query.get(id)
    if not produto:
        return jsonify({"error": "Produto não encontrado"}), 404
    
    db.session.delete(produto)
    db.session.commit()
    return jsonify({"message": "Produto removido com sucesso"})
