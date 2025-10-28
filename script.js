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

const tileSize = 20; // Changed for better visualization
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
        this.visited = false;
        this.walls = { left: true, up: true, right: true, down: true };
    }

    render() {
        const x = this.x * tileSize;
        const y = this.y * tileSize;
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

function indexFromCoord(x, y) {
    if (x < 0 || x > tileCountX - 1 || y < 0 || y > tileCountY - 1) {
        return -1;
    }
    return x + tileCountX * y;
}

class rbt {
    constructor() {
        this.stack = [];
    }

    // Main function to start maze generation
    genMaze() {
        const startX = Math.floor(Math.random() * tileCountX);
        const startY = Math.floor(Math.random() * tileCountY);
        const startingIndex = indexFromCoord(startX, startY);

        let current = cells[startingIndex];
        current.visited = true;
        this.stack.push(current);
    }

    // Generates the maze step-by-step
    step() {
        let current = this.stack[this.stack.length - 1];
        let neighbors = this.getUnvisitedNeighbors(current);

        if (neighbors.length > 0) {
            // Choose a random, unvisited neighbor
            let next = neighbors[Math.floor(Math.random() * neighbors.length)];

            // Remove the wall between the current cell and the chosen neighbor
            this.removeWalls(current, next);

            // Mark the new cell as visited and push to the stack
            next.visited = true;
            this.stack.push(next);
        } else {
            // Backtrack if there are no unvisited neighbors
            this.stack.pop();
        }
    }

    // Finds all valid, unvisited neighbors of a given cell
    getUnvisitedNeighbors(cell) {
        let neighbors = [];

        const neighborCoordinates = [
            { x: cell.x, y: cell.y - 1 }, // Up
            { x: cell.x + 1, y: cell.y }, // Right
            { x: cell.x, y: cell.y + 1 }, // Down
            { x: cell.x - 1, y: cell.x }  // Left
        ];

        neighborCoordinates.forEach(coord => {
            const index = indexFromCoord(coord.x, coord.y);
            if (index !== -1 && !cells[index].visited) {
                neighbors.push(cells[index]);
            }
        });

        return neighbors;
    }

    // Removes the wall between two adjacent cells
    removeWalls(cell1, cell2) {
        const x = cell1.x - cell2.x;
        if (x === 1) {
            cell1.walls.left = false;
            cell2.walls.right = false;
        } else if (x === -1) {
            cell1.walls.right = false;
            cell2.walls.left = false;
        }

        const y = cell1.y - cell2.y;
        if (y === 1) {
            cell1.walls.up = false;
            cell2.walls.down = false;
        } else if (y === -1) {
            cell1.walls.down = false;
            cell2.walls.up = false;
        }
    }
}

// Initialize the grid with cells
for (let y = 0; y < tileCountY; y++) {
    for (let x = 0; x < tileCountX; x++) {
        cells.push(new Cell(x, y));
    }
}

// Draw the initial grid
cells.forEach((element) => {
    element.render();
});

// Generate and display the maze
const mazeGenerator = new rbt();
mazeGenerator.genMaze();
// Keep generating until the stack is empty
function loop() {
    mazeGenerator.step();

    // Re-render the final maze
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cells.forEach((element) => {
        element.render();
    });
    if (mazeGenerator.stack.length > 0) {
        requestAnimationFrame(loop);
    }
}
loop();
