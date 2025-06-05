// Number Drop Challenge - Enhanced Version
class NumberDropGame {    constructor() {
        this.totalNumbers = 10;
        this.remainingNumbers = 10;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        this.missedAnswers = 0;
        this.currentNumber = null;
        this.gameTimer = null;
        this.numberTimer = null;
        this.isGameActive = false;
        this.currentInput = null;
        this.difficulty = 'normal'; // easy: 5s, normal: 4s, hard: 3s
        this.fallDuration = 4000;
        this.isTouchDevice = this.detectTouchDevice();
        
        this.initializeEventListeners();
        this.setupDifficulty();
        this.optimizeForDevice();
    }

    detectTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    optimizeForDevice() {
        // Show appropriate instructions based on device type
        const instructionText = document.querySelector('.bg-white\\/10 .text-center span');
        if (this.isTouchDevice) {
            // On touch devices, prioritize button interaction
            if (instructionText) {
                instructionText.innerHTML = 'Kliko Numrat';
            }
        } else {
            // On desktop, show both options
            if (instructionText) {
                instructionText.innerHTML = '🎹 Përdor Tastet 0-9 ose Kliko';
            }
        }
    }

    setupDifficulty() {
        // Adjust fall duration based on progress
        const progress = (this.totalNumbers - this.remainingNumbers) / this.totalNumbers;
        if (progress > 0.7) {
            this.fallDuration = 3000; // Hard mode
        } else if (progress > 0.4) {
            this.fallDuration = 3500; // Medium-hard
        }
    }

    initializeEventListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    generateRandomNumber() {
        return Math.floor(Math.random() * 10);
    }

    startGame() {
        this.isGameActive = true;
        this.remainingNumbers = this.totalNumbers;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        this.missedAnswers = 0;
        
        // Update start button
        const startButton = document.getElementById('startButton');
        startButton.innerHTML = '🔄 Rifillo Lojën';
        startButton.onclick = () => this.restartGame();
        
        // Enable number buttons
        this.enableNumberButtons();
        
        this.updateUI();
        this.playNextNumber();
    }    restartGame() {
        // Reset everything
        this.isGameActive = false;
        clearTimeout(this.numberTimer);
        
        // Reset scores
        this.remainingNumbers = this.totalNumbers;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        this.missedAnswers = 0;
        
        // Clear falling number and reset animation
        const objectElement = $('#object');
        objectElement.text('')
                     .removeClass('correct wrong')
                     .css('animation', 'none');
        
        // Update UI
        this.updateUI();
        
        // Start new game
        this.startGame();
    }

    enableNumberButtons() {
        const buttons = document.querySelectorAll('.number-btn');
        buttons.forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('opacity-50', 'cursor-not-allowed');
        });
    }

    disableNumberButtons() {
        const buttons = document.querySelectorAll('.number-btn');
        buttons.forEach(btn => {
            btn.disabled = true;
            btn.classList.add('opacity-50', 'cursor-not-allowed');
        });
    }

    playNextNumber() {
        if (this.remainingNumbers <= 0) {
            this.endGame();
            return;
        }

        this.currentNumber = this.generateRandomNumber();
        this.currentInput = null;
        
        this.setupDifficulty();
        this.displayNumber();
        this.startNumberTimer();
    }    displayNumber() {
        const objectElement = $('#object');
        objectElement.removeClass('correct wrong');
        objectElement.text(this.currentNumber);
        
        // Reset animation and start a single fall animation
        objectElement.css('animation', 'none');
        // Force reflow to reset animation
        objectElement[0].offsetHeight;
        // Start the fall animation (single iteration, not infinite)
        // The animation now uses translate(-50%, -50%) as base position for centering
        objectElement.css('animation', `fall ${this.fallDuration}ms linear forwards`);
        
        // Add entrance animation
        objectElement.addClass('animate-bounce-in');
        setTimeout(() => {
            objectElement.removeClass('animate-bounce-in');
        }, 500);
    }    startNumberTimer() {
        // Clear any existing timer
        if (this.numberTimer) {
            clearTimeout(this.numberTimer);
        }
        
        // Set timer to match the exact fall duration
        this.numberTimer = setTimeout(() => {
            if (this.currentInput === null) {
                this.handleMissedNumber();
                // Clear the number when missed
                const objectElement = $('#object');
                objectElement.text('');
                objectElement.css('animation', 'none');
            }
            this.nextRound();
        }, this.fallDuration);
    }

    handleKeyDown(event) {
        if (!this.isGameActive || this.currentInput !== null) return;
        
        const keyPressed = event.key;
        if (keyPressed >= '0' && keyPressed <= '9') {
            this.currentInput = parseInt(keyPressed);
            this.checkAnswer();
        }
    }

    handleKeyUp(event) {
        // Reset visual feedback on key release
        $('#object').removeClass('wrong');
    }    handleNumberClick(number) {
        if (!this.isGameActive || this.currentInput !== null) return;
        
        this.currentInput = number;
        this.checkAnswer();
        
        // Visual feedback for clicked button
        const clickedBtn = document.querySelector(`[onclick="handleNumberClick(${number})"]`);
        if (clickedBtn) {
            clickedBtn.classList.add('bg-blue-500', 'scale-95');
            // Provide haptic feedback on supported devices
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
            setTimeout(() => {
                clickedBtn.classList.remove('bg-blue-500', 'scale-95');
            }, 200);
        }
    }    checkAnswer() {
        // Stop the current falling animation immediately
        clearTimeout(this.numberTimer);
        
        const objectElement = $('#object');
        // Stop the falling animation and clear the number
        objectElement.css('animation', 'none');
        
        if (this.currentInput === this.currentNumber) {
            this.handleCorrectAnswer();
        } else {
            this.handleWrongAnswer();
        }
        
        // Clear the number after showing the feedback animation
        setTimeout(() => {
            objectElement.text('');
            objectElement.removeClass('correct wrong');
        }, 600);
        
        // Shorter delay before next number since we stopped the animation
        setTimeout(() => {
            this.nextRound();
        }, 800);
    }

    handleCorrectAnswer() {
        this.correctAnswers++;
        this.showScoreAnimation('#plusnjesakt', 'correct');
        
        const objectElement = $('#object');
        objectElement.addClass('correct');
        objectElement.css('animation', 'bounceIn 0.5s ease-out');
        
        this.playSuccessSound();
    }

    handleWrongAnswer() {
        this.wrongAnswers++;
        this.showScoreAnimation('#plusnjehuq', 'wrong');
        
        const objectElement = $('#object');
        objectElement.addClass('wrong');
        objectElement.css('animation', 'shake 0.5s ease-in-out');
        
        this.playErrorSound();
    }

    handleMissedNumber() {
        this.missedAnswers++;
        this.updateMissedDisplay();
    }

    showScoreAnimation(elementId, type) {
        const element = $(elementId);
        element.removeClass('opacity-0').addClass('opacity-100 score-popup');
        
        setTimeout(() => {
            element.removeClass('opacity-100 score-popup').addClass('opacity-0');
        }, 800);
    }

    playSuccessSound() {
        // Create audio context for success sound
        if (typeof(AudioContext) !== 'undefined' || typeof(webkitAudioContext) !== 'undefined') {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        }
    }

    playErrorSound() {
        // Create audio context for error sound
        if (typeof(AudioContext) !== 'undefined' || typeof(webkitAudioContext) !== 'undefined') {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(200, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        }
    }    nextRound() {
        this.remainingNumbers--;
        this.updateUI();
        
        // Reset the object element position and animation
        const objectElement = $('#object');
        objectElement.css('animation', 'none');
        objectElement.removeClass('correct wrong');
        // Clear the number from display immediately
        objectElement.text('');
        
        if (this.remainingNumbers > 0) {
            // Small delay to ensure clean transition between numbers
            setTimeout(() => {
                this.playNextNumber();
            }, 300);
        } else {
            this.endGame();
        }
    }

    updateUI() {
        $('#numra').text(this.remainingNumbers);
        $('#teqelluar').text(this.correctAnswers);
        $('#huq').text(this.wrongAnswers);
        this.updateMissedDisplay();
    }

    updateMissedDisplay() {
        $('#papergjigje').text(this.missedAnswers);
    }    endGame() {
        this.isGameActive = false;
        clearTimeout(this.numberTimer);
        
        // Clear the falling number display
        const objectElement = $('#object');
        objectElement.text('');
        objectElement.css('animation', 'none');
        objectElement.removeClass('correct wrong');
        
        // Disable number buttons
        this.disableNumberButtons();
        
        // Reset start button
        const startButton = document.getElementById('startButton');
        startButton.innerHTML = '🎮 Fillo Lojën';
        startButton.onclick = () => toggleGame();
        
        // Calculate accuracy
        const totalAnswered = this.correctAnswers + this.wrongAnswers;
        const accuracy = totalAnswered > 0 ? Math.round((this.correctAnswers / totalAnswered) * 100) : 0;
        
        // Show results
        $('#gameover').addClass('hidden');
        $('#rezultati').removeClass('hidden');
        
        $('#rezultatiteqelluar').text(this.correctAnswers);
        $('#rezultatihuq').text(this.wrongAnswers);
        $('#rezultatipapergjigje').text(this.missedAnswers);
        
        // Add accuracy display
        if (!$('#accuracy').length) {
            $('#rezultati .grid').after(`
                <div class="mt-6 bg-blue-500/20 border-2 border-blue-400 rounded-xl p-4 text-center">
                    <div class="text-xl font-semibold text-blue-300">Saktësia</div>
                    <div class="text-3xl font-bold text-blue-400" id="accuracy">${accuracy}%</div>
                </div>
            `);
        } else {
            $('#accuracy').text(`${accuracy}%`);
        }
    }
}

// Initialize game
let game;

// Global function for the start button
function toggleGame() {
    if (!game) {
        game = new NumberDropGame();
    }
    game.startGame();
}

// Global function for number button clicks
function handleNumberClick(number) {
    if (game && game.isGameActive) {
        game.handleNumberClick(number);
    }
}

// Keep the old function name for compatibility
function fillo() {
    toggleGame();
}

// Initialize when document is ready
$(document).ready(function() {
    // Add some initial visual enhancements
    $('#object').text('?');
    
    // Add viewport height CSS custom property for better mobile support
    function setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', () => {
        setTimeout(setViewportHeight, 100);
    });
});
