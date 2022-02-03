const canvas = document.querySelector("#myCanvas");
const ctx = canvas.getContext("2d");
const pointCounter = document.querySelector("#pointCounter");
const nextShapeCanvas = document.querySelector("#nextShapeCanvas")
const nextShapeCanvasctx = nextShapeCanvas.getContext("2d");
const pointSpan = document.querySelector("#score");

let centerPage = window.innerWidth/2;
let cellSize = 25;
let width = 450;
let height = 600;
let fps = 60;
let ups = 60;
let xArray = [];
let shapes = ["square", "lblock", "mirroredlblock", "tblock", "sblock", "mirroredsblock", "straightblock"]
let currentShape = "";
let shapeHasLanded = true;
let shapeCoords = [0,0];
let previewShapeChords = [0,0];
let LEFT,RIGHT,DOWN,SPACE;
LEFT=RIGHT=DOWN=SPACE=false;
let pressedKey = [LEFT,RIGHT,DOWN,SPACE];
let downCounter = 0;
let finalTurnCounter = 0;
let allowMovement = true;
let movingDown = true;
let fastFall = false;
let fastMoveCounterLeft = 0;
let fastMoveCounterRight = 0;
let allowFastFall = true;
let insuranceCounter = 0;
let allowLeft = true;
let allowRight = true;
let connectedBlocks = 0;
let score = 0;
let next100Shapes = [];
let currentShapeNumber = 0;
let previewArray = [];

for (let i = 0; i < 100; i++) {
    next100Shapes[i] = randomShape();
}

for (let i = 0; i < width/cellSize; i++) {
    xArray[i] = [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0];
}

for (let i = 0; i < nextShapeCanvas.width/cellSize; i++) {
    previewArray[i] = [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0];
}

myCanvas.style.left = centerPage - 225 + "px";
myCanvas.style.top = 100 + "px";

pointCounter.style.top = myCanvas.style.top;
pointCounter.style.left = parseInt(myCanvas.style.left) - 104 + "px";

nextShapeCanvas.style.top = myCanvas.style.top;
nextShapeCanvas.style.left = parseInt(myCanvas.style.left) + 454 + "px";

nextShape();
createShape("square",8,0);
shapeHasLanded = false;

let renderLoop = setInterval(() => {
    //Clear board
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //Paint Squares main board
    paintSquares();

    //Clear next square box
    nextShapeCanvasctx.clearRect(0, 0, nextShapeCanvas.width, nextShapeCanvas.height);
    //Paint next square box
    paintNextSquareBox();
}, 1000/fps);

let updateLoop = setInterval(() => {
    if (!shapeHasLanded) {
        //Next Shape
        if (!movingDown) {
            finalTurnCounter++;
            if (finalTurnCounter > ups || fastFall) {
                if (!checkBelowSquare()) {
                    shapeHasLanded = true;
                    fastFall = false;
                    finalTurnCounter = 0;
                }
            }
        }

        //Move down every second
        if (downCounter > ups) {
            downCounter = 0;
            if (currentShape == "square") {
                if (checkBelowSquare()) {
                    //Move down
                    movingDown = true;
                    finalTurnCounter = 0;
                    shapeCoords[1] += 1;
                    //Fill new coords
                    xArray[shapeCoords[0]][shapeCoords[1]] = 2;
                    xArray[shapeCoords[0]+1][shapeCoords[1]] = 2;
                    xArray[shapeCoords[0]][shapeCoords[1]+1] = 2;
                    xArray[shapeCoords[0]+1][shapeCoords[1]+1] = 2;
                    //Remove previous coords to Upwardleft
                    if (xArray[shapeCoords[0]][shapeCoords[1]-1] == 2) {
                        xArray[shapeCoords[0]][shapeCoords[1]-1] = 0;
                    }
                    //Remove previous coords to Upwardright
                    if (xArray[shapeCoords[0]+1][shapeCoords[1]-1] == 2) {
                        xArray[shapeCoords[0]+1][shapeCoords[1]-1] = 0;
                    }
                }
                else {
                    movingDown = false;
                    console.log("No movement detected in for square");
                }
            }
        }
        downCounter++;
        if (allowMovement) {      
                    //console.log("Fastmovecounterleft = " + fastMoveCounterLeft)
                    //If pressing left
                    if (pressedKey[0] && shapeCoords[0] > 0 && (allowLeft || fastMoveCounterLeft > 0)) {
                        pressedKey[0] = false;
                        allowLeft = false;
                        //If empty space
                        if (xArray[shapeCoords[0]-1][shapeCoords[1]] == 0 && xArray[shapeCoords[0]-1][shapeCoords[1]+1] == 0) {
                            //Move left
                            shapeCoords[0] -= 1;
                            //Fill left coords
                            xArray[shapeCoords[0]][shapeCoords[1]] = 2;
                            xArray[shapeCoords[0]][shapeCoords[1]+1] = 2;
                            //Remove previous coords
                            if (xArray[shapeCoords[0]+2][shapeCoords[1]] == 2) {
                                xArray[shapeCoords[0]+2][shapeCoords[1]] = 0;
                            }
                            if (xArray[shapeCoords[0]+2][shapeCoords[1]+1] == 2) {
                                xArray[shapeCoords[0]+2][shapeCoords[1]+1] = 0;
                            }
                        }
                    }
                    //If pressing right
                    if (pressedKey[1] && shapeCoords[0] < 16 && (allowRight || fastMoveCounterRight > 0)) {
                        pressedKey[1] = false;
                        allowRight = false;
                        //If empty space
                        if (xArray[shapeCoords[0]+2][shapeCoords[1]] == 0 && xArray[shapeCoords[0]+2][shapeCoords[1]+1] == 0) {
                            //Move right
                            shapeCoords[0] += 1;
                            //Fill right coords
                            xArray[shapeCoords[0]+1][shapeCoords[1]] = 2;
                            xArray[shapeCoords[0]+1][shapeCoords[1]+1] = 2;
                            //Remove previous coords
                            if (xArray[shapeCoords[0]-1][shapeCoords[1]] == 2) {
                                xArray[shapeCoords[0]-1][shapeCoords[1]] = 0;
                            }
                            if (xArray[shapeCoords[0]-1][shapeCoords[1]+1] == 2) {
                                xArray[shapeCoords[0]-1][shapeCoords[1]+1] = 0;
                            }
                        }
                    }
                    //If pressing down
                    if (pressedKey[2]) {
                        downCounter = ups+1;
                    }
                    //If pressing space
                    if (pressedKey[3] && allowFastFall) {
                        fastFall = true;
                        allowFastFall = false;
                        console.log("Engaging fastfall");
                    }
                    
                }
    }

    else {
        //Check for complete line & go down
        for (let y = 0; y < height/cellSize; y++) {
            for (let x = 0; x < width/cellSize; x++) {
                if (xArray[x][y] > 1) {
                    connectedBlocks++;
                }
            }
            
            if (connectedBlocks > width/cellSize-1) {
                clearRow(y);
            }
            connectedBlocks = 0;
        }
        //New shape
        nextShape();
        createShape(currentShape,8,0)
        shapeHasLanded = false;
        
    }
    while (fastFall) {
        console.log("Fastfalling");
        //Move down instantly
        if (currentShape == "square") {
            if (shapeCoords[1] < 22 && xArray[shapeCoords[0]][shapeCoords[1]+2] == 0 && xArray[shapeCoords[0]+1][shapeCoords[1]+2] == 0) {
                //Move down
                movingDown = true;
                shapeCoords[1] += 1;
            
                //Fill new coords
                xArray[shapeCoords[0]][shapeCoords[1]] = 2;
                xArray[shapeCoords[0]+1][shapeCoords[1]] = 2;
                xArray[shapeCoords[0]][shapeCoords[1]+1] = 2;
                xArray[shapeCoords[0]+1][shapeCoords[1]+1] = 2;
                //Remove previous coords
                if (xArray[shapeCoords[0]][shapeCoords[1]-1] == 2) {
                    xArray[shapeCoords[0]][shapeCoords[1]-1] = 0;
                }
                if (xArray[shapeCoords[0]+1][shapeCoords[1]-1] == 2) {
                    xArray[shapeCoords[0]+1][shapeCoords[1]-1] = 0;
                }
            }
            else {
                movingDown = false;
                console.log("Not moving down in fastfall");
            }
        }
        insuranceCounter++;
        if (insuranceCounter > 1000) {
            fastFall = false;
            console.log("Timed out");
        }
        if (fastFall && !movingDown) {
            shapeHasLanded = true;
            fastFall = false;
            finalTurnCounter = 0;
        }
    }
    
    
    
}, 1000/ups);


function paintNextSquareBox() {
    for (let x = 0; x < nextShapeCanvas.width / cellSize; x++) {
        for (let y = 0; y < nextShapeCanvas.height / cellSize; y++) {
            nextShapeCanvasctx.globalAlpha = 0.1;
            nextShapeCanvasctx.strokeStyle = "black";
            nextShapeCanvasctx.lineWidth = 1;
            nextShapeCanvasctx.fillStyle = "rgb(20, 20, 20)";
            nextShapeCanvasctx.fillRect(cellSize * x, cellSize * y, cellSize, cellSize);
            nextShapeCanvasctx.strokeRect(cellSize * x, cellSize * y, cellSize, cellSize);
            
        }
    }
    createShape(next100Shapes[currentShapeNumber+1],1,1)


    nextShapeCanvasctx.globalAlpha = 1;
    nextShapeCanvasctx.lineWidth = 2;
    nextShapeCanvasctx.strokeRect(0, nextShapeCanvas.height/2,nextShapeCanvas.width,2)
}

function paintSquares() {
    for (let x = 0; x < width / cellSize; x++) {
        for (let y = 0; y < height / cellSize; y++) {
            if (xArray[x][y] == 0) {
                ctx.globalAlpha = 0.1;
                ctx.strokeStyle = "black";
                ctx.lineWidth = 1;
                ctx.fillStyle = "rgb(20, 20, 20)";
                ctx.fillRect(cellSize * x, cellSize * y, cellSize, cellSize);
                ctx.strokeRect(cellSize * x, cellSize * y, cellSize, cellSize);
            }

            if (xArray[x][y] > 1) {
                ctx.globalAlpha = 1;
                ctx.fillStyle = "rgb(255, 64, 0)";
                ctx.strokeStyle = "black";
                ctx.lineWidth = 1;
                ctx.fillRect(cellSize * x, cellSize * y, cellSize, cellSize);
                ctx.strokeRect(cellSize * x, cellSize * y, cellSize, cellSize);
            }
        }
    }
}

function clearRow(y) {
    for (let x = 0; x < width/cellSize; x++) {
        xArray[x][y] = 0;
    }
    score += width/cellSize;
    pointSpan.innerHTML = score;
}

function checkBelowSquare() {
    return shapeCoords[1] < 22 && xArray[shapeCoords[0]][shapeCoords[1] + 2] == 0 && xArray[shapeCoords[0] + 1][shapeCoords[1] + 2] == 0;
}

function keyDown(event) {
    if (event.keyCode == 37) {
        pressedKey[0] = true;
        fastMoveCounterLeft++;
    }
    if (event.keyCode == 39) {
        pressedKey[1] = true;
        fastMoveCounterRight++;
    }
    if (event.keyCode == 40) {
        pressedKey[2] = true;
    }
    if (event.keyCode == 32) {
        pressedKey[3] = true;
    }
    if (event.keyCode == 80) {
        console.log("piss");
        for (let y = height/cellSize-2; y < height/cellSize; y++) {
            for (let x = 0; x < width/cellSize-2; x++) {
                xArray[x][y] = 2;
            }
        }
    }
}

function keyUp(event) {
    if (event.keyCode == 37) {
        pressedKey[0] = false;
        allowLeft = true;
        fastMoveCounterLeft = 0;
    }
    if (event.keyCode == 39) {
        pressedKey[1] = false;
        allowRight = true;
        fastMoveCounterRight = 0;
    }
    if (event.keyCode == 40) {
        pressedKey[2] = false;
    }
    if (event.keyCode == 32) {
        pressedKey[3] = false;
        allowFastFall = true;
    }
}

function randomShape() {
    let max = 1;
    let randomShape;
    let randomNumber = Math.floor(Math.random() * max);
    if (randomNumber == 0) {randomShape = "square"}
    if (randomNumber == 1) {randomShape = "line"}
    return randomShape;
}

function nextShape() {
    currentShapeNumber++;
    currentShape = next100Shapes[currentShapeNumber];
    console.log("nextshape currentshape = " + currentShape);
}

function createShape(shape, xcoords, ycoords) {
    console.log("Creating new shape = " + shape);
    shapeCoords[0] = xcoords;
    shapeCoords[1] = ycoords;
    movingDown = true;
    
    if (shape == "square") {
        xArray[shapeCoords[0]][shapeCoords[1]] = 2;
        xArray[shapeCoords[0]+1][shapeCoords[1]] = 2;
        xArray[shapeCoords[0]][shapeCoords[1]+1] = 2;
        xArray[shapeCoords[0]+1][shapeCoords[1]+1] = 2;
    }
}

function createPreviewShape(shape, xcoords, ycoords) {
    console.log("Creating new previewShape = " + shape);
    previewShapeCoords[0] = xcoords;
    previewShapeCoords[1] = ycoords;
    
    if (shape == "square") {
    
        xArray[shapeCoords[0]][shapeCoords[1]] = 2;
        xArray[shapeCoords[0]+1][shapeCoords[1]] = 2;
        xArray[shapeCoords[0]][shapeCoords[1]+1] = 2;
        xArray[shapeCoords[0]+1][shapeCoords[1]+1] = 2;
    }
}

function zimoredem() {
    let gås = "ost"
    return gås
}