from flask import Blueprint, jsonify
import requests

api_bp = Blueprint("api", __name__)

@api_bp.route("/frase-motivacional", methods=["GET"])
def obter_frase_motivacional():
    try:
        response = requests.get("https://zenquotes.io/api/random")
        if response.status_code == 200:
            data = response.json()
            return jsonify({"frase": data[0]["q"], "autor": data[0]["a"]})
        else:
            return jsonify({"frase": "Acredite em si mesmo e tudo será possível!", "autor": "Desconhecido"})
    except Exception as e:
        return jsonify({"frase": "Acredite em si mesmo e tudo será possível!", "autor": "Desconhecido"}), 500
