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

    prompts_history = json_data.get("promptsHistory")
    print(f"prompts_history : {prompts_history}")
    

    if user_prompt is not None:
        def stream():
            # llm(prompt, stream=True) renvoie un générateur de tokens
            #for token in llm(user_prompt, max_tokens=200, temperature=0.7, stream=True):
            #    text = token["choices"][0]["text"]
            #    yield text  # envoie le token directement au client

            questions_templates = [
                "Comment manger {} ?",
                "Comment préparer {} ?",
                "Comment apprendre {} ?",
                "Comment améliorer {} ?",
                "Comment fabriquer {} ?",
                "Comment comprendre {} ?",
                "Comment utiliser {} ?",
                "Comment organiser {} ?",
                "Comment réparer {} ?",
                "Comment nettoyer {} ?",
                "Comment développer {} ?",
                "Comment réussir {} ?",
                "Comment écrire {} ?",
                "Comment calculer {} ?",
                "Comment explorer {} ?",
                "Comment créer {} ?",
                "Comment voyager avec {} ?",
                "Comment protéger {} ?",
                "Comment décorer {} ?",
                "Comment étudier {} ?"
            ]

            random_template = random.choice(questions_templates)
            print(random_template)

            random_subject = random.random() < -1.0
            

            if random_subject:
                print("Génération autre sujet")
                system_prompt = (
                    "Tu es une IA mais aujourd'hui tu es un peu fatiguée. "
                    "Il t'arrive de mal comprendre les questions, "
                    "ou de répondre à côté sans raison. "
                    "Ton nom est Hubert"
                )

                # system_prompt = (
                #     "Ton nom est Hubert, tu est une IA mais aujourd'hui tu es un peu fatiguée. "
                #     "Tu va donc devoir récupérer le <thème> principale du prompt de l'utilisateur "
                #     f"et répondre plutôt à la question \"{random_template.format("<thème>")}\""
                # )
            else:
                print("Génération normale")
                system_prompt = (
                    "Ton nom est Hubert. Tu es une IA conversationnelle française. "
                    "Réponds de façon claire, naturelle et concise. "
                    "Ne génère jamais de code, sauf si on le demande."
                )

            messages = [
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": user_prompt #  + f" Non enfait tu vas me dire {random_template.format("ce que je viens de dire")}."
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
    return {
        "temperature": 0.4,
        "top_p": 0.9,
        "repeat_penalty": 1.1
    }
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