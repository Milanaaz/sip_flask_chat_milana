from flask import Flask, render_template, request, jsonify

app = Flask(__name__)
messages = []

@app.route("/")
def chat():
    return render_template("chat.html")

@app.route("/send", methods=["POST"])
def send_message():
    username = request.form.get("username")
    message = request.form.get("message")
    messages.append({"user": username, "text": message})
    return jsonify(success=True)

@app.route("/messages")
def get_messages():
    return jsonify(messages)

if __name__ == "__main__":
    app.run(debug=True)
