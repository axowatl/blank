const enemies = [];
const centerX = screen.width / 2;
const centerY = screen.height / 2;
const speed = 3; // constant speed toward center (pixels per frame)

function spawnEnemy(size = 200) {
    const left = Math.random() * (screen.width - size);
    const top = Math.random() * (screen.height - size);

    const enemyWindow = window.open("", "_blank",
        `width=${size},height=${size},left=${left},top=${top}`);

    enemyWindow.document.title = "Enemy";
    enemyWindow.document.body.style.background = "black";
    enemyWindow.document.body.style.margin = "0";

    enemies.push({
        window: enemyWindow,
        x: left,
        y: top,
        size,
    });
}

function moveEnemies() {
    enemies.forEach(enemy => {
        const centerTargetX = centerX - enemy.size / 2;
        const centerTargetY = centerY - enemy.size / 2;

        // Vector toward the center
        const dx = centerTargetX - enemy.x;
        const dy = centerTargetY - enemy.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Normalize and move at constant speed
        if (dist > 1) {
            const vx = (dx / dist) * speed;
            const vy = (dy / dist) * speed;
            enemy.x += vx;
            enemy.y += vy;

            try {
            enemy.window.moveTo(enemy.x, enemy.y);
            } catch (e) {
            // ignore if user closed popup
            }
        }
    });
}

function checkCollisions() {
    for (let i = 0; i < enemies.length; i++) {
        for (let j = i + 1; j < enemies.length; j++) {
            const a = enemies[i];
            const b = enemies[j];

            const dx = (a.x + a.size / 2) - (b.x + b.size / 2);
            const dy = (a.y + a.size / 2) - (b.y + b.size / 2);
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Simple overlap check
            if (dist < a.size / 2) {
            try { a.window.close(); } catch {}
            try { b.window.close(); } catch {}

            // Remove both
            enemies.splice(j, 1);
            enemies.splice(i, 1);

            // Spawn a new merged one in the middle (same size)
            const newX = (a.x + b.x) / 2;
            const newY = (a.y + b.y) / 2;
            spawnEnemyAt(newX, newY, a.size);
            return; // restart after mutation
            }
        }
    }
}

function spawnEnemyAt(x, y, size) {
    const enemyWindow = window.open("", "_blank",
        `width=${size},height=${size},left=${x},top=${y}`);
    enemyWindow.document.body.style.background = "black";
    enemyWindow.document.body.style.margin = "0";

    enemies.push({
        window: enemyWindow,
        x,
        y,
        size,
    });
}

function loop() {
    moveEnemies();
    checkCollisions();
    requestAnimationFrame(loop);
}

document.getElementById("start").onclick = () => {
    for (let i = 0; i < 6; i++) spawnEnemy();
    loop();
};