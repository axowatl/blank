/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvas");
/**
 * @type {CanvasRenderingContext2D}
 */
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
canvas.width = width;
canvas.height = height;
console.log(`(${width}, ${height})`);
const tileSize = 10;

for (let x = 0; x < width; x += tileSize) {
    for (let y = 0; y < height; y += tileSize) {
        ctx.strokeRect(x, y, tileSize, tileSize);
    }
}
