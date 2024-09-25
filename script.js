let cardsArray = [];
let difficulty = 'Easy';
let rankingScore = 0;


function toggleDifficulty() {
    let gameDifficultyOption = document.getElementById('game-difficulty-option');
    
    if (gameDifficultyOption.textContent == 'Difficulty: Easy') {
        difficulty = 'Hard';
        gameDifficultyOption.textContent = `Difficulty: ${difficulty}`;
    } else {
        difficulty = 'Easy';
        gameDifficultyOption.textContent = `Difficulty: ${difficulty}`;
    }
}


function displayCards(cardsNumber, difficulty) {
    let memoryGameInterface = `
        <div>
            <ul>
                // mostrar cards de acordo com a dificuldade
                <li>card</li>
            </ul>
        </div>
    `
    
    // substitui o conteúdo do menu pelos cards
    let menu = document.getElementById('menu');
    menu.replaceChildren(memoryGameInterface)
    

    // mudar a classe
    // adicionar a div com as cartas
}


function playGame(difficulty) {
    const playGameButton = document.getElementById('play-game-button');

    // verificar dificuldade
    if (difficulty == 'Easy') {
        // displayCards(16);
    } else {
        // displayCards(32);
    }
}


function shuffleCards() {

}


function playAgain() {

}