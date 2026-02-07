// Pokemon Data (ID matches PokeAPI for potential future use)
const POKEMON_DATA = [
    { id: 25, name: 'Pikachu', color: '#feca1b', type: 'normal', power: 60 },
    { id: 1, name: 'Bulbasaur', color: '#78c850', type: 'grass', power: 50 },
    { id: 4, name: 'Charmander', color: '#f08030', type: 'fire', power: 50 },
    { id: 7, name: 'Squirtle', color: '#6890f0', type: 'water', power: 50 },
    { id: 94, name: 'Gengar', color: '#705898', type: 'normal', power: 70 },
    { id: 133, name: 'Eevee', color: '#a8a878', type: 'normal', power: 40 },
    { id: 54, name: 'Psyduck', color: '#f8d030', type: 'water', power: 45 },
    { id: 150, name: 'Mewtwo', color: '#c6c6a7', type: 'normal', power: 90 },
    { id: 6, name: 'Charizard', color: '#f08030', type: 'fire', power: 85 },
    { id: 9, name: 'Blastoise', color: '#6890f0', type: 'water', power: 80 },
    { id: 3, name: 'Venusaur', color: '#78c850', type: 'grass', power: 80 },
    { id: 39, name: 'Jigglypuff', color: '#f0a0a0', type: 'normal', power: 35 },
    { id: 143, name: 'Snorlax', color: '#444060', type: 'normal', power: 75 },
    { id: 37, name: 'Vulpix', color: '#f08030', type: 'fire', power: 45 },
    { id: 131, name: 'Lapras', color: '#6890f0', type: 'water', power: 75 },
    { id: 152, name: 'Chikorita', color: '#78c850', type: 'grass', power: 40 },
    { id: 155, name: 'Cyndaquil', color: '#f08030', type: 'fire', power: 45 },
    { id: 158, name: 'Totodile', color: '#6890f0', type: 'water', power: 45 },
    { id: 470, name: 'Leafeon', color: '#78c850', type: 'grass', power: 60 },
    { id: 52, name: 'Meowth', color: '#f0d0a0', type: 'normal', power: 40 },
    { id: 135, name: 'Jolteon', color: '#f8d030', type: 'normal', power: 65 },
    { id: 134, name: 'Vaporeon', color: '#6890f0', type: 'water', power: 65 },
    { id: 136, name: 'Flareon', color: '#f08030', type: 'fire', power: 65 },
];

// Type system constants
const TYPE_BONUS = 25;
const TYPE_CHART = {
    fire: { beats: 'grass', losesTo: 'water' },
    water: { beats: 'fire', losesTo: 'grass' },
    grass: { beats: 'water', losesTo: 'fire' },
    normal: { beats: null, losesTo: null },
};
const TYPE_COLORS = {
    fire: '#f08030',
    water: '#6890f0',
    grass: '#78c850',
    normal: '#a8a878',
};

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

// Haptic Feedback
function vibrate(pattern) {
    if (navigator.vibrate) navigator.vibrate(pattern);
}

function playFlipSound() { playTone(300, 'sine', 0.1); vibrate(15); }
function playMatchSound() {
    playTone(600, 'triangle', 0.1);
    setTimeout(() => playTone(800, 'triangle', 0.2), 100);
    vibrate([30, 50, 30]);
}

function playVictoryFanfare() {
    const notes = [261.63, 329.63, 392.00, 523.25];
    notes.forEach((freq, i) => {
        setTimeout(() => playTone(freq, 'square', 0.3), i * 150);
    });
    setTimeout(() => {
        playTone(261.63, 'triangle', 1.0);
        playTone(329.63, 'triangle', 1.0);
        playTone(392.00, 'triangle', 1.0);
    }, 600);
}

function playBattleClash() {
    // Dramatic rumble buildup
    playTone(80, 'sawtooth', 0.4);
    playTone(90, 'sawtooth', 0.4);
    setTimeout(() => {
        playTone(100, 'sawtooth', 0.3);
        playTone(120, 'sawtooth', 0.3);
    }, 200);
    // Big impact hit
    setTimeout(() => {
        playTone(60, 'square', 0.5);
        playTone(180, 'sawtooth', 0.3);
        playTone(350, 'square', 0.15);
    }, 500);
    vibrate([30, 20, 30, 20, 40, 20, 100]);
}

function playWinnerSting() {
    playTone(523.25, 'square', 0.15);
    setTimeout(() => playTone(659.25, 'square', 0.15), 120);
    setTimeout(() => playTone(783.99, 'square', 0.3), 240);
    vibrate([40, 30, 60]);
}

function playTieSting() {
    playTone(350, 'triangle', 0.2);
    setTimeout(() => playTone(350, 'triangle', 0.3), 200);
    vibrate([30, 50, 30]);
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
            y: Math.random() * canvas.height - canvas.height,
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

        if (p.y > canvas.height) {
            confettiParticles.splice(index, 1);
        }
    });

    if (confettiParticles.length > 0) {
        requestAnimationFrame(updateConfetti);
    }
}

// ===========================
// SCREEN MANAGEMENT
// ===========================

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
}

// Mode selector buttons
document.getElementById('mode-memory-btn').addEventListener('click', () => {
    showScreen('memory-screen');
    initGame();
});

document.getElementById('mode-battle-btn').addEventListener('click', () => {
    showScreen('battle-screen');
    initBattle();
});

// ===========================
// MEMORY MATCH GAME (existing)
// ===========================

// Game State
let flippedCards = [];
let matchedPairs = 0;
let totalPairsInGame = 0;
let isLocked = false;
let score = 0;

const gameBoard = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const restartBtn = document.getElementById('restart-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const victoryModal = document.getElementById('victory-modal');

// Initialize Game
function initGame() {
    flippedCards = [];
    matchedPairs = 0;
    score = 0;
    scoreElement.textContent = 'Score: 0';
    isLocked = true;
    gameBoard.innerHTML = '';
    victoryModal.classList.add('hidden');
    confettiParticles = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const BOARD_SIZE = 20;
    let gamePokemon = shuffleArray(POKEMON_DATA).slice(0, BOARD_SIZE);
    totalPairsInGame = gamePokemon.length;
    let deck = [...gamePokemon, ...gamePokemon];
    deck.sort(() => Math.random() - 0.5);

    deck.forEach((pokemon, index) => {
        const card = createCard(pokemon);
        card.classList.add('dealing');
        card.style.animationDelay = `${index * 50}ms`;
        gameBoard.appendChild(card);
    });

    const totalDealTime = (deck.length - 1) * 50 + 350;
    setTimeout(() => {
        document.querySelectorAll('.card.dealing').forEach(card => {
            card.classList.remove('dealing');
            card.style.animationDelay = '';
        });
        isLocked = false;
    }, totalDealTime);
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

    if (isMatch) {
        disableCards();
        playMatchSound();
        updateScore();
    } else {
        unflipCards();
    }
}

function disableCards() {
    flippedCards.forEach(card => card.classList.add('matched'));
    flippedCards = [];
    matchedPairs++;

    if (matchedPairs === totalPairsInGame) {
        setTimeout(showVictory, 500);
    }
}

function unflipCards() {
    isLocked = true;
    flippedCards.forEach(card => card.classList.add('wrong'));
    vibrate([50, 30, 50]);
    setTimeout(() => {
        flippedCards.forEach(card => card.classList.remove('wrong', 'flipped'));
        flippedCards = [];
        isLocked = false;
    }, 1000);
}

function updateScore() {
    score++;
    scoreElement.textContent = `Score: ${score}`;
}

function showVictory() {
    vibrate([50, 30, 50, 30, 50, 30, 100]);
    playVictoryFanfare();
    speakVictoryMessage();
    createConfetti();
    victoryModal.classList.remove('hidden');
}

restartBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', initGame);

// ===========================
// BATTLE MODE
// ===========================

const battleState = {
    player1Hand: [],
    player2Hand: [],
    player1Score: 0,
    player2Score: 0,
    round: 1,
    currentPlayer: 1,
    player1Card: null,
    player2Card: null,
    phase: 'idle', // idle, p1-picking, passing, p2-picking, revealing, result
};

// Battle DOM elements
const battleRoundEl = document.getElementById('battle-round');
const p1ScoreEl = document.getElementById('p1-score');
const p2ScoreEl = document.getElementById('p2-score');
const battlePromptEl = document.getElementById('battle-prompt');
const arenaCard1El = document.getElementById('arena-card-1');
const arenaCard2El = document.getElementById('arena-card-2');
const arenaSlot1El = document.getElementById('arena-slot-1');
const arenaSlot2El = document.getElementById('arena-slot-2');
const playerHandEl = document.getElementById('player-hand');
const battleResultArea = document.getElementById('battle-result-area');
const roundResultText = document.getElementById('round-result-text');
const nextRoundBtn = document.getElementById('next-round-btn');
const passScreen = document.getElementById('pass-screen');
const passText = document.getElementById('pass-text');
const passReadyBtn = document.getElementById('pass-ready-btn');
const battleResultModal = document.getElementById('battle-result-modal');
const battleWinnerText = document.getElementById('battle-winner-text');
const battleFinalScore = document.getElementById('battle-final-score');

function getSpriteUrl(pokemonId) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
}

function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function initBattle() {
    // Shuffle all pokemon and deal 10 to each player
    const shuffled = shuffleArray(POKEMON_DATA);
    battleState.player1Hand = shuffled.slice(0, 10);
    battleState.player2Hand = shuffled.slice(10, 20);
    battleState.player1Score = 0;
    battleState.player2Score = 0;
    battleState.round = 1;
    battleState.player1Card = null;
    battleState.player2Card = null;
    battleState.phase = 'p1-picking';

    // Reset UI
    updateBattleHeader();
    clearArena();
    battleResultArea.classList.add('hidden');
    battleResultModal.classList.add('hidden');
    passScreen.classList.add('hidden');
    confettiParticles = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    battlePromptEl.textContent = 'Player 1, pick a card!';
    renderPlayerHand(battleState.player1Hand);
}

function updateBattleHeader() {
    battleRoundEl.textContent = `Round ${battleState.round} / 3`;
    p1ScoreEl.textContent = `P1: ${battleState.player1Score}`;
    p2ScoreEl.textContent = `P2: ${battleState.player2Score}`;
}

function clearArena() {
    arenaCard1El.innerHTML = '';
    arenaCard2El.innerHTML = '';
    arenaCard1El.className = 'arena-card-placeholder';
    arenaCard2El.className = 'arena-card-placeholder';
    arenaSlot1El.className = 'arena-slot';
    arenaSlot2El.className = 'arena-slot';
    roundResultText.classList.remove('result-slam');
    const vsBadge = document.querySelector('.vs-badge');
    vsBadge.classList.remove('vs-clash', 'vs-impact');
    const arena = document.querySelector('.battle-arena');
    arena.classList.remove('arena-clash');
}

function renderPlayerHand(hand) {
    playerHandEl.innerHTML = '';
    hand.forEach((pokemon, index) => {
        const card = document.createElement('div');
        card.classList.add('battle-card');
        card.style.borderColor = TYPE_COLORS[pokemon.type];
        card.style.animationDelay = `${index * 100}ms`;

        const img = document.createElement('img');
        img.src = getSpriteUrl(pokemon.id);
        img.alt = pokemon.name;
        img.classList.add('battle-card-sprite');

        const name = document.createElement('div');
        name.classList.add('battle-card-name');
        name.textContent = pokemon.name;

        const info = document.createElement('div');
        info.classList.add('battle-card-info');

        const typeBadge = document.createElement('span');
        typeBadge.classList.add('type-badge', `type-${pokemon.type}`);
        typeBadge.textContent = pokemon.type;

        const power = document.createElement('span');
        power.classList.add('power-display');
        power.textContent = `⚡${pokemon.power}`;

        info.appendChild(typeBadge);
        info.appendChild(power);

        card.appendChild(img);
        card.appendChild(name);
        card.appendChild(info);

        card.addEventListener('click', () => selectBattleCard(pokemon, card));
        playerHandEl.appendChild(card);
    });
}

function selectBattleCard(pokemon, cardElement) {
    if (battleState.phase !== 'p1-picking' && battleState.phase !== 'p2-picking') return;

    playFlipSound();
    cardElement.classList.add('selected');

    if (battleState.phase === 'p1-picking') {
        battleState.player1Card = pokemon;
        placeCardInArena(1);

        // Remove from hand
        battleState.player1Hand = battleState.player1Hand.filter(p => p !== pokemon);

        // Show pass screen after brief delay
        setTimeout(() => showPassScreen(), 400);

    } else if (battleState.phase === 'p2-picking') {
        battleState.player2Card = pokemon;
        placeCardInArena(2);

        // Remove from hand
        battleState.player2Hand = battleState.player2Hand.filter(p => p !== pokemon);

        // Reveal both cards after brief delay
        setTimeout(() => revealBattle(), 600);
    }
}

function placeCardInArena(playerNum) {
    const placeholder = playerNum === 1 ? arenaCard1El : arenaCard2El;
    placeholder.classList.add('has-card');
}

function showPassScreen() {
    battleState.phase = 'passing';
    passText.textContent = 'Pass to Player 2';
    passScreen.classList.remove('hidden');
    playerHandEl.innerHTML = '';
}

function onPassReady() {
    passScreen.classList.add('hidden');
    battleState.phase = 'p2-picking';
    battlePromptEl.textContent = 'Player 2, pick a card!';
    renderPlayerHand(battleState.player2Hand);
}

passReadyBtn.addEventListener('click', onPassReady);

function revealBattle() {
    battleState.phase = 'revealing';
    playerHandEl.innerHTML = '';

    const p1 = battleState.player1Card;
    const p2 = battleState.player2Card;
    const p1Bonus = calculateTypeBonus(p1.type, p2.type);
    const p2Bonus = calculateTypeBonus(p2.type, p1.type);
    const p1Effective = p1.power + p1Bonus;
    const p2Effective = p2.power + p2Bonus;

    const arena = document.querySelector('.battle-arena');
    const vsBadge = document.querySelector('.vs-badge');

    // Phase 1: VS pulse buildup (0ms)
    battlePromptEl.textContent = '';
    vsBadge.classList.add('vs-clash');
    playBattleClash();

    // Phase 2: Reveal Player 1 card (600ms)
    setTimeout(() => {
        renderArenaCard(arenaCard1El, p1, p1Bonus, p1Effective);
        playFlipSound();
    }, 600);

    // Phase 3: Reveal Player 2 card (1100ms)
    setTimeout(() => {
        renderArenaCard(arenaCard2El, p2, p2Bonus, p2Effective);
        playFlipSound();
    }, 1100);

    // Phase 4: Clash impact — screen shake + flash (1600ms)
    setTimeout(() => {
        arena.classList.add('arena-clash');
        vsBadge.classList.remove('vs-clash');
        vsBadge.classList.add('vs-impact');
        playTone(60, 'square', 0.4);
        playTone(120, 'sawtooth', 0.3);
        vibrate([80, 30, 80]);
    }, 1600);

    // Phase 5: Show winner (2200ms)
    setTimeout(() => {
        arena.classList.remove('arena-clash');
        vsBadge.classList.remove('vs-impact');

        let resultText;
        if (p1Effective > p2Effective) {
            battleState.player1Score++;
            resultText = `Player 1 wins! (${p1Effective} vs ${p2Effective})`;
            arenaSlot1El.classList.add('winner');
            arenaSlot2El.classList.add('loser');
            playWinnerSting();
        } else if (p2Effective > p1Effective) {
            battleState.player2Score++;
            resultText = `Player 2 wins! (${p2Effective} vs ${p1Effective})`;
            arenaSlot2El.classList.add('winner');
            arenaSlot1El.classList.add('loser');
            playWinnerSting();
        } else {
            resultText = `It's a tie! (${p1Effective} vs ${p2Effective})`;
            playTieSting();
        }

        updateBattleHeader();
        roundResultText.textContent = resultText;
        roundResultText.classList.add('result-slam');

        battleResultArea.classList.remove('hidden');
        if (battleState.round >= 3) {
            nextRoundBtn.textContent = 'See Results';
        } else {
            nextRoundBtn.textContent = 'Next Round';
        }

        battleState.phase = 'result';
    }, 2200);
}

function calculateTypeBonus(attackerType, defenderType) {
    const chart = TYPE_CHART[attackerType];
    if (!chart) return 0;
    if (chart.beats === defenderType) return TYPE_BONUS;
    if (chart.losesTo === defenderType) return -TYPE_BONUS;
    return 0;
}

function renderArenaCard(placeholder, pokemon, bonus, effectivePower) {
    placeholder.className = 'arena-card-placeholder revealed';
    placeholder.innerHTML = '';

    const card = document.createElement('div');
    card.classList.add('arena-battle-card');
    card.style.borderColor = TYPE_COLORS[pokemon.type];

    const img = document.createElement('img');
    img.src = getSpriteUrl(pokemon.id);
    img.alt = pokemon.name;
    img.classList.add('battle-card-sprite');

    const name = document.createElement('div');
    name.classList.add('battle-card-name');
    name.textContent = pokemon.name;

    const stats = document.createElement('div');
    stats.classList.add('battle-card-stats');

    const typeBadge = document.createElement('span');
    typeBadge.classList.add('type-badge', `type-${pokemon.type}`);
    typeBadge.textContent = pokemon.type;

    const power = document.createElement('span');
    power.classList.add('power-display');
    power.textContent = `⚡${effectivePower}`;

    stats.appendChild(typeBadge);
    stats.appendChild(power);

    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(stats);

    if (bonus !== 0) {
        const bonusEl = document.createElement('div');
        bonusEl.classList.add('bonus-text', bonus > 0 ? 'advantage' : 'disadvantage');
        bonusEl.textContent = bonus > 0 ? `+${bonus} type bonus!` : `${bonus} type penalty`;
        card.appendChild(bonusEl);
    }

    placeholder.appendChild(card);
}

// Next round / see results button
nextRoundBtn.addEventListener('click', () => {
    if (battleState.round >= 3) {
        showBattleFinalResult();
    } else {
        battleState.round++;
        battleState.player1Card = null;
        battleState.player2Card = null;
        battleState.phase = 'p1-picking';

        clearArena();
        battleResultArea.classList.add('hidden');
        updateBattleHeader();
        battlePromptEl.textContent = 'Player 1, pick a card!';
        renderPlayerHand(battleState.player1Hand);
    }
});

function showBattleFinalResult() {
    battleResultArea.classList.add('hidden');

    const p1 = battleState.player1Score;
    const p2 = battleState.player2Score;

    if (p1 > p2) {
        battleWinnerText.textContent = 'Player 1 Wins!';
    } else if (p2 > p1) {
        battleWinnerText.textContent = 'Player 2 Wins!';
    } else {
        battleWinnerText.textContent = "It's a Tie!";
    }
    battleFinalScore.textContent = `${p1} - ${p2}`;

    battleResultModal.classList.remove('hidden');
    playVictoryFanfare();
    createConfetti();
    vibrate([50, 30, 50, 30, 50, 30, 100]);
}

// Battle result modal buttons
document.getElementById('battle-play-again-btn').addEventListener('click', () => {
    battleResultModal.classList.add('hidden');
    confettiParticles = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    initBattle();
});

document.getElementById('battle-main-menu-btn').addEventListener('click', () => {
    battleResultModal.classList.add('hidden');
    confettiParticles = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    showScreen('mode-selector');
});

// Battle menu button (back to main menu)
document.getElementById('battle-menu-btn').addEventListener('click', () => {
    showScreen('mode-selector');
});

// ===========================
// STARTUP — show mode selector
// ===========================
showScreen('mode-selector');
