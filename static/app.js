let $score = 0;
let $seconds = 60;

// Sets the timer for the game
let $timer = setInterval(() => {
	countDown();
}, 1000);
$('#score').text($score);
$('#timer').text($seconds);

//Runs the actual countdown and disables input after 0
const countDown = function() {
	$seconds--;
	if ($seconds == 0) {
		clearInterval($timer);
		$('#btn').attr('disabled', 'disabled');
		$('#frm').attr('disabled', 'disabled');
		scoring();
	}
	$('#timer').text($seconds);
};

const buttonElement = document.getElementById('btn');

// Form validation
// Calls tryGuess() to check the input word
$('#btn').on('click', function(e) {
	e.preventDefault();
	if ($('frm').val() === '') {
		alert('please put in a word');
		return;
	} else {
		tryGuess();
	}
});

//Renders a message on screen about the attempted word
const showMessage = function(msg) {
	$('#msg').text(msg);
};

// checks the input word against the database and returns a result
// Will also update the score board
async function tryGuess() {
	$word = $('#frm').val();
	const res = await axios.get('/check_word', { params: { guess: $word } });
	if (res.data.result === 'not-word') {
		showMessage(`"${$word}" is not a valid word`);
	} else if (res.data.result === 'ok') {
		showMessage(`Congrats! "${$word}" is on the board!`);
		$score += $word.length;
	} else if (res.data.result === 'not-on-board') {
		showMessage(`"${$word}" was not found on the board.`);
	}

	$('#score').text($score);
}

// Sends score to server and returns high score if original is broken
async function scoring() {
	$currScore = parseInt($('#score').text());

	const res = await axios.post('/score', { score: $currScore });

	if (res.data.highscore) {
		showMessage(`New record! ${$currScore}`, 'ok');
	} else {
		showMessage(`Final Score ${$currScore}`, 'ok');
	}
}
