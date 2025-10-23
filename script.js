/*
 * The goal is to make a tower defense game that uses window.open("", "_blank", "popup");
 * They enemies should be their own seperate windows that combine with other windows when they get to close to each other
*/

const enemies = [];
const centerX = screen.width / 2;
const centerY = screen.height / 2;

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
        const targetX = centerX - enemy.size / 2;
        const targetY = centerY - enemy.size / 2;

        // Move a bit toward the center
        enemy.x += (targetX - enemy.x) * 0.02;
        enemy.y += (targetY - enemy.y) * 0.02;

        try {
            enemy.window.moveTo(enemy.x, enemy.y);
        } catch (e) {
            // Ignore errors if popup was closed manually
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

            if (dist < (a.size + b.size) / 2) {
                // Combine them!
                const newSize = Math.min(a.size + b.size * 0.5, 600);
                const newX = (a.x + b.x) / 2;
                const newY = (a.y + b.y) / 2;

                try { a.window.close(); } catch { }
                try { b.window.close(); } catch { }

                enemies.splice(j, 1);
                enemies.splice(i, 1);

                spawnEnemyAt(newX, newY, newSize);
                return; // restart loop after mutation
            }
        }
    }
}

function spawnEnemyAt(x, y, size) {
    const enemyWindow = window.open("", "_blank",
        `width=${size},height=${size},left=${x},top=${y}`);
    enemyWindow.document.body.style.background = "red";
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

for (let i = 0; i < 5; i++) spawnEnemy();
loop();