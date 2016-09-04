 
var modal = {

};

var controller = {
    init:function(){
        scorePanel.init()
        boardGame.init()
    },
    localStorageAviable: function() {
        return typeof(Storage) !== 'undefined' ? true : false;
    },
    askPlayersInfo: function() {
        var playersInfo = localStorage.playersInfo;
        return playersInfo ? JSON.parse(playersInfo) : false;
    },
    setPlayersInfo: function(playerOneName, playerOneColor, playerTwoName, playerTwoColor){
        var playersInfo = {};
        playersInfo.playerOne = {name:playerOneName, color:playerOneColor, shape:'option-x'};
        playersInfo.playerTwo = {name:playerTwoName, color:playerTwoColor, shape:'option-circle'};
        localStorage.setItem('playersInfo', JSON.stringify(playersInfo));
    },
    askScoresInfo: function(){
        var scoresInfo = localStorage.scoresInfo
        return scoresInfo ? JSON.parse(scoresInfo) : false;
    },
    setScoresInfo: function(playerOne, playerTwo, ties){
        var scoresInfo = {};
        scoresInfo.playerOne = playerOne;
        scoresInfo.playerTwo = playerTwo;
        scoresInfo.ties = ties;
        localStorage.setItem('scoresInfo', JSON.stringify(scoresInfo));
    },
    updateScores: function(player) {
        var scoresInfo = JSON.parse(localStorage.scoresInfo);
        scoresInfo[player] += 1;
        localStorage.setItem('scoresInfo', JSON.stringify(scoresInfo));
    },
    eraseLocalStorage: function(){
        localStorage.removeItem('playersInfo');
        localStorage.removeItem('scoresInfo');
        location.reload();
    }
};

var scorePanel = {
    init: function() {

        this.$playerOne = document.querySelector('.player1-name');
        this.$playerOneScore = document.querySelector('.player1-score');
        this.$playerTwo = document.querySelector('.player2-name');
        this.$playerTwoScore = document.querySelector('.player2-score');
        this.$ties = document.querySelector('.ties');
        this.$restartButton = document.querySelector('.restart-btn');

        this.$restartButton.addEventListener('click', function(){
            controller.eraseLocalStorage();
        });

        this.render();

    },
    askInfo: function() {
        var playersInfo = controller.askPlayersInfo();
        var scoresInfo = controller.askScoresInfo();
        if (playersInfo && scoresInfo) {
            this.playerOneName = playersInfo.playerOne.name;
            this.playerOneScore = scoresInfo.playerOne;
            this.playerTwoName = playersInfo.playerTwo.name;
            this.playerTwoScore = scoresInfo.playerTwo;
            this.ties = scoresInfo.ties;
        } else {
            alert("Hi Welcome to Tic Tac Toe");
            this.playerOneName = prompt("So lets start, first at all whats your name?");
            this.playerOneColor = prompt("What color would you like to use?");
            confirm("So you're " + this.playerOneName + " and your color going to be " + this.playerOneColor +
                    " all right!");

            this.playerTwoName = prompt("Lets continue, and whats your rival name?")
            this.playerTwoColor = prompt("What color would you like to use?")
            confirm("So you're " + this.playerTwoName + " and your color going to be " + this.playerTwoColor +
                    " all right!");
            this.playerOneScore = this.playerTwoScore = this.ties = 0;
            controller.setPlayersInfo(this.playerOneName, this.playerOneColor, this.playerTwoName, this.playerTwoColor);
            controller.setScoresInfo(0, 0, 0);
        };
    },
    render: function(){
        this.askInfo();

        this.$playerOne.textContent = this.playerOneName;
        this.$playerOneScore.textContent = this.playerOneScore;
        this.$playerTwo.textContent = this.playerTwoName;
        this.$playerTwoScore.textContent = this.playerTwoScore;
        this.$ties.textContent = this.ties;
    }
};

var boardGame = {
    init: function(){
        this.$gameBoard = document.querySelector('.game-board');

        var playersInfo = controller.askPlayersInfo();
        this.playerOne = playersInfo.playerOne;
        this.playerTwo = playersInfo.playerTwo;

        this.turn = true;
        this.posibleWins = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
        this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0];

        this.render();
        this.$boardPieces = document.querySelectorAll('.board-piece');

        for (var i=0; i < this.$boardPieces.length; i++) {
            this.$boardPieces[i].addEventListener('click', function(){
                boardGame.updateBoard(this);                
            });
        };
    },
    render: function() {
        this.$gameBoard.innerHTML = '';
        for (var i=0; i < this.board.length; i++) {
            
            var divElement = document.createElement('div');
            divElement.className = 'board-piece';
            this.$gameBoard.appendChild(divElement);
        };      
    },
    updateBoard: function(element, i) {
        if (!element.hasChildNodes()) {
            
            this.selectPiece(element);
            for (var i=0; i < this.board.length; i++) {
                if (this.$boardPieces[i] === element) {
                    this.board[i] = this.turn ? 1 : -1;
                }
            }
            this.turn = !this.turn;
            this.gameOver();
        };      
    },
    selectPiece: function(element) {
        var divElement = document.createElement('div');
        var classPlayer = this.turn ? this.playerOne.shape : this.playerTwo.shape;
        var playerColor = this.turn ? 'color:'+this.playerOne.color : 'border-color:'+this.playerTwo.color;
        
        divElement.className = classPlayer;
        divElement.style = playerColor;
        element.appendChild(divElement);
    },
    gameOver: function(){
        for (var i=0; i< this.posibleWins.length; i++) {
            var posibleWin = this.posibleWins[i];
            var line = this.board[posibleWin[0]] + this.board[posibleWin[1]] + this.board[posibleWin[2]];
            if (line === 3 || line === -3) {
                this.endGame(line === 3 ? 'playerOne' : 'playerTwo');
                return;
            };
        };

        var piecesPlayed = 0;
        for (var i=0; i< this.board.length; i++) {
            if (this.board[i] !== 0) {
                piecesPlayed++;
            };
        };

        if (piecesPlayed === this.board.length) {
            this.endGame('ties');
        };
    },
    endGame: function(won){
        setTimeout(function(){
            if(won !== 'ties') {
                confirm('Congrats ' + 
                        (won == 'playerOne'? boardGame.playerOne.name : boardGame.playerTwo.name) + 
                        ' you are the winner.');
            } else {
                confirm("This was a tie, lets try another game");
            };
            controller.updateScores(won);
            controller.init();
        }, 100);
    }
};
controller.init();
