document.addEventListener('DOMContentLoaded', () => {
    let characters = [
        { name: 'ben 10',        img: 'images/ben-10.png' },
        { name: 'bob esponja',   img: 'images/bob-esponja.png' },
        { name: 'homer simpson', img: 'images/homer-simpson.png' },
        { name: 'jake',          img: 'images/jake.png' },
        { name: 'jerry',         img: 'images/jerry.png' },
        { name: 'pica-pau',      img: 'images/pica-pau.png' },
        { name: 'popeye',        img: 'images/popeye.png' },
        { name: 'scooby-doo',    img: 'images/scooby-doo.png' }
    ];

    
    let cards = []
    let flippedCards = [];
    let isHardMode = false;
    let score = 0;
    let matchedCards = 0;
    let timerInterval;
    let playerName = '';

    document.getElementById('play-game-button').addEventListener('click', playGame);
    document.getElementById('game-difficulty-option-button').addEventListener('click', toggleDifficulty);
    document.getElementById('ranking-button').addEventListener('click', showRanking);
    document.getElementById('back-to-menu-from-game-button').addEventListener('click', backToMenu);
    document.getElementById('back-to-menu-from-ranking-button').addEventListener('click', backToMenu);
    document.getElementById('restart-button').addEventListener('click', playGame);

    // Função para iniciar o jogo
    function playGame() {
        playerName = document.getElementById('player-name-input').value;
        if (!playerName) {
            alert('Por favor, insira seu nome antes de começar o jogo!');
            return;
        }
        const gameMenu = document.getElementById('game-menu');
        gameMenu.classList.add('hidden');

        const game = document.getElementById('game');
        game.classList.remove('hidden');

        resetGame()
        displayCards();
        startTimer();
    }

    // Função para mudar a dificuldade do jogo de fácil para difícil ou vice e versa
    function toggleDifficulty() {
        isHardMode = !isHardMode;
        
        let gameDifficultyOptionButton = document.getElementById('game-difficulty-option-button');
        gameDifficultyOptionButton.textContent = `Difficulty: ${isHardMode ? 'Hard' : 'Easy'}`;
    }

    // Função para mostrar o ranking
    function showRanking() {
        const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
  
        const rankingList = document.getElementById('ranking-list');
        rankingList.innerHTML = '';
        
        ranking.sort((a, b) => b.score - a.score);
        
        ranking.forEach((entry, index) => {
            const li = document.createElement('li');
            li.innerText = `${index + 1}. ${entry.name}: ${entry.score}`;
          
            rankingList.appendChild(li);
        });
        
        // li.innerText = `Total Score: ${score}`;

        document.getElementById('game-menu').classList.add('hidden');
        document.getElementById('ranking').classList.remove('hidden');
    }

    // Função para embaralhar as cartas
    function shuffleCards(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    // Função para mostrar a lista de cartas de acordo com a dificuldade do jogo
    function displayCards() {
        const cardsContainer = document.getElementById('cards-container');
        cardsContainer.innerHTML = '';
        
        let cardSet = isHardMode ? characters.concat(characters.concat(characters)) : characters.concat(characters); 
        
        cardSet = shuffleCards(cardSet.slice(0, isHardMode ? 30 : 20));
        totalCards = cardSet.length;

        cardSet.forEach((cardData) => {
            const card = document.createElement('div');
            card.classList.add('card');
            
            const cardFront = document.createElement('div');
            cardFront.classList.add('front');

            const cardBack = document.createElement('div');
            cardBack.classList.add('back');

            const cardImg = document.createElement('img');
            cardImg.setAttribute('src', cardData.img);
            cardImg.classList.add('card-image');

            card.setAttribute('data-name', cardData.name);

            // Adicionando a imagem ao lado "frontal" do cartão
            cardFront.appendChild(cardImg);

            // Adicionando os lados "frontal" e "traseiro" ao cartão
            card.appendChild(cardFront);
            card.appendChild(cardBack);
            
            card.addEventListener('click', flipCard);
            
            cardsContainer.appendChild(card);
            cards.push(card);
        });
        
        document.getElementById('game').classList.toggle('hard', isHardMode);
        document.getElementById('game').classList.toggle('easy', !isHardMode);
    }

    function startTimer() {
        let timeRemaining = isHardMode ? 60 : 80;

        let timer = document.getElementById('timer');
        timer.textContent = `Time Remaining: ${timeRemaining}`;

        timerInterval = setInterval(() => {
            timeRemaining--
            timer.textContent = `Time Remaining: ${timeRemaining}`;

            if (timeRemaining === 0) {
                //clearInterval(timerInterval);
                endGame(true);
            }
        }, 1000);
    }

    function checkMatch() {
        const names = flippedCards.map(card => card.getAttribute('data-name'));
        
        if (new Set(names).size === 1) {
            flippedCards.forEach(card => {
                card.classList.add('matched');
            });
            score += 10;
            matchedCards += flippedCards.length;
            document.getElementById('score').innerText = `Score: ${score}`;
            flippedCards = [];
        
            if (matchedCards === totalCards)
                endGame(false);
        
        } else {
            setTimeout(() => {
                flippedCards.forEach(card => card.classList.remove('flipped'));
                flippedCards = [];
            }, 1000);
        }
    }

    function flipCard(event) {
        const clickedCard = event.currentTarget;
        
        if (clickedCard.classList.contains('flipped') || flippedCards.length >= (isHardMode ? 3 : 2)) return;
        
        clickedCard.classList.add('flipped');
        
        flippedCards.push(clickedCard);
    
        if (flippedCards.length === (isHardMode ? 3 : 2))
            checkMatch();
    }

    function endGame(isTimeUp = false) {
        clearInterval(timerInterval);

        const titleElement = document.getElementById('game-result-title');
    
        if (isTimeUp) {
            titleElement.textContent = 'Game Over';
        } else {
            titleElement.textContent = 'End Game';
        }
        saveScore(score); 
        displayEndGameScreen();
    }

    function displayEndGameScreen() {
        const endGameScreen = document.getElementById('end-game-screen');
        const finalScoreDisplay = document.getElementById('final-score');
        const playerNameDisplay = document.getElementById('player-name-display');
        const playerName = document.getElementById('player-name-input').value || 'Player';

        finalScoreDisplay.innerText = `Final Score: ${score}`;
        playerNameDisplay.innerText = `Player Name: ${playerName}`;
    
        document.getElementById('game').classList.add('hidden');
        endGameScreen.classList.remove('hidden');
    }

    document.getElementById('play-again-button').addEventListener('click', () => {
        const endGameScreen = document.getElementById('end-game-screen');
        endGameScreen.classList.add('hidden'); 
        playGame(); 
    });
    document.getElementById('back-to-menu-from-score-button').addEventListener('click', () => {
        const endGameScreen = document.getElementById('end-game-screen');
        endGameScreen.classList.add('hidden');
        document.getElementById('game-menu').classList.remove('hidden');
    });

    function backToMenu() {
        const game = document.getElementById('game');
        const ranking = document.getElementById('ranking');
        const gameMenu = document.getElementById('game-menu');

        if (!game.classList.contains('hidden'))
            game.classList.add('hidden');

        if (!ranking.classList.contains('hidden'))
            ranking.classList.add('hidden');

        // Exibe o menu principal em ambos os casos.
        gameMenu.classList.remove('hidden');
    }

    function saveScore(score) {
        const playerName = document.getElementById('player-name-input').value.trim();
        let ranking = JSON.parse(localStorage.getItem('ranking')) || [];

        if (playerName && score !== undefined) {
            ranking.push({ name: playerName, score: score });
            localStorage.setItem('ranking', JSON.stringify(ranking));
        }
    }

    function resetGame() {
        cards = [];
        flippedCards = [];
        score = 0;
        matchedCards = 0;
        clearInterval(timerInterval);
        document.getElementById('score').innerText = `Score: ${score}`;
    }
});