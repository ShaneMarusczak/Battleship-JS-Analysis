"use strict";
(function() {
  var whereShotX;
  var whereShoty;
  const rows = 10;
  const cols = 10;
  const squareSize = 50;
  var gameBoard = [];
  var gameBoardContainer = document.getElementById("gameboard");
  var strtOvrBtn = document.getElementById("strtOvrBtn");
  var ships = [];

  strtOvrBtn.addEventListener("click", function() {
    location.reload();
  });

  function randomIntFromInterval(min, max) {
    //inclusive
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  var nameIndex = 0;
  var names = ["Carrier", "Battleship", "Cruiser", "Submarine", "Destroyer"];

  function placeShip(len) {
    var ship = [];
    var name = names[nameIndex];
    var dir = randomIntFromInterval(1, 2);
    var row = randomIntFromInterval(0, 9);
    var col = randomIntFromInterval(0, 9);
    var shipPlaceCounter = 0;
    if (dir == 1) {
      if (col >= len - 1) {
        for (var i = 0; i < len; i++) {
          if (gameBoard[row][col - i] == 0) {
            shipPlaceCounter++;
          }
        }
        if (shipPlaceCounter == len) {
          for (var i = 0; i < len; i++) {
            gameBoard[row][col - i] = 1;
            document.getElementById("s" + row + (col - i)).classList.add(name);
            ship.push([row, col - i]);
          }
        } else {
          placeShip(len);
        }
      } else {
        for (var i = 0; i < len; i++) {
          if (gameBoard[row][col + i] == 0) {
            shipPlaceCounter++;
          }
        }
        if (shipPlaceCounter == len) {
          for (var i = 0; i < len; i++) {
            gameBoard[row][col + i] = 1;
            document.getElementById("s" + row + (col + i)).classList.add(name);
            ship.push([row, col + i]);
          }
        } else {
          placeShip(len);
        }
      }
    } else {
      if (row >= len - 1) {
        for (var i = 0; i < len; i++) {
          if (gameBoard[row - i][col] == 0) {
            shipPlaceCounter++;
          }
        }
        if (shipPlaceCounter == len) {
          for (var i = 0; i < len; i++) {
            gameBoard[row - i][col] = 1;
            document.getElementById("s" + (row - i) + col).classList.add(name);
            ship.push([row - i, col]);
          }
        } else {
          placeShip(len);
        }
      } else {
        for (var i = 0; i < len; i++) {
          if (gameBoard[row + i][col] == 0) {
            shipPlaceCounter++;
          }
        }
        if (shipPlaceCounter == len) {
          for (var i = 0; i < len; i++) {
            gameBoard[row + i][col] = 1;
            document.getElementById("s" + (row + i) + col).classList.add(name);
            ship.push([row + i, col]);
          }
        } else {
          placeShip(len);
        }
      }
    }
    if (ship.length != 0) {
      ships.push(ship);
      nameIndex++;
    }
  }

  for (var i = 0; i < cols; i++) {
    gameBoard.push([]);
    for (var j = 0; j < rows; j++) {
      gameBoard[i].push(0);
      var square = document.createElement("div");
      var num = document.createElement("p");
      gameBoardContainer.appendChild(square);
      square.appendChild(num);
      square.id = "s" + j + i;
      num.id = "p" + j + i;
      num.classList.add("numText");
      var topPosition = j * squareSize;
      var leftPosition = i * squareSize;
      square.style.top = topPosition + "px";
      square.style.left = leftPosition + "px";
    }
  }

  placeShip(5);
  placeShip(4);
  placeShip(3);
  placeShip(3);
  placeShip(2);

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      document.getElementById("s" + i + j).style.background = "#80aaff";
      if (gameBoard[i][j] == 1) {
        document.getElementById("s" + i + j).style.background = "white";
      }
    }
  }

  var shipFound = 0;
  var carrierSunk = false;
  var battleshipSunk = false;
  var cruiserSunk = false;
  var submarineSunk = false;
  var destroyerSunk = false;
  var hittingShipFound = false;
  var shotsFired = 0;
  var lastShotX;
  var lastShotY;
  var shipDirection = "";
  var firstTimeIn = true;
  var scanCounter = 0;
  var tempShipFound = 0;
  var gameOver = false;

  var shipSunkHelper = function(i, sunkShipName) {
    sunkColorChange(sunkShipName);
    shipFound = shipFound - i;
    shipDirection = "";
    firstTimeIn = true;
    tempShipFound = 0;
    hittingShipFound = false;
    shipHitButNotSunkReassign();
  };

  var shipSunkChecker = function() {
    var carrierCounter = 0;
    var battleshipCounter = 0;
    var cruiserCounter = 0;
    var submarineCounter = 0;
    var destroyerCounter = 0;
    for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
        if (
          document.getElementById("s" + i + j).classList.contains("Carrier") &&
          document.getElementById("s" + i + j).classList.contains("hit") &&
          !carrierSunk
        ) {
          carrierCounter++;
        }
        if (
          document
            .getElementById("s" + i + j)
            .classList.contains("Battleship") &&
          document.getElementById("s" + i + j).classList.contains("hit") &&
          !battleshipSunk
        ) {
          battleshipCounter++;
        }
        if (
          document.getElementById("s" + i + j).classList.contains("Cruiser") &&
          document.getElementById("s" + i + j).classList.contains("hit") &&
          !cruiserSunk
        ) {
          cruiserCounter++;
        }
        if (
          document
            .getElementById("s" + i + j)
            .classList.contains("Submarine") &&
          document.getElementById("s" + i + j).classList.contains("hit") &&
          !submarineSunk
        ) {
          submarineCounter++;
        }
        if (
          document
            .getElementById("s" + i + j)
            .classList.contains("Destroyer") &&
          document.getElementById("s" + i + j).classList.contains("hit") &&
          !destroyerSunk
        ) {
          destroyerCounter++;
        }
      }
    }
    if (carrierCounter == 5) {
      carrierSunk = true;
      shipSunkHelper(5, "Carrier");
    }
    if (battleshipCounter == 4) {
      battleshipSunk = true;
      shipSunkHelper(4, "Battleship");
    }
    if (cruiserCounter == 3) {
      cruiserSunk = true;
      shipSunkHelper(3, "Cruiser");
    }
    if (submarineCounter == 3) {
      submarineSunk = true;
      shipSunkHelper(3, "Submarine");
    }
    if (destroyerCounter == 2) {
      destroyerSunk = true;
      shipSunkHelper(2, "Destroyer");
    }
  };

  function gaveOverChecker() {
    if (
      carrierSunk &&
      battleshipSunk &&
      cruiserSunk &&
      submarineSunk &&
      destroyerSunk
    ) {
      gameOver = true;
      document.getElementById("totalShots").innerText = shotsFired;
      document.getElementById("totalHits").innerText = 17;
      document.getElementById("totalMisses").innerText = shotsFired - 17;
      document.getElementById("hitPercentage").innerText =
        Math.round(100 * (17 / shotsFired)) + "%";
    }
  }

  var shipFoundAttack = function() {
    var x = lastShotX;
    var y = lastShotY;
    if (shipDirection == "ver") {
      if (!(x + 1 > 9)) {
        if (gameBoard[x + 1][y] == 0) {
          document.getElementById("s" + (x + 1) + y).style.background =
            "#4d88ff";
          document.getElementById("s" + (x + 1) + y).classList.add("miss");
          gameBoard[x + 1][y] = 3;
          shotsFired++;
          whereShotX = x + 1;
          whereShoty = y;
          return;
        } else if (gameBoard[x + 1][y] == 1) {
          document.getElementById("s" + (x + 1) + y).style.background = "red";
          document.getElementById("s" + (x + 1) + y).classList.add("hit");
          gameBoard[x + 1][y] = 2;
          shotsFired++;
          shipFound++;
          lastShotX++;
          whereShotX = x + 1;
          whereShoty = y;
          return;
        }
      }
      if (x + 1 > 9 || gameBoard[x + 1][y] == 2 || gameBoard[x + 1][y] == 3) {
        if (firstTimeIn) {
          tempShipFound = shipFound + tempShipFound;
          firstTimeIn = false;
        }
        if (x - tempShipFound > -1 && gameBoard[x - tempShipFound][y] == 0) {
          document.getElementById(
            "s" + (x - tempShipFound) + y
          ).style.background = "#4d88ff";
          document
            .getElementById("s" + (x - tempShipFound) + y)
            .classList.add("miss");
          gameBoard[x - tempShipFound][y] = 3;
          shotsFired++;
          whereShotX = x - tempShipFound;
          whereShoty = y;
          return;
        } else if (
          x - tempShipFound > -1 &&
          gameBoard[x - tempShipFound][y] == 1
        ) {
          document.getElementById(
            "s" + (x - tempShipFound) + y
          ).style.background = "red";
          document
            .getElementById("s" + (x - tempShipFound) + y)
            .classList.add("hit");
          gameBoard[x - tempShipFound][y] = 2;
          shotsFired++;
          shipFound++;
          lastShotX--;
          whereShotX = x - tempShipFound;
          whereShoty = y;
          return;
        } else {
          scanCounter = 0;
          shipDirection = "";
          firstTimeIn = true;
          tempShipFound--;
          tempShipFound--;
        }
      }
    }
    if (shipDirection == "hor") {
      if (!(y + 1 > 9)) {
        if (gameBoard[x][y + 1] == 0) {
          document.getElementById("s" + x + (y + 1)).style.background =
            "#4d88ff";
          document.getElementById("s" + x + (y + 1)).classList.add("miss");
          gameBoard[x][y + 1] = 3;
          shotsFired++;
          whereShotX = x;
          whereShoty = y + 1;
          return;
        } else if (gameBoard[x][y + 1] == 1) {
          document.getElementById("s" + x + (y + 1)).style.background = "red";
          document.getElementById("s" + x + (y + 1)).classList.add("hit");
          gameBoard[x][y + 1] = 2;
          shotsFired++;
          shipFound++;
          lastShotY++;
          whereShotX = x;
          whereShoty = y + 1;
          return;
        }
      }
      if (y + 1 > 9 || gameBoard[x][y + 1] == 2 || gameBoard[x][y + 1] == 3) {
        if (firstTimeIn) {
          tempShipFound = shipFound + tempShipFound;
          firstTimeIn = false;
        }
        if (gameBoard[x][y - tempShipFound] == 0) {
          document.getElementById(
            "s" + x + (y - tempShipFound)
          ).style.background = "#4d88ff";
          document
            .getElementById("s" + x + (y - tempShipFound))
            .classList.add("miss");
          gameBoard[x][y - tempShipFound] = 3;
          shotsFired++;
          whereShotX = x;
          whereShoty = y - tempShipFound;
          return;
        }
        for (var i = 1; i < 10; i++) {
          if (y - i < 0) {
            break;
          } else if (gameBoard[x][y - i] == 1) {
            document.getElementById("s" + x + (y - i)).style.background = "red";
            document.getElementById("s" + x + (y - i)).classList.add("hit");
            gameBoard[x][y - i] = 2;
            shotsFired++;
            shipFound++;
            whereShotX = x;
            whereShoty = y - i;
            return;
          }
        }
        scanCounter = 0;
        shipDirection = "";
        firstTimeIn = true;
        tempShipFound--;
        tempShipFound--;
      }
    }
    if (scanCounter == 0 && shipDirection == "") {
      if (x + 1 > 9) {
        scanCounter++;
      } else {
        if (gameBoard[x + 1][y] == 0) {
          document.getElementById("s" + (x + 1) + y).style.background =
            "#4d88ff";
          document.getElementById("s" + (x + 1) + y).classList.add("miss");
          gameBoard[x + 1][y] = 3;
          shotsFired++;
          scanCounter++;
          whereShotX = x + 1;
          whereShoty = y;
          return;
        } else if (gameBoard[x + 1][y] == 1) {
          document.getElementById("s" + (x + 1) + y).style.background = "red";
          document.getElementById("s" + (x + 1) + y).classList.add("hit");
          gameBoard[x + 1][y] = 2;
          shotsFired++;
          shipFound++;
          shipDirection = "ver";
          scanCounter = 0;
          lastShotX++;
          whereShotX = x + 1;
          whereShoty = y;
          return;
        } else {
          scanCounter++;
        }
      }
    }
    if (scanCounter == 1 && shipDirection == "") {
      if (x - 1 < 0) {
        scanCounter++;
      } else {
        if (gameBoard[x - 1][y] == 0) {
          document.getElementById("s" + (x - 1) + y).style.background =
            "#4d88ff";
          document.getElementById("s" + (x - 1) + y).classList.add("miss");
          gameBoard[x - 1][y] = 3;
          shotsFired++;
          scanCounter++;
          whereShotX = x - 1;
          whereShoty = y;
          return;
        } else if (gameBoard[x - 1][y] == 1) {
          document.getElementById("s" + (x - 1) + y).style.background = "red";
          document.getElementById("s" + (x - 1) + y).classList.add("hit");
          gameBoard[x - 1][y] = 2;
          shotsFired++;
          shipFound++;
          shipDirection = "ver";
          scanCounter = 0;
          lastShotX--;
          tempShipFound--;
          whereShotX = x - 1;
          whereShoty = y;
          return;
        } else {
          scanCounter++;
        }
      }
    }
    if (scanCounter == 2 && shipDirection == "") {
      if (y + 1 > 9) {
        scanCounter++;
      } else {
        if (gameBoard[x][y + 1] == 0) {
          document.getElementById("s" + x + (y + 1)).style.background =
            "#4d88ff";
          document.getElementById("s" + x + (y + 1)).classList.add("miss");
          gameBoard[x][y + 1] = 3;
          shotsFired++;
          scanCounter++;
          whereShotX = x;
          whereShoty = y + 1;
          return;
        } else if (gameBoard[x][y + 1] == 1) {
          document.getElementById("s" + x + (y + 1)).style.background = "red";
          document.getElementById("s" + x + (y + 1)).classList.add("hit");
          gameBoard[x][y + 1] = 2;
          shotsFired++;
          shipFound++;
          shipDirection = "hor";
          scanCounter = 0;
          lastShotY++;
          whereShotX = x;
          whereShoty = y + 1;
          return;
        } else {
          scanCounter++;
        }
      }
    }
    if (scanCounter == 3 && shipDirection == "") {
      if (gameBoard[x][y - 1] == 0) {
        document.getElementById("s" + x + (y - 1)).style.background = "#4d88ff";
        document.getElementById("s" + x + (y - 1)).classList.add("miss");
        gameBoard[x][y - 1] = 3;
        shotsFired++;
        scanCounter++;
        whereShotX = x;
        whereShoty = y - 1;
        return;
      } else if (gameBoard[x][y - 1] == 1) {
        document.getElementById("s" + x + (y - 1)).style.background = "red";
        document.getElementById("s" + x + (y - 1)).classList.add("hit");
        gameBoard[x][y - 1] = 2;
        shotsFired++;
        shipFound++;
        shipDirection = "hor";
        scanCounter = 0;
        lastShotY--;
        tempShipFound--;
        whereShotX = x;
        whereShoty = y - 1;
        return;
      }
    }
  };

  var searchingShot = function() {
    var x;
    var y;
    do {
      if (shotsFired < 6) {
        x = randomIntFromInterval(3, 7);
        y = randomIntFromInterval(3, 7);
      } else if (shotsFired < 12) {
        x = randomIntFromInterval(2, 8);
        y = randomIntFromInterval(2, 8);
      } else {
        x = randomIntFromInterval(0, 9);
        y = randomIntFromInterval(0, 9);
      }
    } while ((x % 2 != 0 && y % 2 == 0) || (x % 2 == 0 && y % 2 != 0));
    lastShotX = x;
    lastShotY = y;
    if (gameBoard[x][y] == 0) {
      document.getElementById("s" + x + y).style.background = "#4d88ff";
      document.getElementById("s" + x + y).classList.add("miss");
      gameBoard[x][y] = 3;
      shotsFired++;
      whereShotX = x;
      whereShoty = y;
    } else if (gameBoard[x][y] == 1) {
      document.getElementById("s" + x + y).style.background = "red";
      document.getElementById("s" + x + y).classList.add("hit");
      gameBoard[x][y] = 2;
      shotsFired++;
      shipFound++;
      whereShotX = x;
      whereShoty = y;
    } else if (gameBoard[x][y] == 2 || gameBoard[x][y] == 3) {
      searchingShot();
    }
  };

  var scanShipFound = 1;

  var scanShipFoundAttack = function() {
    var x = lastShotX;
    var y = lastShotY;

    if (!(y + 1 > 9)) {
      if (gameBoard[x][y + 1] == 0) {
        document.getElementById("s" + x + (y + 1)).style.background = "#4d88ff";
        document.getElementById("s" + x + (y + 1)).classList.add("miss");
        gameBoard[x][y + 1] = 3;
        shotsFired++;
        whereShotX = x;
        whereShoty = y + 1;
        return;
      } else if (gameBoard[x][y + 1] == 1) {
        document.getElementById("s" + x + (y + 1)).style.background = "red";
        document.getElementById("s" + x + (y + 1)).classList.add("hit");
        gameBoard[x][y + 1] = 2;
        shotsFired++;
        shipFound++;
        scanShipFound++;
        lastShotY++;
        whereShotX = x;
        whereShoty = y + 1;
        return;
      }
    }
    if (y + 1 > 9 || gameBoard[x][y + 1] == 2 || gameBoard[x][y + 1] == 3) {
      if (gameBoard[x][y - scanShipFound] == 0) {
        document.getElementById(
          "s" + x + (y - scanShipFound)
        ).style.background = "#4d88ff";
        document
          .getElementById("s" + x + (y - scanShipFound))
          .classList.add("miss");
        gameBoard[x][y - scanShipFound] = 3;
        shotsFired++;
        whereShotX = x;
        whereShoty = y - scanShipFound;
        return;
      } else {
        for (var i = 1; i < 10; i++) {
          if (gameBoard[x][y - i] == 1) {
            document.getElementById("s" + x + (y - i)).style.background = "red";
            document.getElementById("s" + x + (y - i)).classList.add("hit");
            gameBoard[x][y - i] = 2;
            shotsFired++;
            shipFound++;
            whereShotX = x;
            whereShoty = y - i;
            return;
          }
        }
      }
    }
  };

  var compMove = function() {
    if (gameOver) {
      return;
    }
    if (hittingShipFound) {
      scanShipFoundAttack();
    } else {
      if (shipFound > 0) {
        shipFoundAttack();
      } else {
        searchingShot();
      }
    }
    shipSunkChecker();
    document.getElementById(
      "p" + whereShotX + whereShoty
    ).innerText = shotsFired;
    gaveOverChecker();
  };

  var shipHitButNotSunkReassign = function() {
    for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
        if (document.getElementById("s" + i + j).style.background == "red") {
          lastShotX = i;
          lastShotY = j;
          hittingShipFound = true;
          scanShipFound = 1;
          return;
        }
      }
    }
  };

  var sunkColorChange = function(shipName) {
    for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
        if (
          document.getElementById("s" + i + j).classList.contains(shipName) &&
          document.getElementById("s" + i + j).classList.contains("hit")
        ) {
          document.getElementById("s" + i + j).style.background = "darkred";
        }
      }
    }
  };

  document.getElementById("compfr").addEventListener("click", function() {
    for (var i = 0; i < 100; i++) {
      if (gameOver) {
        break;
      } else {
        compMove();
      }
    }
  });
})();
