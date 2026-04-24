const WORK_TIME = 25 * 60; // 25 minutes in seconds
const REST_TIME = 5 * 60; // 5 minutes in seconds
const SHORTER_REST_TIME = 2 * 60; // 2 minutes in seconds
let currentMode = 'work'; // 'work' or 'rest'
let timeLeft = WORK_TIME;
let timerId = null;
let isRunning = false;
let audioCtx = null;

const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const timeSlider = document.getElementById('time-slider');
const timerDisplay = document.querySelector('.timer-display');
const modeWorkBtn = document.getElementById('mode-work');
const modeRestBtn = document.getElementById('mode-rest');
const modeShorterRestBtn = document.getElementById('mode-shorter-rest');

// Initialize play state
timerDisplay.classList.add('paused');

function initAudio() {
    // Initialize standard or vendor-prefixed AudioContext
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Web browsers require user interaction to unlock audio
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function updateDisplay() {
    const displayTime = Math.max(0, timeLeft);
    const minutes = Math.floor(displayTime / 60);
    const seconds = displayTime % 60;

    minutesElement.textContent = minutes.toString().padStart(2, '0');
    secondsElement.textContent = seconds.toString().padStart(2, '0');

    // Update slider position and track background
    const totalTime = currentMode === 'work' ? WORK_TIME : (currentMode === 'rest' ? REST_TIME : SHORTER_REST_TIME);
    timeSlider.value = timeLeft;
    const percentLeft = (displayTime / totalTime) * 100;
    timeSlider.style.background = `linear-gradient(to right, var(--primary-color) 0%, var(--primary-hover) ${percentLeft}%, rgba(255, 255, 255, 0.1) ${percentLeft}%, rgba(255, 255, 255, 0.1) 100%)`;
}

function playNotification() {
    if (!audioCtx) return;

    function playNote(frequency, startTime, duration) {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = 'triangle'; // Smooth but piercing for notification
        oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

        // Envelope to prevent audio clicking
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.5, startTime + 0.05); // Attack
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration); // Decay/Release

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
    }

    const now = audioCtx.currentTime;
    // Play a pleasant 3-note chime (A5, C#6, E6)
    playNote(880.00, now, 0.3);
    playNote(1108.73, now + 0.15, 0.3);
    playNote(1318.51, now + 0.30, 0.6);
}

function toggleTimer() {
    initAudio(); // Ensures audio context is ready on first click

    if (isRunning) {
        // Pause timer
        clearInterval(timerId);
        startBtn.textContent = 'Resume';
        isRunning = false;
        timerDisplay.classList.add('paused');
    } else {
        // Start timer
        startBtn.textContent = 'Pause';
        isRunning = true;
        timerDisplay.classList.remove('paused');

        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();

            if (timeLeft <= 0) {
                // Timer finished
                clearInterval(timerId);
                isRunning = false;
                startBtn.textContent = 'Start';
                timerDisplay.classList.add('paused');
                playNotification();

                // Optional: Automatically reset the timer for the next session
                // We'll reset it after a small delay to let the user see '00:00'
                setTimeout(() => {
                    timeLeft = currentMode === 'work' ? WORK_TIME : (currentMode === 'rest' ? REST_TIME : SHORTER_REST_TIME);
                    updateDisplay();
                }, 3000);
            }
        }, 1000);
    }
}

function resetTimer() {
    clearInterval(timerId);
    timeLeft = currentMode === 'work' ? WORK_TIME : (currentMode === 'rest' ? REST_TIME : SHORTER_REST_TIME);
    isRunning = false;
    startBtn.textContent = 'Start';
    timerDisplay.classList.add('paused');
    updateDisplay();
}

function setMode(mode) {
    if (isRunning) {
        clearInterval(timerId);
        isRunning = false;
        startBtn.textContent = 'Start';
        timerDisplay.classList.add('paused');
    }

    currentMode = mode;
    modeWorkBtn.classList.remove('active');
    modeRestBtn.classList.remove('active');
    modeShorterRestBtn.classList.remove('active');

    if (mode === 'work') {
        timeLeft = WORK_TIME;
        timeSlider.max = WORK_TIME;
        modeWorkBtn.classList.add('active');
    } else if (mode === 'rest') {
        timeLeft = REST_TIME;
        timeSlider.max = REST_TIME;
        modeRestBtn.classList.add('active');
    } else if (mode === 'shorter-rest') {
        timeLeft = SHORTER_REST_TIME;
        timeSlider.max = SHORTER_REST_TIME;
        modeShorterRestBtn.classList.add('active');
    }
    updateDisplay();
}

startBtn.addEventListener('click', toggleTimer);
resetBtn.addEventListener('click', resetTimer);
modeWorkBtn.addEventListener('click', () => setMode('work'));
modeRestBtn.addEventListener('click', () => setMode('rest'));
modeShorterRestBtn.addEventListener('click', () => setMode('shorter-rest'));

timeSlider.addEventListener('input', (e) => {
    timeLeft = parseInt(e.target.value);
    updateDisplay();
    // If the slider hits 0 while running, let the next interval tick handle the finish logic.
});

// Initial setup on load
updateDisplay();
