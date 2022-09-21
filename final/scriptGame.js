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

      if (entity < 0.4 && entity > 0.01) {
        arr.push(new Grass(j, i));
      }

      if (entity < 0.01) {
        arr.push(new GrassEater(j, i, 15));
      }
    }
    matrix.push(arr);
  }
}

timer = 0;
timerG = 0;

function draw() {
  frameRate(24);
  var side = 10;
  emptyCells = [];
  grassCells = [];
  timerG++;
  timer++;
  for (var i = 0; i < 80; i++) {
    for (var j = 0; j < 80; j++) {
      if (matrix[j][i] instanceof Grass) {
        fill("green");
        emptyCells.push(matrix[j][i].chooseCells());
        emptyCells = emptyCells.filter((e) => e != null);
      } else if (matrix[j][i] instanceof GrassEater) {
        fill("yellow");
        grassCells.push(matrix[j][i].chooseCellsE());
        grassCells = grassCells.filter((e) => e != null);
      }
      if (matrix[j][i] instanceof Empty) {
        fill("grey");
      }
      rect(j * side, i * side, side, side);
    }
  }

  //timer = 10 -> create new grass
  if (timerG == 5) {
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

class Grass extends BasicCharacter {
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

class BasicCharacter {
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

class GrassEater {
  constructor(x, y, energy) {
    this.x = x;
    this.y = y;
    this.energy = energy;
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
    var targetCell = this.chooseCells();
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

class Empty {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Predator extends BasicCharacter{
    constructor(x, y, energy) {
        this.x = x;
        this.y = y;
        this.energy = energy;
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
console.log(randomNumber(3));

function fillArray() {
  var arr = [];
  arr.push(new Grass(0, 0));
  arr.push(new GrassEater(1, 1));
  arr.push(new EmptyCells(2, 2));
}
console.log(fillArray);
