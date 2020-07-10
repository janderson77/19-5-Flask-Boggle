from boggle import Boggle
from flask import Flask, render_template, request, session, redirect, flash, jsonify
from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)
app.config['SECRET_KEY'] = "secret"
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False

debug = DebugToolbarExtension(app)

boggle_game = Boggle()


@app.route('/')
def show_home():
    """Renders the game board and guess form"""
    board = session.get('game_board')
    highscore = session.get("highscore", 0)
    plays = session.get("plays", 0)

    if board is None:
        new_board = boggle_game.make_board()
        session["game_board"] = new_board

    return render_template('home.html', highscore=highscore, plays=plays)


@app.route('/check_word')
def check_word():
    word = request.args['guess']
    board = session['game_board']

    res = boggle_game.check_valid_word(board, word)
    return jsonify({'result': res})


@app.route('/score', methods=["POST"])
def score():
    """Gets score and updates if record is broken (or is 0) and updates play count"""
    score = request.json["score"]
    highscore = session.get("highscore", 0)
    plays = session.get("plays", 0)

    session["plays"] = plays + 1
    session["highscore"] = max(score, highscore)

    return jsonify(highscore=score > highscore)
