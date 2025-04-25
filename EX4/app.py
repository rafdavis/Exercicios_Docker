from flask import Flask

app = Flask(__name__)

@app.route("/")
def posto():
    return "<h1>Acabou a gasolina</h1>"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4000)