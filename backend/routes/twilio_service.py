import os
from twilio.rest import Client
from dotenv import load_dotenv

load_dotenv()

TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_WHATSAPP_NUMBER = os.getenv("TWILIO_WHATSAPP_NUMBER")

client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

def formatar_numero_whatsapp(numero):
    """Formata o número para o padrão internacional do WhatsApp."""
    numero = numero.strip().replace(" ", "").replace("-", "")
    if not numero.startswith("+"):
        numero = "+55" + numero  # Adiciona o código do Brasil se não estiver presente
    return f"whatsapp:{numero}"

def enviar_mensagem_whatsapp(nome, telefone, valor_devido):
    telefone_formatado = f"whatsapp:{telefone}"
    print(f"📲 Enviando mensagem para: {telefone_formatado}")

    mensagem = f"Olá {nome}, você tem um saldo pendente de R$ {valor_devido:.2f}. Por favor, regularize sua situação."

    try:
        mensagem_enviada = client.messages.create(
            body=mensagem,
            from_=TWILIO_WHATSAPP_NUMBER,
            to=telefone_formatado
        )
        print(f"✅ Mensagem enviada com sucesso! SID: {mensagem_enviada.sid}")
        return mensagem_enviada.sid

    except Exception as e:
        print(f"❌ Erro ao enviar mensagem: {str(e)}")  # Exibir erro no terminal
        raise  # Relançar erro para o Flask capturar


