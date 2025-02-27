from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from config import DATABASE_URL
from models import db
from routes.clientes import clientes_bp
from routes.estoque import estoque_bp
import os

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

CORS(app)
db.init_app(app)

# Criando tabelas no banco de dados
with app.app_context():
    db.create_all()

# Registrando as rotas
app.register_blueprint(clientes_bp)
app.register_blueprint(estoque_bp)

# Configuração do diretório de uploads
UPLOAD_FOLDER = "uploads/"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

if __name__ == "__main__":
    app.run(debug=True)