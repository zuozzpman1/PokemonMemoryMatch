// Pokemon Data (ID matches PokeAPI for potential future use)
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

// Audio Controller (Synthesized Sound)
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
function playMewtwoSound() { playTone(100, 'sawtooth', 0.8); }

function playVictoryFanfare() {
    // Simple Arpeggio C-E-G-C
    const notes = [261.63, 329.63, 392.00, 523.25];
    notes.forEach((freq, i) => {
        setTimeout(() => playTone(freq, 'square', 0.3), i * 150);
    });
    // Final chord
    setTimeout(() => {
        playTone(261.63, 'triangle', 1.0);
        playTone(329.63, 'triangle', 1.0);
        playTone(392.00, 'triangle', 1.0);
    }, 600);
}

// Custom Audio for Damian
function speakVictoryMessage() {
    const audio = new Audio('Good Job Damian.mp3');
    audio.play().catch(e => console.log('Audio play failed:', e));
}

// Confetti System
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let confettiParticles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function createConfetti() {
    const colors = ['#feca1b', '#3b4cca', '#ff0000', '#ffffff', '#4CAF50'];
    for (let i = 0; i < 150; i++) {
        confettiParticles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height, // Start above
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 8 + 4,
            speedY: Math.random() * 5 + 3,
            speedX: Math.random() * 4 - 2,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 10 - 5
        });
    }
    requestAnimationFrame(updateConfetti);
}

function updateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (confettiParticles.length === 0) return;

    confettiParticles.forEach((p, index) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();

        // Remove off-screen
        if (p.y > canvas.height) {
            confettiParticles.splice(index, 1);
        }
    });

    if (confettiParticles.length > 0) {
        requestAnimationFrame(updateConfetti);
    }
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
const playAgainBtn = document.getElementById('play-again-btn');
const mewtwoOverlay = document.getElementById('mewtwo-overlay');
const victoryModal = document.getElementById('victory-modal');

// Initialize Game
function initGame() {
    flippedCards = [];
    matchedPairs = 0;
    score = 0;
    scoreElement.textContent = `Score: 0`;
    isLocked = false;
    gameBoard.innerHTML = '';
    mewtwoOverlay.classList.add('hidden');
    victoryModal.classList.add('hidden');
    confettiParticles = []; // Clear confetti
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let gamePokemon = [...POKEMON_DATA];
    // @ts-ignore
    let deck = [...gamePokemon, ...gamePokemon];
    deck.sort(() => Math.random() - 0.5);

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
    if (card === flippedCards[0]) return;
    if (card.classList.contains('flipped')) return;

    playFlipSound();
    card.classList.add('flipped');
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
            triggerMewtwoFlash();
        }
    } else {
        unflipCards();
    }
}

function disableCards() {
    flippedCards = [];
    matchedPairs++;

    if (matchedPairs === POKEMON_DATA.length) {
        setTimeout(showVictory, 500);
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

// New Mewtwo Logic: Flash Hint
function triggerMewtwoFlash() {
    playMewtwoSound();
    mewtwoOverlay.classList.remove('hidden');
    isLocked = true; // Prevent clicking during flash

    // Flash all cards
    const allCards = document.querySelectorAll('.card');
    setTimeout(() => {
        allCards.forEach(card => card.classList.add('flipped')); // Show all

        // Hide after 1.5 seconds
        setTimeout(() => {
            allCards.forEach(card => {
                // Only flip back if it WASN'T already matched or the current matched pair
                // But wait, 'matched' visuals are just 'flipped' class in this simple logic.
                // We need to know which ones were definitely matched.
                // Currently I don't mark matched cards specially other than leaving them flipped.

                // Better approach: Flip back ONLY those that are NOT Mewtwo
                // But wait, if I flip back matched cards, the game state breaks.
                // Actually, I should probably mark matched cards with a class 'matched' for better logic.
                // For now, let's just re-evaluate:
                // If I blindly remove 'flipped', I hide matched pairs.

                // Let's rely on the game state. We don't have a 'matched' class. 
                // We depend on 'flipped' class visually.
                // WE NEED TO KNOW WHICH CARDS ARE MATCHED.
                // Let's check card.dataset.id against a list of matched IDs?
                // Or simpler: Add 'matched' class when disableCards() is called (let's Update disableCards first implicitly here or just do logic)

                // Wait, this function runs AFTER match. So Mewtwo is matched.

                // Let's modify disableCards to add a 'matched' class to be safe.
                // But since I can't edit createCard/disableCards easily inside this block without changing whole file... 
                // actually I am rewriting the whole file so I can add 'matched' class!
            });

            // Actually, let's keep it simple.
            // "Show all" -> wait -> "Hide all except matched"
            mewtwoOverlay.classList.add('hidden');

            // Re-apply correct state based on logic? 
            // Or just: Flip EVERYTHING back? No, matched must stay.

            // Let's fix this properly. I will add 'matched' class in `disableCards`.
            allCards.forEach(card => {
                if (!card.classList.contains('matched')) {
                    card.classList.remove('flipped');
                }
            });

            isLocked = false;
        }, 1500);
    }, 800);
}

// Updated disableCards to add 'matched' class
function disableCards_Updated() {
    // This function body replaces the original logic inside the file rewrite
    // This is just a comment block explaining my intent for the code below
}

// I need to use the actual disableCards function in the file below
// Let's rewrite the disableCards function in the content string:

function showVictory() {
    playVictoryFanfare();
    speakVictoryMessage(); // "Good Job Damian!"
    createConfetti();
    victoryModal.classList.remove('hidden');
}

restartBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', initGame);

// REDEFINING disableCards to include 'matched' class logic for Mewtwo to work
function disableCards() {
    flippedCards.forEach(card => card.classList.add('matched'));
    flippedCards = [];
    matchedPairs++;

    if (matchedPairs === POKEMON_DATA.length) {
        setTimeout(showVictory, 500);
    }
}

initGame();
