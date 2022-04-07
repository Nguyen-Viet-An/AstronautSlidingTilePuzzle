
let source;

// Tiles 
let tiles = [];
let cols;
let rows;
let w, h;

// Order of tiles for game
let board = [];

// Loading the image
function preload() {
  source = loadImage("astronaut.jpg"); 
  // Image taken from: https://pngtree.com/freepng/hand-drawn-astronaut-character-design_4370225.html?share=3
}

function setup() {
  createCanvas(640, 640);

  //Create buttons + styling
  let myDiv = createDiv().addClass("buttons");
  let btn1 = createButton('Re-shuffle').parent(myDiv);
  let btn2 = createButton('3x3').parent(myDiv);
  let btn3 = createButton('5x5').parent(myDiv);
  btn1.style('font-size', '15px');
  btn1.style('background-color', '#4CAF50');
  btn1.style('padding: 15px 20px');
  btn1.style('margin-left: 60px');
  btn1.style('margin-right: 60px');

  btn2.style('font-size', '15px');
  btn2.style('background-color', '#4CAF50');
  btn2.style('padding: 15px 25px');
  btn2.style('margin-left: 60px');
  btn2.style('margin-right: 60px');

  btn3.style('font-size', '15px');
  btn3.style('background-color', '#4CAF50');
  btn3.style('padding: 15px 25px');
  btn3.style('margin-left: 60px');
  btn3.style('margin-right: 60px');
  
  
  
  
  // Chop up source image into tiles, default is 4x4
  
  boardChop(4, 4);

  // Shuffle the board
  slideShuffle(board);
  while (!isSolvable()) {
    slideShuffle(board);
  }
      


  
  // Reshuffle
  btn1.mousePressed(() => {
    slideShuffle(board);
    while (!isSolvable()) {
      slideShuffle(board);
  }
  });

  // Turn it into 8-slide puzzle
  btn2.mousePressed(() => {
    board.length = 0;
    tiles.length = 0;
    boardChop(3,3)
    slideShuffle(board);
    while (!isSolvable()) {
      slideShuffle(board);
    }

  });

  // Turn it into 24-slide puzzle
  btn3.mousePressed(() => {
    board.length = 0;
    tiles.length = 0;
    boardChop(5,5)
    slideShuffle(board);
    while (!isSolvable()) {
      slideShuffle(board);
    }

  });

}


// Chop up source image into tiles
function boardChop(x,y) {
  cols = x;
  rows = y;
  w = width / cols;
  h = height / rows;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * w;
      let y = j * h;
      let img = createImage(w, h);
      img.copy(source, x, y, w, h, 0, 0, w, h);
      let index = i + j * cols;
      board.push(index);
      let tile = new Tile(index, img);
      tiles.push(tile);
    }
  }
  
  // Remove the last tile
  tiles.pop();
  board.pop();
  // -1 means empty spot
  board.push(-1);
   
}


// Swap two elements of an array
function swap(i, j, arr) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

// Function to shuffle
function slideShuffle(arr) {
  
  for(let i = 0; i < 1000; i++) {
    let r1 = floor(random(cols));
    let r2 = floor(random(rows))
    move(r1, r2, arr);   

  } 
}


// Move based on click
function mousePressed() {
  let i = floor(mouseX / w);
  let j = floor(mouseY / h);
  move(i,j,board);
}



function draw() {
  background(0);

  // Draw the current board
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let index = i + j * cols;
      let x = i * w;
      let y = j * h;
      let tileIndex = board[index];
      if (tileIndex > -1) {
        let img = tiles[tileIndex].img;
        image(img, x, y, w, h);
      }
    }
  }
  
  // Show it as grid
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * w;
      let y = j * h;
      strokeWeight(3);
      noFill();
      rect(x, y, w, h);
    }
  }
  
  // If it is solved
  if (isSolved()) {
    console.log("SOLVED");
    alert("Solved! Cogratulations!")
    
  }
}

// Check if solved
function isSolved() {
  for (let i = 0; i < board.length-1; i++) {
    if (board[i] !== tiles[i].index) {
      return false;
    }
  }
  return true;
}

// Swap two pieces
function move(i, j, arr) {
  let blank = findBlank();
  let blankCol = blank % cols;
  let blankRow = floor(blank / rows);
  
  // Double check valid move
  if (isNeighbor(i, j, blankCol, blankRow)) {
    swap(blank, i + j * cols, arr);
  }
}

// Check if neighbor
function isNeighbor(i, j, x, y) {
  if (i !== x && j !== y) {
    return false;
  }

  if (abs(i - x) == 1 || abs(j - y) == 1) {
    return true;
  }
  return false;
}


// Get blank spot
function findBlank() {
  for (let i = 0; i < board.length; i++) {
    if (board[i] == -1) return i;
  }
}


// Ensure a solvable puzzle
function isSolvable() {
  var blankIndex = findBlank();
  var rowNumber =  cols - blankIndex/cols;
  let numberOfInversions = 0;
  
  // Count number of inversions
  for (let i = 0; i < (cols * rows - 1); i++) {
    for (let j = i + 1; j <= (cols * rows - 1); j++) {
        if (board[i] && board[j] && board[i] > board[j]) {
          numberOfInversions++;
        }
    }
  }

  if (cols % 2 != 0) {
      return (numberOfInversions % 2 == 0);
  }
  else {
    if (rowNumber % 2 != 0) {
        return (numberOfInversions % 2 == 0);
    }
    else {
        return (numberOfInversions % 2 != 0);
    }
  }
}
