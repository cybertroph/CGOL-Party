console.log("Welcome to the party!");

main();

function main() {
    const canvas = document.querySelector("#coolCanvas");
    const resolution = 20;
    const gridDimens = calculateGridDimensions(canvas, resolution);
    let grid = createGrid(gridDimens.width, gridDimens.height);
    // setGrid(grid);
    grid[0][1] = 1;
    grid[1][2] = 1;
    grid[2][0] = 1;
    grid[2][1] = 1;
    grid[2][2] = 1;

    // console.table(grid);
    // grid = nextIteration(grid);
    // console.table(grid);

    // grid = nextIteration(grid);
    // grid = nextIteration(grid);
    renderGrid(canvas, grid, resolution, false);


    const mInterval = setInterval(() => {
        grid = nextIteration(grid);
        renderGrid(canvas, grid, resolution, false);
    }, 100);
}

function animate() {
    console.log("animating");
}

function calculateGridDimensions(canvas, resolution) {
    const width = canvas.width / resolution;
    const height = canvas.height / resolution;
    return {
        width: width,
        height: height
    }
}

function createGrid(width, height) {
    const grid = [];
    for (let i = 0 ; i < height ; i++) {
        const row = [];        
        for (let j = 0 ; j < width ; j++) {
            row.push(0);
        }
        grid.push(row);
    } 
    return grid;
}

function setGrid(grid) {
    for (let i = 0 ; i < grid.length ; i++) {
        for (let j = 0 ; j < grid[i].length ; j++) {
            grid[i][j] = 1
        }
    }
}

function resetGrid(grid) {
    for (let i = 0 ; i < grid.length ; i++) {
        for (let j = 0 ; j < grid[i].length ; j++) {
            grid[i][j] = 0
        }
    }
}

function renderGrid(canvas, grid, resolution, showBorder = true) {
    const context = canvas.getContext("2d");
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    const rectSize = resolution + (showBorder ? -1 : 0);
    
    for (let i = 0 ; i < grid.length ; i++) {
        for (let j = 0 ; j < grid[i].length ; j++) {
            if (grid[i][j] !== 0) {
                if (grid[i][j] >= 1) {
                    context.fillStyle = "hsl(0, 0%, 100%)";
                } else {
                    const depthGradient = 50 + grid[i][j];
                    context.fillStyle = "hsl(309, 100%, " + depthGradient + "%)";
                }
                context.fillRect(resolution * j, resolution * i, rectSize, rectSize);
            }
        }
    }
}

function nextIteration(grid, ignoreBoundary = true) {
    const nextGrid = createGrid(grid[0].length, grid.length);
    for (let i = 0 ; i < grid.length ; i++) {
        for (let j = 0 ; j < grid[i].length ; j++) {
            // Get live neighbor count
            const nCount = neighborCount(grid, i, j, ignoreBoundary);
            nextGrid[i][j] = grid[i][j];

            if (grid[i][j] < 0 && grid[i][j] > -50) {
                nextGrid[i][j] = grid[i][j] - 1;
            }

            if (grid[i][j] === 1) { // if cell is alive
                if (nCount < 2 || nCount > 3) {
                    nextGrid[i][j] = -1;
                }
            } else {    // if cell is dead
                if (nCount === 3) {
                    nextGrid[i][j] = 1;
                }
            }
        }
    }
    // console.table(nextGrid);
    return nextGrid;
}

function neighborCount(grid, top, left, ignoreBoundary = true) {
    let count = 0;
    const height = grid.length - 1;
    const width = grid[0].length - 1;
    // console.log(width, height);

    for (let r = -1 ; r <= 1 ; r++) {
        // let op = "";
        for (let c = -1 ; c <= 1 ; c++) {
            let x = (r + top);
            let y = (c + left);
            if (x < 0) {
                if (!ignoreBoundary) break;
                x = height;
            } 
            if (x > height) {
                if (!ignoreBoundary) break;
                x = 0;
            }
            if (y < 0) {
                if (!ignoreBoundary) break;
                y = width;
            }
            if (y > width) {
                if (!ignoreBoundary) break;
                y = 0;
            }
            // op += "[" + x + "," + y + "]" + grid[x][y] + "  ";
            if (grid[x][y] > 0) {
                if (!(r===0 && c===0)) {
                    count++;
                }
            }
        }
        // console.log(op);
    }
    // console.log("N Count", count);
    return count;
}