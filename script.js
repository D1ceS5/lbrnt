var canvas = document.getElementById("matrix");
var ctx = canvas.getContext("2d");

let fieldSize = canvas.height - 20
let cellSize = 10
let color = {

    visited: "#1924B1",
    current: "#00CC00",
    wall: "#000000",
    cell: "#FFFFFF",
    final: '#7109AA',
    path: "#FF0000",
}



class Cell {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
    }
}

let currentCell = new Cell(cellSize, cellSize, 'current')
let finalCell = new Cell(-1, -1, 'none')
let matrix = initMatrix();
let stack = [];
let path = []
console.log(matrix);
drawMatrix()
//generateLabyrinth()


async function generateLabyrinth() {
    matrix[currentCell.y / cellSize][currentCell.x / cellSize].type = 'visited'
    let neighbours = getNeighbours(currentCell.y / cellSize, currentCell.x / cellSize)
    let unvisited = getUnvisited()
    if (unvisited.length == 0) {
        refreshLabyrinth()
        labyrinthSolve()
        return
    }
    if (neighbours.length != 0) {
        let randIndex = getRandInt(0, neighbours.length - 1);
        let selected = neighbours[randIndex][0];
        let selectedWall = neighbours[randIndex][1];
        if (neighbours.length > 1) stack.push(currentCell);
        matrix[selected.y / cellSize][selected.x / cellSize].type = 'current';
        matrix[selectedWall.y / cellSize][selectedWall.x / cellSize].type = 'visited';
        currentCell = selected
    }
    else if (stack.length != 0) {
        currentCell = stack.pop()
    }
    else {
        let randIndex = getRandInt(0, unvisited.length - 1)
        currentCell = unvisited[randIndex]
    }
    drawMatrix()
    await new Promise(resolve => setTimeout(resolve, 10));
    generateLabyrinth();

}
function refreshLabyrinth() {

    matrix[1][1].type = 'current'
    currentCell = matrix[1][1]
    matrix[matrix.length - 2][matrix.length - 2].type = 'final'
    finalCell = matrix[matrix.length - 2][matrix.length - 2]
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix.length; x++) {

            if (matrix[y][x].type == 'visited') matrix[y][x].type = 'cell'
            let element = matrix[y][x]

            ctx.fillStyle = color[matrix[y][x].type];
            ctx.fillRect(element.x, element.y, cellSize, cellSize);
        }
    }
}
async function labyrinthSolve() {
    let neighbours = getNeighboursNoWall(currentCell.y / cellSize, currentCell.x / cellSize)
    let pathRemoved = false
    let oldCurrent = currentCell

    oldCurrent.type = 'path'
    ctx.fillStyle = color[oldCurrent.type];
    ctx.fillRect(oldCurrent.x, oldCurrent.y, cellSize, cellSize);
    path.push(oldCurrent)
    path.push(currentCell);

    if (neighbours.length != 0) {
        let randIndex = getRandInt(0, neighbours.length - 1);
        let selected = neighbours[randIndex];
        if (neighbours.length > 1) {
            stack.push(currentCell)
            wrongStack = []
        }
       

        currentCell = selected
        ctx.fillStyle = color[currentCell.type];
        ctx.fillRect(currentCell.x, currentCell.y, cellSize, cellSize);
    }
    else if (stack.length != 0) {
        //pathRemoved = true;
        currentCell.type = 'visited'
        ctx.fillStyle = color[currentCell.type];
        ctx.fillRect(currentCell.x, currentCell.y, cellSize, cellSize);
        currentCell = stack.pop()
        let removed = path.splice(path.findIndex(p => p.x == currentCell.x && p.y == currentCell.y))
        removed.push(oldCurrent)
        removePath(removed)
    }
    else {
        console.log("No vars and no stack")
        return
    }
    
    

    if (currentCell.x == finalCell.x && currentCell.y == finalCell.y) {
        console.log("Finded")
        return
    }
    //drawMatrix()
    await new Promise(resolve => setTimeout(resolve, 10));
    labyrinthSolve();
}
async function removePath(cells) {

    for (let cell of cells) {
        cell.type = 'visited'
        ctx.fillStyle = color[cell.type];
        ctx.fillRect(cell.x, cell.y, cellSize, cellSize);
    }
}
function getUnvisited() {
    return matrix.flat(2).filter(c => c.type != 'visited' && c.type != 'wall')
}
function getNeighbours(y, x) {
    let ng = []
    if (x - 2 > 0 && x - 2 < matrix.length - 1 && matrix[y][x - 2].type != 'visited') ng.push([matrix[y][x - 2], matrix[y][x - 1]]);
    if (x + 2 > 0 && x + 2 < matrix.length - 1 && matrix[y][x + 2].type != 'visited') ng.push([matrix[y][x + 2], matrix[y][x + 1]]);
    if (y + 2 > 0 && y + 2 < matrix.length - 1 && matrix[y + 2][x].type != 'visited') ng.push([matrix[y + 2][x], matrix[y + 1][x]]);
    if (y - 2 > 0 && y - 2 < matrix.length - 1 && matrix[y - 2][x].type != 'visited') ng.push([matrix[y - 2][x], matrix[y - 1][x]]);
    return ng
}
function getNeighboursNoWall(y, x) {
    let ng = []
    if (x - 1 > 0 && x - 1 < matrix.length - 1 && matrix[y][x - 1].type != 'visited' && matrix[y][x - 1].type != 'path' && matrix[y][x - 1].type != 'wall') ng.push(matrix[y][x - 1]);
    if (x + 1 > 0 && x + 1 < matrix.length - 1 && matrix[y][x + 1].type != 'visited' && matrix[y][x + 1].type != 'path' && matrix[y][x + 1].type != 'wall') ng.push(matrix[y][x + 1]);
    if (y + 1 > 0 && y + 1 < matrix.length - 1 && matrix[y + 1][x].type != 'visited' && matrix[y + 1][x].type != 'path' && matrix[y + 1][x].type != 'wall') ng.push(matrix[y + 1][x]);
    if (y - 1 > 0 && y - 1 < matrix.length - 1 && matrix[y - 1][x].type != 'visited' && matrix[y - 1][x].type != 'path' && matrix[y - 1][x].type != 'wall') ng.push(matrix[y - 1][x]);
    return ng
}

function drawMatrix() {
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix.length; x++) {

            let element = matrix[y][x];

            if (element.x == currentCell.x && element.y == currentCell.y) {
                matrix[y][x] = currentCell
                element = currentCell
            }
            if (path.some(p => p.x == element.x && p.y == element.y)) {
                element.type = 'path'
            }
            ctx.fillStyle = color[element.type];
            ctx.fillRect(element.x, element.y, cellSize, cellSize);
        }
    }
}

function initMatrix() {
    let result = []
    for (let y = 0; y <= fieldSize; y += cellSize) {
        let row = []
        for (let x = 0; x <= fieldSize; x += cellSize) {
            let cellType = ((y / cellSize) % 2 == 0) || ((x / cellSize) % 2 == 0) || x == 600 || y == 600
            row.push(new Cell(x, y, cellType ? 'wall' : 'cell'))
        }
        result.push(row)
    }
    return result
}

function getRandInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

