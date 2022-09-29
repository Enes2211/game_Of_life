var matrix = [];

function setup() {
  createCanvas(800, 800);

  for (var i = 0; i < 80; i++) {
    var arr = [];
    for (var j = 0; j < 80; j++) {
      var entity = Math.random();
      if (entity > 0.4) {
        arr.push(new Empty(j, i));
      }

      if (entity < 0.4 && entity > 0.1) {
        arr.push(new Grass(j, i));
      }

      if (entity < 0.1) {
        arr.push(new GrassEater(j, i, 15));
      }
      if (entity < 0.3 && entity > 0.1) {
        arr.push(new Predator(j, i, 15));
      }
    }
    matrix.push(arr);
  }
}

timer = 0;
timerG = 0;
timerPredator = 0;

function draw() {
  frameRate(30);
  var side = 10;
  emptyCells = [];
  grassCells = [];
  grass_eaterCells = [];
  timerG++;
  timer++;
  timerPredator++;
  for (var i = 0; i < 80; i++) {
    for (var j = 0; j < 80; j++) {
      if (matrix[j][i] instanceof Grass) {
        fill("green");
        emptyCells.push(matrix[j][i].chooseCells());
        emptyCells = emptyCells.filter((e) => e != null);
      } else if (matrix[j][i] instanceof Predator) {
        fill("red");
        grass_eaterCells.push(matrix[j][i].chooseCellsP());
        grass_eaterCells = grass_eaterCells.filter((e) => e != null);
      } else if (matrix[j][i] instanceof GrassEater) {
        fill("yellow");
        grassCells.push(matrix[j][i].chooseCellsE());
        grassCells = grassCells.filter((e) => e != null);
      } else if (matrix[j][i] instanceof Winter) {
        fill("white");
      } else if (matrix[j][i] instanceof Fall) {
        fill("orange");
      } else if (matrix[j][i] instanceof Empty) {
        fill("grey");
      }
      rect(j * side, i * side, side, side);
    }
  }
  if (timerPredator == 5) {
    for (var b in grass_eaterCells) {
      var x = grass_eaterCells[b][0];
      var y = grass_eaterCells[b][1];
      matrix[y][x] = new Predator(x, y);
      // console.log('creating object ',matrix[y][x])
    }
    timerPredator = 0;
  }

  if (timerG == 7) {
    for (var a in grassCells) {
      var x = grassCells[a][0];
      var y = grassCells[a][1];
      matrix[y][x] = new GrassEater(x, y);
    }
    timerG = 0;
  }

  if (timer == 3) {
    //create new grass
    for (var i in emptyCells) {
      var x = emptyCells[i][0];
      var y = emptyCells[i][1];
      matrix[y][x] = new Grass(x, y);
    }
    timer = 0;
  }
}

function randomNumber(max) {
  return Math.floor(Math.random() * max);
}

class BaseClass {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.directions = [
      [this.x - 1, this.y - 1],
      [this.x, this.y - 1],
      [this.x + 1, this.y - 1],
      [this.x - 1, this.y],
      [this.x + 1, this.y],
      [this.x - 1, this.y + 1],
      [this.x, this.y + 1],
      [this.x + 1, this.y + 1],
    ];
  }
}

class Grass extends BaseClass {
  chooseCells() {
    var found = [];
    for (var i in this.directions) {
      var x = this.directions[i][0];
      var y = this.directions[i][1];
      if (x >= 0 && x < matrix[0].length && y >= 0 && y < matrix.length) {
        if (matrix[y][x] instanceof Empty) {
          found.push(this.directions[i]);
        }
      }
    }
    var target = random(found);
    return target;
  }
}

class GrassEater extends BaseClass {
  constructor(x, y, energy) {
    super(x, y);
    this.energy = energy;
  }

  chooseCellsE() {
    var foundGrassEater = [];
    for (var j in this.directions) {
      var x = this.directions[j][0];
      var y = this.directions[j][1];
      if (x >= 0 && x < matrix[0].length && y >= 0 && y < matrix.length) {
        if (matrix[y][x] instanceof Grass) {
          foundGrassEater.push(this.directions[j]);
          this.energy = 10;
        }
      }
    }
    if (foundGrassEater.length == 0) {
      for (var i in this.directions) {
        var x = this.directions[i][0];
        var y = this.directions[i][1];
        if (x >= 0 && x < matrix[0].length && y >= 0 && y < matrix.length) {
          if (matrix[y][x] instanceof Empty) {
            foundGrassEater.push(this.directions[i]);
          }
        }
      }
      this.energy--;
    }

    if (foundGrassEater.length == 0) {
      for (var i in this.directions) {
        var x = this.directions[i][0];
        var y = this.directions[i][1];
        if (x >= 0 && x < matrix[0].length && y >= 0 && y < matrix.length) {
          if (matrix[y][x] instanceof GrassEater) {
            foundGrassEater.push(this.directions[i]);
          }
        }
      }
      this.energy--;
    }
    return random(foundGrassEater);
  }

  move() {
    var targetCell = this.chooseCellsE();
    var x = targetCell[0];
    var y = targetCell[1];
    var targetCellClone = this.chooseCellsE();
    var xClone = targetCellClone[0];
    var yClone = targetCellClone[1];
    matrix[this.y][this.x] = new Empty(this.x, this.y);
    if (this.energy > 0) {
      matrix[y][x] = new GrassEater(x, y, this.energy);
    }
  }
}

class Predator extends GrassEater {
  chooseCellsP() {
    var foundPredator = [];
    for (var j in this.directions) {
      var x = this.directions[j][0];
      var y = this.directions[j][1];
      if (x >= 0 && x < matrix[0].length && y >= 0 && y < matrix.length) {
        if (matrix[y][x] instanceof Grass) {
          foundPredator.push(this.directions[j]);
          this.energy = 5;
        }
      }
    }
    if (foundPredator.length == 0) {
      for (var i in this.directions) {
        var x = this.directions[i][0];
        var y = this.directions[i][1];
        if (x >= 0 && x < matrix[0].length && y >= 0 && y < matrix.length) {
          if (matrix[y][x] instanceof Empty) {
            foundPredator.push(this.directions[i]);
          }
        }
      }
      this.energy--;
    }
    if (foundPredator.length == 0) {
      for (var i in this.directions) {
        var x = this.directions[i][0];
        var y = this.directions[i][1];
        if (x >= 0 && x < matrix[0].length && y >= 0 && y < matrix.length) {
          if (matrix[y][x] instanceof GrassEater) {
            foundPredator.push(this.directions[i]);
          }
        }
      }
      this.energy = 10;
    }
    return random(foundPredator);
  }
  move2() {
    var targetCell = this.chooseCellsP();
    var x = targetCell[0];
    var y = targetCell[1];
    matrix[this.y][this.x] = new Empty(this.x, this.y);
    if (this.energy > 0) {
      matrix[y][x] = new GrassEater(this.x, this.y, this.energy);
    }
  }
}

function handleFall() {
  alert("It's Fall!!!");
  console.log(matrix);
  for (var i = 0; i < 80; i++) {
    for (var j = 0; j < 80; j++) {
      if (matrix[j][i] instanceof Grass) {
        console.log("creating new Fall");
        matrix[j][i] = new Fall(j, i);
      }
      if (matrix[j][i] instanceof Winter) {
        console.log("creating new Fall");
        matrix[j][i] = new Fall(j, i);
      }
    }
  }
}

function handleWinter() {
  alert("It's Winter!!!");
  console.log(matrix);
  for (var i = 0; i < 80; i++) {
    for (var j = 0; j < 80; j++) {
      if (matrix[j][i] instanceof Grass) {
        console.log("creating new Winter");
        matrix[j][i] = new Winter(j, i);
      }
      if (matrix[j][i] instanceof Fall) {
        console.log("creating new Winter");
        matrix[j][i] = new Winter(j, i);
      }
    }
  }
}
class Empty {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Winter extends BaseClass {}
class Fall extends BaseClass {}

// function fillArray() {
//   var arr = [];
//   arr.push(new Grass(0, 0));
//   arr.push(new GrassEater(1, 1));
//   arr.push(new emptyCells(2, 2));
// }
// console.log(fillArray);
for (var i in messages) {
  io.sockets.emit("send message", messages[i]);
}

// function main() {
//   var socket = io();
//   var chatDiv = document.getElementById("Chat");
//   var input = document.getElementById("Nachricht");
//   var button = document.getElementById("Senden");

//   function handleSubmit(evt) {
//     var val = input.value;
//     if (val != "") {
//       socket.emit("send message", val);
//     }
//   }
//   button.onclick = handleSubmit;

//   function handleMessage(msg) {
//     var p = document.createElement("p");
//     p.innerText = msg;
//     chatDiv.appendChild(p);
//     input.value = "";
//   }

//   socket.on("display message", handleMessage);
// } // main closing bracket

// window.onload = main;
