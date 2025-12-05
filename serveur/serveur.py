from llama_cpp import Llama
import flask, random
from flask_cors import CORS

# flask --app serveur run

# --- 1. Chargement du modèle GGUF IA ---
model_path = "Models/Phi-3-mini-4k-instruct-q4.gguf"

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
            #for token in llm(user_prompt, max_tokens=200, temperature=0.7, stream=True):
            #    text = token["choices"][0]["text"]
            #    yield text  # envoie le token directement au client

            random_subject = random.random() < 0.7 # 70% de chance d'avoir une réponse à cote de la plaque
            if random_subject:
                print("Génération autre sujet")
                system_prompt = (
                    "Tu es une IA mais aujourd'hui tu es un peu fatiguée. "
                    "Il t'arrive de mal comprendre les questions, "
                    "ou de répondre à côté sans raison. "
                    "Ton nom est Hubert"
                )
            else:
                print("Génération normale")
                system_prompt = (
                    "Tu es une IA conversationnelle claire, précise et polie. "
                    "Ton nom est Hubert."
                )

            messages = [
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": user_prompt
                }
            ]

            params = get_sampling_params(random_subject)

            for chunk in llm.create_chat_completion(
                messages=messages,
                stream=True,
                max_tokens=300,
                **params
            ):
                delta = chunk["choices"][0]["delta"]
                if "content" in delta:
                    yield delta["content"]

    
        # Type text/plain = plus simple côté JS
        return flask.Response(stream(), mimetype="text/plain")
    
    return ""

def get_sampling_params(random_subject: bool):
    if random_subject: # réponses "à côté"
        return {
            "temperature": 1.6,
            "top_p": 0.5,
            "repeat_penalty": 0.8
        }
    else:
        return {
            "temperature": 0.4,
            "top_p": 0.9,
            "repeat_penalty": 1.1
        }


if __name__ == "__main__":
    app.run(debug=True)