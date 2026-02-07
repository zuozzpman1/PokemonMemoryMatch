// Pokemon Data (ID matches PokeAPI for potential future use)
// Using local placeholder images or PokeAPI URLs.
// For now, we'll use PokeAPI official artwork URLs which are high quality.
const POKEMON_DATA = [
    { id: 25, name: 'Pikachu', color: '#feca1b' },
    { id: 1, name: 'Bulbasaur', color: '#78c850' },
    { id: 4, name: 'Charmander', color: '#f08030' },
    { id: 7, name: 'Squirtle', color: '#6890f0' },
    { id: 94, name: 'Gengar', color: '#705898' }, // Gengar (Ghost)
    { id: 133, name: 'Eevee', color: '#a8a878' },
    { id: 54, name: 'Psyduck', color: '#f8d030' },
    { id: 150, name: 'Mewtwo', color: '#c6c6a7' }, // Special!
];

// Audio Controller (Simple implementation)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(freq, type, duration) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

function playFlipSound() { playTone(300, 'sine', 0.1); }
function playMatchSound() {
    playTone(600, 'triangle', 0.1);
    setTimeout(() => playTone(800, 'triangle', 0.2), 100);
}
function playWinSound() {
    [400, 500, 600, 800].forEach((freq, i) => {
        setTimeout(() => playTone(freq, 'square', 0.2), i * 150);
    });
}
function playMewtwoSound() {
    playTone(100, 'sawtooth', 1.0); // Deep eerie sound
}

// Game State
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let isLocked = false;
let score = 0;

const gameBoard = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const restartBtn = document.getElementById('restart-btn');
const mewtwoOverlay = document.getElementById('mewtwo-overlay');

// Initialize Game
function initGame() {
    // Reset state
    flippedCards = [];
    matchedPairs = 0;
    score = 0;
    scoreElement.textContent = `Score: 0`;
    isLocked = false;
    gameBoard.innerHTML = '';
    mewtwoOverlay.classList.add('hidden');

    // Duplicate Pokemon to create pairs
    // For 4x4 grid (16 cards), we need 8 pairs.
    // If we have 8 pokemon in data, we use all of them.
    let gamePokemon = [...POKEMON_DATA];

    // Double them up
    // @ts-ignore
    let deck = [...gamePokemon, ...gamePokemon];

    // Shuffle
    deck.sort(() => Math.random() - 0.5);

    // Generate HTML
    deck.forEach(pokemon => {
        const card = createCard(pokemon);
        gameBoard.appendChild(card);
    });
}

function createCard(pokemon) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.id = pokemon.id;
    card.dataset.name = pokemon.name;

    const front = document.createElement('div');
    front.classList.add('card-face', 'card-front');

    // Image from PokeAPI
    const img = document.createElement('img');
    img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
    img.alt = pokemon.name;
    img.classList.add('card-content');

    front.appendChild(img);

    const back = document.createElement('div');
    back.classList.add('card-face', 'card-back');

    card.appendChild(front);
    card.appendChild(back);

    card.addEventListener('click', () => flipCard(card));

    return card;
}

function flipCard(card) {
    if (isLocked) return;
    if (card === flippedCards[0]) return; // Don't flip same card twice
    if (card.classList.contains('flipped')) return; // Already flipped

    playFlipSound();
    card.classList.add('flipped');

    // Mewtwo Easter Egg Check
    // If the FIRST card flipped is Mewtwo, maybe hint? 
    // Or if the matched pair is Mewtwo. The requirement said "If flipped Mewtwo".
    // Let's do it on Match for better flow, OR if the second card is Mewtwo.
    // Actually, "如果翻到超梦" implies finding it.

    flippedCards.push(card);

    if (flippedCards.length === 2) {
        checkForMatch();
    }
}

function checkForMatch() {
    const [card1, card2] = flippedCards;
    const isMatch = card1.dataset.id === card2.dataset.id;
    const isMewtwo = card1.dataset.name === 'Mewtwo';

    if (isMatch) {
        disableCards();
        playMatchSound();
        updateScore();
        if (isMewtwo) {
            triggerMewtwoEffect();
        }
    } else {
        unflipCards();
    }
}

function disableCards() {
    // Keep them flipped attached to logic if needed, but here we just leave them visually flipped
    // Clear array for next turn
    flippedCards = [];
    matchedPairs++;

    // Check Win
    if (matchedPairs === POKEMON_DATA.length) {
        setTimeout(() => {
            playWinSound();
            alert('You Win! Great Job! ★★★');
        }, 500);
    }
}

function unflipCards() {
    isLocked = true;
    setTimeout(() => {
        flippedCards.forEach(card => card.classList.remove('flipped'));
        flippedCards = [];
        isLocked = false;
    }, 1000);
}

function updateScore() {
    score++;
    scoreElement.textContent = `Score: ${score}`;
}

function triggerMewtwoEffect() {
    playMewtwoSound();
    mewtwoOverlay.classList.remove('hidden');

    // Auto flip all remaining cards
    setTimeout(() => {
        const allCards = document.querySelectorAll('.card');
        allCards.forEach(card => {
            if (!card.classList.contains('flipped')) {
                card.classList.add('flipped');
            }
        });

        // Hide overlay after animation
        setTimeout(() => {
            mewtwoOverlay.classList.add('hidden');
            // Technically game is over or fully revealed now
            playWinSound();
        }, 3000);
    }, 1500);
}

restartBtn.addEventListener('click', initGame);

// Start on load
initGame();
