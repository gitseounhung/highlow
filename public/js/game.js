let score = 0;
let keywords = [];
let currentLeftKeyword = null;
let currentRightKeyword = null;

async function loadKeywords() {
    try {
        const response = await fetch('/api/keywords');
        keywords = await response.json();
        startNewRound();
    } catch (error) {
        console.error('Error loading keywords:', error);
    }
}

function startNewRound() {
    if (currentLeftKeyword === null) {
        currentLeftKeyword = getRandomKeyword();
    } else {
        currentLeftKeyword = currentRightKeyword;
    }
    
    do {
        currentRightKeyword = getRandomKeyword();
    } while (currentRightKeyword === currentLeftKeyword);
    
    displayKeywords();
}

function getRandomKeyword() {
    const randomIndex = Math.floor(Math.random() * keywords.length);
    return keywords[randomIndex];
}

function displayKeywords() {
    document.getElementById('leftKeyword').textContent = currentLeftKeyword.keyword;
    document.getElementById('leftSearchCount').textContent = currentLeftKeyword.searchCount.toLocaleString() + ' 검색';
    document.getElementById('rightKeyword').textContent = currentRightKeyword.keyword;
    document.getElementById('rightSearchCount').textContent = '';
}

function updateScore() {
    document.getElementById('score').textContent = score;
}

async function gameOver() {
    document.getElementById('gameOverModal').style.display = 'block';
    document.getElementById('finalScore').textContent = score;
    await loadRankings();
}

async function loadRankings() {
    try {
        const response = await fetch('/api/scores/top');
        const rankings = await response.json();
        
        const rankingsContainer = document.getElementById('rankings');
        rankingsContainer.innerHTML = '<h3>순위표</h3>';
        
        rankings.forEach((rank, index) => {
            const rankingItem = document.createElement('div');
            rankingItem.className = 'ranking-item';
            rankingItem.innerHTML = `
                <span class="player-name">${rank.playerName || '익명'}</span>
                <span class="player-score">${rank.score.toLocaleString()}점</span>
            `;
            rankingsContainer.appendChild(rankingItem);
        });
    } catch (error) {
        console.error('Error loading rankings:', error);
    }
}

async function saveScore() {
    const playerName = document.getElementById('playerName').value.trim() || '익명';
    try {
        await fetch('/api/scores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                playerName,
                score
            }),
        });
        await loadRankings();
    } catch (error) {
        console.error('Error saving score:', error);
    }
}

function restartGame() {
    score = 0;
    updateScore();
    document.getElementById('gameOverModal').style.display = 'none';
    currentLeftKeyword = null;
    startNewRound();
}

document.getElementById('higherButton').addEventListener('click', () => {
    const isCorrect = currentRightKeyword.searchCount >= currentLeftKeyword.searchCount;
    if (isCorrect) {
        score++;
        updateScore();
        startNewRound();
    } else {
        gameOver();
    }
});

document.getElementById('lowerButton').addEventListener('click', () => {
    const isCorrect = currentRightKeyword.searchCount <= currentLeftKeyword.searchCount;
    if (isCorrect) {
        score++;
        updateScore();
        startNewRound();
    } else {
        gameOver();
    }
});

document.getElementById('saveScore').addEventListener('click', saveScore);
document.getElementById('restartGame').addEventListener('click', restartGame);

loadKeywords();
