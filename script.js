var canvas = document.getElementById("matrix");
var ctx = canvas.getContext("2d");

let size = canvas.height-20

let color = {
    false: "#FFFFFF",
    true: "#000000",
    visited: "#AF3BD4",
    current: "#00CC00",
    wall: "#000000",
    cell: "#FFFFFF",
    final: 'yellow',
    wrong: "red",
    visitedSolve: 'blue'
}
let cells = []
let walls = []
let visited = []
let stack = []
let currentCell = { x: 10, y: 10 }
let finalCell = { x: size-10, y: size-10 };
for (let x = 0; x <= size; x += 10) {
    for (let y = 0; y <= size; y += 10) {
        let whichC = ((y / 10) % 2 == 0) || ((x / 10) % 2 == 0) || x == 600 || y == 600
        ctx.fillStyle = color[whichC];
        ctx.fillRect(x, y, 10, 10);
        if (whichC) walls.push({ x, y })
        else cells.push({ x, y })
    }
}
function getRandInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}
function updateMap() {
    for (let x = 10; x < size; x += 10) {
        for (let y = 10; y < size; y += 10) {
            let wcolor = 'cell'

            if (walls.some(w => w.x == x && w.y == y)) wcolor = 'wall'
            if (visited.some(v => v.x == x && v.y == y)) wcolor = 'visited'
            if (visitedSolve.some(v => v.x == x && v.y == y)) wcolor = 'visitedSolve'
            if (wrongWay.some(v => v.x == x && v.y == y)) wcolor = 'wrong'
            if (finalCell.x == x && finalCell.y == y) wcolor = 'final'
            if (currentCell.x == x && currentCell.y == y) wcolor = 'current'

            ctx.fillStyle = color[wcolor];
            ctx.fillRect(x, y, 10, 10);
        }
    }
}
function getCellWall(cell) {
    let diff = { x: currentCell.x - cell.x, y: currentCell.y - cell.y }
    let xDiff = cell.x - currentCell.x
    let yDiff = cell.y - currentCell.y
    let wallX = (xDiff != 0) ? (xDiff / Math.abs(xDiff)) : 0
    let wallY = (yDiff != 0) ? (yDiff / Math.abs(yDiff)) : 0
    return { x: currentCell.x + (wallX * 10), y: currentCell.y + (wallY * 10) }
}
async function genLbrnt() {
    visited.push({ x: currentCell.x, y: currentCell.y })
    let variants = []
    let l = { x: currentCell.x - 20, y: currentCell.y }
    let r = { x: currentCell.x + 20, y: currentCell.y }
    let u = { x: currentCell.x, y: currentCell.y + 20 }
    let d = { x: currentCell.x, y: currentCell.y - 20 }
    if (l.x > 0 && l.y > 0 && l.x < size && l.y < size && !visited.some(v => v.x == l.x && v.y == l.y) && !visited.some(v => v.x == getCellWall(l).x && v.y == getCellWall(l).y) && !walls.some(v => v.x == l.x && v.y == l.y)) variants.push(l);
    if (r.x > 0 && r.y > 0 && r.x < size && r.y < size && !visited.some(v => v.x == r.x && v.y == r.y) && !visited.some(v => v.x == getCellWall(r).x && v.y == getCellWall(r).y) && !walls.some(v => v.x == r.x && v.y == r.y)) variants.push(r);
    if (u.x > 0 && u.y > 0 && u.x < size && u.y < size && !visited.some(v => v.x == u.x && v.y == u.y) && !visited.some(v => v.x == getCellWall(u).x && v.y == getCellWall(u).y) && !walls.some(v => v.x == u.x && v.y == u.y)) variants.push(u);
    if (d.x > 0 && d.y > 0 && d.x < size && d.y < size && !visited.some(v => v.x == d.x && v.y == d.y) && !visited.some(v => v.x == getCellWall(d).x && v.y == getCellWall(d).y) && !walls.some(v => v.x == d.x && v.y == d.y)) variants.push(d);
    let newCur
    let index = getRandInt(0, variants.length - 1)

    if (variants.length != 0) {
        newCur = variants[index];
        stack.push(currentCell);
        let diff = { x: currentCell.x - newCur.x, y: currentCell.y - newCur.y }
        visited.push({ x: newCur.x, y: newCur.y })
        let xDiff = newCur.x - currentCell.x
        let yDiff = newCur.y - currentCell.y
        let wallX = (xDiff != 0) ? (xDiff / Math.abs(xDiff)) : 0
        let wallY = (yDiff != 0) ? (yDiff / Math.abs(yDiff)) : 0
        visited.push({ x: currentCell.x + (wallX * 10), y: currentCell.y + (wallY * 10) })
        currentCell = newCur;
    }
    else if (stack.length > 0) {
        currentCell = stack.pop();
    }
    else {
        let unvisited = getUnvisited()
        let index = getRandInt(0, unvisited.length - 1)
        currentCell = unvisited[index]
    }

    updateMap()
    if (getUnvisited().length == 0) {
        currentCell = { x: 10, y: 10 }
        solveLbrnt();
        return
    }
    await new Promise(resolve => setTimeout(resolve, 1));
    genLbrnt()

}
let visitedSolve = []
let solveStack = []
let wrongWay = []
let wrongStack = []
let isChecking = false;
async function solveLbrnt() {
    console.log(currentCell)

    while (currentCell.x != finalCell.x || currentCell.y != finalCell.y) {

        let variants = []
        let l = { x: currentCell.x - 10, y: currentCell.y }
        let r = { x: currentCell.x + 10, y: currentCell.y }
        let u = { x: currentCell.x, y: currentCell.y + 10 }
        let d = { x: currentCell.x, y: currentCell.y - 10 }
        if (l.x > 0 && l.y > 0 && l.x < size && l.y < size && !visitedSolve.some(v => v.x == l.x && v.y == l.y) && visited.some(v => v.x == l.x && v.y == l.y)) variants.push(l);
        if (r.x > 0 && r.y > 0 && r.x < size && r.y < size && !visitedSolve.some(v => v.x == r.x && v.y == r.y) && visited.some(v => v.x == r.x && v.y == r.y)) variants.push(r);
        if (u.x > 0 && u.y > 0 && u.x < size && u.y < size && !visitedSolve.some(v => v.x == u.x && v.y == u.y) && visited.some(v => v.x == u.x && v.y == u.y)) variants.push(u);
        if (d.x > 0 && d.y > 0 && d.x < size && d.y < size && !visitedSolve.some(v => v.x == d.x && v.y == d.y) && visited.some(v => v.x == d.x && v.y == d.y)) variants.push(d);
        console.log('Variants', variants.length);
        console.log('Stack', solveStack.length);
        if (variants.length > 0) {
           
            
            let index = getRandInt(0, variants.length - 1);
            let newCur = variants[index];
            if(variants.length>1){
                solveStack.push(currentCell)
                
                wrongStack = []
            };
            visitedSolve.push(newCur)
            
            currentCell = newCur;
        }
        else if (solveStack.length != 0) {
          
            let newCur = solveStack.pop();
            wrongWay.splice(wrongWay.findIndex(ww=>ww.x==newCur.x&&ww.y==newCur.y))
            currentCell = newCur
        }
        else {
            console.log("No vars and no stack")
            break;
        }
        if (currentCell.x == finalCell.x && currentCell.y == finalCell.y){
            console.log("Find")
            break;
        } 
        wrongWay.push(currentCell)
        
        updateMap()
        await new Promise(resolve => setTimeout(resolve, 1));
    }
    console.log("Find")
}
function getUnvisited() {
    return cells.filter(c => !visited.some(v => v.x == c.x && v.y == c.y))
}

updateMap();

genLbrnt()
