from llama_cpp import Llama
import flask
from flask_cors import CORS

# flask --app serveur run

# --- 1. Chargement du modèle GGUF IA ---
model_path = "Models/Qwen3-4B-Q4_K_M.gguf"

llm = Llama(
    model_path=model_path,
    n_ctx=4096,            # longueur de contexte
    n_threads=16,          # adapte selon ton CPU
    n_gpu_layers=0,        # mettre >0 pour accélérer avec GPU (si supporté)
    stream=True            # IMPORTANT : streaming des tokens générés par le modèle IA
)

app = flask.Flask(__name__)
CORS(app)

@app.route("/generate", methods=['POST'])
def generate():
    json_data = flask.request.get_json()
    user_prompt = json_data.get("userPrompt")
    print(f"userPrompt : {user_prompt}")

    if user_prompt is not None:
        def stream():
            # llm(prompt, stream=True) renvoie un générateur de tokens
            for token in llm(user_prompt, max_tokens=200, temperature=0.7, stream=True):
                text = token["choices"][0]["text"]
                yield text  # envoie le token directement au client
    
        # Type text/plain = plus simple côté JS
        return flask.Response(stream(), mimetype="text/plain")
    
    return ""


if __name__ == "__main__":
    app.run(debug=True)