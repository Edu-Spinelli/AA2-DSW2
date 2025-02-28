from flask import Blueprint, request, jsonify
from models import Cliente
from .twilio_service import enviar_mensagem_whatsapp

whatsapp_bp = Blueprint("whatsapp", __name__)

@whatsapp_bp.route("/enviar-mensagem", methods=["POST"])
def enviar_mensagem():
    data = request.json
    
    print(data)
    
    cliente_id = data.get("cliente_id")

    if not cliente_id:
        return jsonify({"error": "Cliente ID é obrigatório"}), 400

    cliente = Cliente.query.get(cliente_id)
    if not cliente:
        return jsonify({"error": "Cliente não encontrado"}), 404

    if cliente.saldo_devedor <= 0:
        return jsonify({"message": "Cliente não tem saldo devedor"}), 200

    try:
        sid = enviar_mensagem_whatsapp(cliente.nome, cliente.telefone, cliente.saldo_devedor)
        return jsonify({"message": "Mensagem enviada com sucesso!", "twilio_sid": sid}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
