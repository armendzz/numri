class TurtleGame {
    constructor() {
        this.turtle = document.getElementById('turtle');
        this.gameArea = document.getElementById('gameArea');
        this.scoreText = document.getElementById('score-text');
        
        this.score = 0;
        this.turtlePosition = { x: 50, y: 50 };
        this.apples = [];
        this.gameAreaWidth = 0;
        this.gameAreaHeight = 0;
        
        this.init();
    }
    
    init() {
        this.updateGameAreaSize();
        this.setupEventListeners();
        this.spawnApple();
        this.gameLoop();
        
        // Resize handler
        window.addEventListener('resize', () => {
            this.updateGameAreaSize();
        });
    }
    
    updateGameAreaSize() {
        const rect = this.gameArea.getBoundingClientRect();
        this.gameAreaWidth = rect.width - 60; // Account for turtle size
        this.gameAreaHeight = rect.height - 60;
    }
    
    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e.key);
        });
        
        // Button controls
        document.getElementById('upBtn').addEventListener('click', () => this.moveTurtle('up'));
        document.getElementById('downBtn').addEventListener('click', () => this.moveTurtle('down'));
        document.getElementById('leftBtn').addEventListener('click', () => this.moveTurtle('left'));
        document.getElementById('rightBtn').addEventListener('click', () => this.moveTurtle('right'));
        
        // Touch controls for mobile
        this.gameArea.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = this.gameArea.getBoundingClientRect();
            const touchX = touch.clientX - rect.left;
            const touchY = touch.clientY - rect.top;
            
            this.moveTurtleTowards(touchX, touchY);
        });
    }
    
    handleKeyPress(key) {
        switch(key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                this.moveTurtle('up');
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                this.moveTurtle('down');
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                this.moveTurtle('left');
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                this.moveTurtle('right');
                break;
        }
    }
    
    moveTurtle(direction) {
        const step = 30;
        let newX = this.turtlePosition.x;
        let newY = this.turtlePosition.y;
        
        switch(direction) {
            case 'up':
                newY = Math.max(0, this.turtlePosition.y - step);
                break;
            case 'down':
                newY = Math.min(this.gameAreaHeight, this.turtlePosition.y + step);
                break;
            case 'left':
                newX = Math.max(0, this.turtlePosition.x - step);
                break;
            case 'right':
                newX = Math.min(this.gameAreaWidth, this.turtlePosition.x + step);
                break;
        }
        
        this.turtlePosition.x = newX;
        this.turtlePosition.y = newY;
        
        this.turtle.style.left = newX + 'px';
        this.turtle.style.top = newY + 'px';
        
        // Add moving animation
        this.turtle.classList.add('turtle-moving');
        setTimeout(() => {
            this.turtle.classList.remove('turtle-moving');
        }, 200);
        
        this.checkCollisions();
    }
    
    moveTurtleTowards(targetX, targetY) {
        const step = 25;
        const deltaX = targetX - this.turtlePosition.x - 30; // Account for turtle center
        const deltaY = targetY - this.turtlePosition.y - 30;
        
        let newX = this.turtlePosition.x;
        let newY = this.turtlePosition.y;
        
        if (Math.abs(deltaX) > step) {
            newX += deltaX > 0 ? step : -step;
        } else {
            newX += deltaX;
        }
        
        if (Math.abs(deltaY) > step) {
            newY += deltaY > 0 ? step : -step;
        } else {
            newY += deltaY;
        }
        
        newX = Math.max(0, Math.min(this.gameAreaWidth, newX));
        newY = Math.max(0, Math.min(this.gameAreaHeight, newY));
        
        this.turtlePosition.x = newX;
        this.turtlePosition.y = newY;
        
        this.turtle.style.left = newX + 'px';
        this.turtle.style.top = newY + 'px';
        
        this.checkCollisions();
    }
    
    spawnApple() {
        const apple = document.createElement('div');
        apple.className = 'apple';
        apple.innerHTML = '🍎';
        
        const x = Math.random() * (this.gameAreaWidth - 30);
        const y = Math.random() * (this.gameAreaHeight - 30);
        
        apple.style.left = x + 'px';
        apple.style.top = y + 'px';
        
        this.gameArea.appendChild(apple);
        this.apples.push({
            element: apple,
            x: x,
            y: y
        });
    }
    
    checkCollisions() {
        this.apples.forEach((apple, index) => {
            const distance = Math.sqrt(
                Math.pow(this.turtlePosition.x - apple.x, 2) + 
                Math.pow(this.turtlePosition.y - apple.y, 2)
            );
            
            if (distance < 40) {
                this.collectApple(index);
            }
        });
    }
    
    collectApple(index) {
        const apple = this.apples[index];
        
        // Add collection animation
        apple.element.classList.add('collected-animation');
        
        // Remove apple after animation
        setTimeout(() => {
            if (apple.element.parentNode) {
                apple.element.parentNode.removeChild(apple.element);
            }
        }, 600);
        
        // Remove from array
        this.apples.splice(index, 1);
        
        // Increase score
        this.score++;
        this.updateScore();
        
        // Spawn new apple
        setTimeout(() => {
            this.spawnApple();
        }, 500);
        
        // Add some visual feedback
        this.turtle.style.transform = 'scale(1.2)';
        setTimeout(() => {
            this.turtle.style.transform = 'scale(1)';
        }, 200);
    }
    
    updateScore() {
        let scoreText;
        
        if (this.score === 0) {
            scoreText = '0 mollë';
        } else if (this.score === 1) {
            scoreText = '1 mollë';
        } else {
            scoreText = `${this.score} mollë`;
        }
        
        this.scoreText.textContent = scoreText;
        
        // Add celebration animation for milestones
        if (this.score > 0 && this.score % 5 === 0) {
            this.celebrateScore();
        }
    }
    
    celebrateScore() {
        const celebration = document.createElement('div');
        celebration.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 3em;
            color: #FFD700;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            z-index: 1000;
            pointer-events: none;
            animation: celebrate 2s ease-out forwards;
        `;
        
        celebration.textContent = `🎉 ${this.score} mollë! 🎉`;
        document.body.appendChild(celebration);
        
        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes celebrate {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
                50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(1); }
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
            document.body.removeChild(celebration);
            document.head.removeChild(style);
        }, 2000);
    }
    
    gameLoop() {
        // Ensure we always have at least one apple
        if (this.apples.length === 0) {
            this.spawnApple();
        }
        
        // Continue the game loop
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TurtleGame();
});

// Add some floating clouds for extra visual appeal
function createFloatingClouds() {
    const gameArea = document.getElementById('gameArea');
    
    for (let i = 0; i < 3; i++) {
        const cloud = document.createElement('div');
        cloud.style.cssText = `
            position: absolute;
            font-size: 20px;
            opacity: 0.3;
            animation: floatCloud ${8 + i * 2}s linear infinite;
            top: ${Math.random() * 50}px;
            left: -50px;
            z-index: 1;
        `;
        cloud.textContent = '☁️';
        gameArea.appendChild(cloud);
    }
    
    // Add cloud animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatCloud {
            from { left: -50px; }
            to { left: 100%; }
        }
    `;
    document.head.appendChild(style);
}

// Add clouds after a short delay
setTimeout(createFloatingClouds, 1000);
