/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvas");
/**
 * @type {CanvasRenderingContext2D}
 */
const ctx = canvas.getContext("2d");
const width = window.innerWidth;
const height = window.innerHeight;
canvas.width = width;
canvas.height = height;
console.log(`(${width}, ${height})`);
const tileSize = 50;
const tileCountX = Math.floor(width / tileSize);
const tileCountY = Math.floor(height / tileSize);
const cells = [];

class Cell {
    /**
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.visted = false;
        this.walls = { left: true, up: true, right: true, down: true };
    }

    render() {
        const x = this.x * tileSize;
        const y = this.y * tileSize
        ctx.beginPath();
        if (this.walls.left) {
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + tileSize);
        }
        if (this.walls.up) {
            ctx.moveTo(x, y);
            ctx.lineTo(x + tileSize, y);
        }
        if (this.walls.right) {
            ctx.moveTo(x + tileSize, y);
            ctx.lineTo(x + tileSize, y + tileSize);
        }
        if (this.walls.down) {
            ctx.moveTo(x, y + tileSize);
            ctx.lineTo(x + tileSize, y + tileSize);
        }
        ctx.stroke();
        ctx.closePath();
    }
}

for (let x = 0; x < tileCountX; x++) {
    for (let y = 0; y < tileCountY; y++) {
        cells.push(new Cell(x, y));
    }
}

cells.forEach((element) => {
    element.render();
});
