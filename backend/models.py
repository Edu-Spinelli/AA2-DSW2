from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Cliente(db.Model):
    __tablename__ = "clientes"

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    telefone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    status = db.Column(db.String(50), nullable=False)
    saldo_devedor = db.Column(db.Float, nullable=False, default=0.0)  # Novo campo

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "telefone": self.telefone,
            "email": self.email,
            "status": self.status,
            "saldo_devedor": self.saldo_devedor
        }


class Produto(db.Model):
    __tablename__ = "produtos"
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    quantidade = db.Column(db.Integer, nullable=False)
    preco_pago = db.Column(db.Float, nullable=False)
    preco_venda = db.Column(db.Float, nullable=False)
    imagem = db.Column(db.String(255), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "quantidade": self.quantidade,
            "preco_pago": self.preco_pago,
            "preco_venda": self.preco_venda,
            "imagem": self.imagem
        }


class Venda(db.Model):
    __tablename__ = "vendas"
    id = db.Column(db.Integer, primary_key=True)
    cliente_id = db.Column(db.Integer, db.ForeignKey("clientes.id"), nullable=False)
    data = db.Column(db.DateTime, nullable=False)
    valor_total = db.Column(db.Float, nullable=False)
    entrada = db.Column(db.Float, nullable=False)
    saldo_restante = db.Column(db.Float, nullable=False)
    parcelas = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), nullable=False, default="Pendente")

    cliente = db.relationship("Cliente")
    itens = db.relationship("ItemVenda", backref="venda", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "cliente": self.cliente.to_dict(),
            "data": self.data.strftime("%Y-%m-%d"),
            "valor_total": self.valor_total,
            "entrada": self.entrada,
            "saldo_restante": self.saldo_restante,
            "parcelas": self.parcelas,
            "status": self.status,
            "itens": [item.to_dict() for item in self.itens]
        }

class ItemVenda(db.Model):
    __tablename__ = "itens_venda"
    id = db.Column(db.Integer, primary_key=True)
    venda_id = db.Column(db.Integer, db.ForeignKey("vendas.id"), nullable=False)
    produto_id = db.Column(db.Integer, db.ForeignKey("produtos.id"), nullable=False)
    quantidade = db.Column(db.Integer, nullable=False)
    preco_pago = db.Column(db.Float, nullable=False)
    preco_vendido = db.Column(db.Float, nullable=False)
    subtotal = db.Column(db.Float, nullable=False)

    produto = db.relationship("Produto")

    def to_dict(self):
        return {
            "id": self.id,
            "produto": self.produto.to_dict(),
            "quantidade": self.quantidade,
            "preco_pago": self.preco_pago,
            "preco_vendido": self.preco_vendido,
            "subtotal": self.subtotal,
        }

class Pagamento(db.Model):
    __tablename__ = "pagamentos"

    id = db.Column(db.Integer, primary_key=True)
    cliente_id = db.Column(db.Integer, db.ForeignKey("clientes.id"), nullable=False)
    valor_pago = db.Column(db.Float, nullable=False)
    data_pagamento = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "cliente_id": self.cliente_id,
            "valor_pago": self.valor_pago,
            "data_pagamento": self.data_pagamento.strftime("%Y-%m-%d %H:%M:%S")
        }