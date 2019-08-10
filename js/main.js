console.log("Welcome to the party!");

main();

function main() {
    const canvas = document.querySelector("#partyCanvas");
    const resolution = 10;
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
    
    let ant = {
        head: 'T', // Top, Right, Bottom, Left
        x: 50,
        y: 40
    }

    const gradient = new Gradient();
    gradient.addStop(new Color(250,78,213), 0);
    gradient.addStop(new Color(0,54,191), 25);
    gradient.addStop(new Color(46,217,176), 50);
    gradient.addStop(new Color(0,56,43), 90);
    gradient.addStop(new Color(0,0,0), 100);


    renderGrid(canvas, grid, resolution, gradient, false);

    const nextRender = function() {
        grid = nextIteration(grid);
        iterateAnt(ant, grid, true);
        renderGrid(canvas, grid, resolution, gradient, false);
    }

    const mInterval = setInterval(nextRender, 50);
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

function renderGrid(canvas, grid, resolution, gradient, showBorder = true) {
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
                    const depthGradient = -grid[i][j];
                    context.fillStyle = gradient.getColor(depthGradient).toRGB();
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

            if (grid[i][j] < 0 && grid[i][j] > -100) {
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

function moveAnt(ant, grid, ignoreBoundary = true) {
    const height = grid.length - 1;
    const width = grid[0].length - 1;
    
    const newAnt = {
        head: ant.head,
        x: ant.x,
        y: ant.y
    };

    switch (newAnt.head) {
        case 'T': {
            if (ant.y === 0) {
                newAnt.y = height;
            } else {
                newAnt.y--;
            }
            break;
        }
        case 'R': {
            if (ant.x === width) {
                newAnt.x = 0;
            } else {
                newAnt.x++;
            }
            break;
        }
        case 'B': {
            if (ant.y === height) {
                newAnt.y = 0;
            } else {
                newAnt.y++;
            }
            break;
        }
        case 'L': {
            if (ant.x === 0) {
                newAnt.x = width;
            } else {
                newAnt.x--;
            }
            break;
        }
    }

    return newAnt;
}

function iterateAnt(ant, grid, ignoreBoundary = true) {
    const isAlive = (grid[ant.y][ant.x] > 0);
    const nextDir = nextDirection(ant.head, isAlive);
    // Turn direction
    ant.head = nextDir;
    if (isAlive) {
        // Kill the ant
        grid[ant.y][ant.x] = -1;       
    } else {
        // Set it alive
        grid[ant.y][ant.x] = 1;
    }
    // Move Forward
    const nAnt = moveAnt(ant, grid, true);
    ant.x = nAnt.x;
    ant.y = nAnt.y;
}

function nextDirection(head, clockwise = true) {
    const dir = ['T', 'R', 'B', 'L'];
    const index = dir.indexOf(head.toUpperCase());
    if (index === -1) {
        return dir[0];
    }
    // console.log(clockwise, dir[index]);
    if (clockwise) {
        // console.log("Going clockwise");
        if (index === dir.length - 1) {
            return dir[0];
        } else {
            return dir[index + 1]
        }
    } else {
        // console.log("Going anti clockwise");
        if (index === 0) {
            return dir[dir.length - 1];
        } else {
            return dir[index - 1]
        }
    }
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

function testGradient(canvas) {
    const context = canvas.getContext("2d");
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    const arr = [];
    const gradientSize = 60;
    for (let i = 0 ; i < gradientSize ; i++) {
        arr.push(0);
    }
    const resolution = 10;
    const rectSize = resolution;
    context.fillStyle = "white";

    const gradient = new Gradient();
    
    gradient.addStop(new Color(255,0,0), 0);
    gradient.addStop(new Color(0,255,0), 50);
    gradient.addStop(new Color(0,0,255), 100);

    console.log(gradient.getColor(50).toRGB());

    for (let i = 0 ; i < arr.length ; i++) {
        const per = (i * 100) / arr.length;
        context.fillStyle = gradient.getColor(per).toRGB();
        context.fillRect(resolution * i, resolution * 0, rectSize, rectSize);
    }
}