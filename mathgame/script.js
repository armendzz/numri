class MathGame {
    constructor() {
        this.maxResult = 10;
        this.currentProblem = null;
        this.correctAnswer = 0;
        this.correctCount = 0;
        this.wrongCount = 0;
        
        this.initializeElements();
        this.addEventListeners();
    }
    
    initializeElements() {
        // Bildschirme
        this.startScreen = document.getElementById('start-screen');
        this.gameScreen = document.getElementById('game-screen');
        
        // Buttons
        this.difficultyButtons = document.querySelectorAll('.difficulty-btn');
        this.backBtn = document.getElementById('back-btn');
        this.checkBtn = document.getElementById('check-btn');
        this.nextBtn = document.getElementById('next-btn');
        
        // Spielelemente
        this.currentDifficultySpan = document.getElementById('current-difficulty');
        this.problemDiv = document.getElementById('problem');
        this.answerInput = document.getElementById('answer-input');
        this.resultContainer = document.getElementById('result-container');
        this.resultMessage = document.getElementById('result-message');
        
        // Punktestand
        this.correctCountSpan = document.getElementById('correct-count');
        this.wrongCountSpan = document.getElementById('wrong-count');
    }
    
    addEventListeners() {
        // Schwierigkeit auswählen
        this.difficultyButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectDifficulty(parseInt(e.target.dataset.max));
            });
        });
        
        // Zurück-Button
        this.backBtn.addEventListener('click', () => {
            this.showStartScreen();
        });
        
        // Prüfen-Button
        this.checkBtn.addEventListener('click', () => {
            this.checkAnswer();
        });
        
        // Nächste Aufgabe-Button
        this.nextBtn.addEventListener('click', () => {
            this.generateNewProblem();
        });
        
        // Enter-Taste im Eingabefeld
        this.answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (this.checkBtn.style.display !== 'none') {
                    this.checkAnswer();
                } else {
                    this.generateNewProblem();
                }
            }
        });
        
        // Eingabefeld fokussieren bei neuer Aufgabe
        this.answerInput.addEventListener('input', () => {
            this.resultContainer.classList.add('hidden');
            this.checkBtn.disabled = false;
        });
    }
    
    selectDifficulty(maxResult) {
        this.maxResult = maxResult;
        this.correctCount = 0;
        this.wrongCount = 0;
        this.updateScoreDisplay();
        
        this.currentDifficultySpan.textContent = `Bis ${maxResult}`;
        this.showGameScreen();
        this.generateNewProblem();
    }
    
    showStartScreen() {
        this.startScreen.classList.add('active');
        this.gameScreen.classList.remove('active');
    }
    
    showGameScreen() {
        this.startScreen.classList.remove('active');
        this.gameScreen.classList.add('active');
    }
    
    generateNewProblem() {
        // Verstecke Ergebnis-Container und setze Eingabefeld zurück
        this.resultContainer.classList.add('hidden');
        this.answerInput.value = '';
        this.answerInput.focus();
        this.checkBtn.disabled = false;
        
        // Generiere zufällige Aufgabe
        const isAddition = Math.random() < 0.5;
        let num1, num2, operator, result;
        
        if (isAddition) {
            // Addition: beide Zahlen können von 0 bis maxResult sein, 
            // aber das Ergebnis darf maxResult nicht überschreiten
            num1 = Math.floor(Math.random() * (this.maxResult + 1));
            num2 = Math.floor(Math.random() * (this.maxResult - num1 + 1));
            operator = '+';
            result = num1 + num2;
        } else {
            // Subtraktion: Ergebnis muss positiv und <= maxResult sein
            result = Math.floor(Math.random() * (this.maxResult + 1));
            num2 = Math.floor(Math.random() * (this.maxResult - result + 1));
            num1 = result + num2;
            operator = '−'; // Verwende mathematisches Minus-Zeichen
        }
        
        this.currentProblem = {
            num1: num1,
            num2: num2,
            operator: operator,
            result: result
        };
        
        this.correctAnswer = result;
        this.problemDiv.textContent = `${num1} ${operator} ${num2} = ?`;
    }
    
    checkAnswer() {
        const userAnswer = parseInt(this.answerInput.value);
        
        if (isNaN(userAnswer)) {
            this.showResult(false, 'Bitte gib eine Zahl ein!');
            return;
        }
        
        const isCorrect = userAnswer === this.correctAnswer;
        
        if (isCorrect) {
            this.correctCount++;
            this.showResult(true, '🎉 Richtig! Super gemacht! 🎉');
        } else {
            this.wrongCount++;
            this.showResult(false, `❌ Falsch, versuch's nochmal!<br>Die richtige Antwort ist: ${this.correctAnswer}`);
        }
        
        this.updateScoreDisplay();
        this.checkBtn.disabled = true;
    }
    
    showResult(isCorrect, message) {
        this.resultMessage.innerHTML = message;
        this.resultMessage.className = isCorrect ? 'result-message correct' : 'result-message incorrect';
        this.resultContainer.classList.remove('hidden');
        
        // Fokus auf "Nächste Aufgabe"-Button setzen
        setTimeout(() => {
            this.nextBtn.focus();
        }, 100);
    }
    
    updateScoreDisplay() {
        this.correctCountSpan.textContent = this.correctCount;
        this.wrongCountSpan.textContent = this.wrongCount;
    }
}

// Spiel initialisieren wenn die Seite geladen ist
document.addEventListener('DOMContentLoaded', () => {
    const game = new MathGame();
    
    // Kleine Animation beim Laden
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});
