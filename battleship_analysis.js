"use strict";
(function () {
	const rows = 10;
	const cols = 10;
	const squareSize = 50;
	const gameBoard = [];
	const gameBoardContainer = document.getElementById("gameboard");
	const strtOvrBtn = document.getElementById("strtOvrBtn");
	const ships = [];
	const probabilityChart = [];

	strtOvrBtn.addEventListener("click", function () {
		location.reload();
	});

	//inclusive
	const randomIntFromInterval = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

	let nameIndex = 0;
	const names = ["Carrier", "Battleship", "Cruiser", "Submarine", "Destroyer"];

	function placeShip(len) {
		const ship = [];
		const name = names[nameIndex];
		const dir = randomIntFromInterval(1, 2);
		const row = randomIntFromInterval(0, 9);
		const col = randomIntFromInterval(0, 9);
		let shipPlaceCounter = 0;
		if (dir == 1) {
			if (col >= len - 1) {
				for (let i = 0; i < len; i++) {
					if (gameBoard[row][col - i] == 0) {
						shipPlaceCounter++;
					}
				}
				if (shipPlaceCounter == len) {
					for (let i = 0; i < len; i++) {
						gameBoard[row][col - i] = 1;
						document.getElementById("s" + row + (col - i)).classList.add(name);
						ship.push([row, col - i]);
					}
				} else {
					placeShip(len);
				}
			} else {
				for (let i = 0; i < len; i++) {
					if (gameBoard[row][col + i] == 0) {
						shipPlaceCounter++;
					}
				}
				if (shipPlaceCounter == len) {
					for (let i = 0; i < len; i++) {
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
				for (let i = 0; i < len; i++) {
					if (gameBoard[row - i][col] == 0) {
						shipPlaceCounter++;
					}
				}
				if (shipPlaceCounter == len) {
					for (let i = 0; i < len; i++) {
						gameBoard[row - i][col] = 1;
						document.getElementById("s" + (row - i) + col).classList.add(name);
						ship.push([row - i, col]);
					}
				} else {
					placeShip(len);
				}
			} else {
				for (let i = 0; i < len; i++) {
					if (gameBoard[row + i][col] == 0) {
						shipPlaceCounter++;
					}
				}
				if (shipPlaceCounter == len) {
					for (let i = 0; i < len; i++) {
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

	for (let i = 0; i < cols; i++) {
		gameBoard.push([]);
		for (let j = 0; j < rows; j++) {
			gameBoard[i].push(0);
			const square = document.createElement("div");
			const num = document.createElement("p");
			gameBoardContainer.appendChild(square);
			square.appendChild(num);
			square.id = "s" + j + i;
			num.id = "p" + j + i;
			num.classList.add("numText");
			const topPosition = j * squareSize;
			const leftPosition = i * squareSize;
			square.style.top = topPosition + "px";
			square.style.left = leftPosition + "px";
		}
	}

	placeShip(5);
	placeShip(4);
	placeShip(3);
	placeShip(3);
	placeShip(2);

	for (let i = 0; i < cols; i++) {
		probabilityChart.push([]);
		for (let j = 0; j < rows; j++) {
			probabilityChart[i].push(0);
			document.getElementById("s" + i + j).style.background = "#80aaff";
			if (gameBoard[i][j] == 1) {
				document.getElementById("s" + i + j).style.background = "white";
			}
		}
	}

	let shipFound = 0;
	let carrierSunk = false;
	let battleshipSunk = false;
	let cruiserSunk = false;
	let submarineSunk = false;
	let destroyerSunk = false;
	let shotsFired = 0;
	let lastShotX;
	let lastShotY;
	let shipDirection = "";
	let firstTimeIn = true;
	let scanCounter = 0;
	let tempShipFound = 0;
	let gameOver = false;

	const shipSunkHelper = function (i, sunkShipName) {
		sunkColorChange(sunkShipName);
		shipFound = shipFound - i;
		shipDirection = "";
		firstTimeIn = true;
		tempShipFound = 0;
		shipHitButNotSunkReassign();
	};

	const shipSunkChecker = function () {
		let carrierCounter = 0;
		let battleshipCounter = 0;
		let cruiserCounter = 0;
		let submarineCounter = 0;
		let destroyerCounter = 0;
		for (let i = 0; i < cols; i++) {
			for (let j = 0; j < rows; j++) {
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

	const shipFoundAttack = function () {
		const x = lastShotX;
		const y = lastShotY;
		if (shipDirection == "ver") {
			if (!(x + 1 > 9)) {
				if (gameBoard[x + 1][y] == 0) {
					document.getElementById("s" + (x + 1) + y).style.background =
						"#4d88ff";
					document.getElementById("s" + (x + 1) + y).classList.add("miss");
					gameBoard[x + 1][y] = 3;
					shotsFired++;
					document.getElementById("p" + (x + 1) + y).innerText = shotsFired;
					return;
				} else if (gameBoard[x + 1][y] == 1) {
					document.getElementById("s" + (x + 1) + y).style.background = "red";
					document.getElementById("s" + (x + 1) + y).classList.add("hit");
					gameBoard[x + 1][y] = 2;
					shotsFired++;
					shipFound++;
					lastShotX++;
					document.getElementById("p" + (x + 1) + y).innerText = shotsFired;
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
					document.getElementById(
						"p" + (x - tempShipFound) + y
					).innerText = shotsFired;
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
					document.getElementById(
						"p" + (x - tempShipFound) + y
					).innerText = shotsFired;
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
					document.getElementById("p" + x + (y + 1)).innerText = shotsFired;
					return;
				} else if (gameBoard[x][y + 1] == 1) {
					document.getElementById("s" + x + (y + 1)).style.background = "red";
					document.getElementById("s" + x + (y + 1)).classList.add("hit");
					gameBoard[x][y + 1] = 2;
					shotsFired++;
					shipFound++;
					lastShotY++;
					document.getElementById("p" + x + (y + 1)).innerText = shotsFired;
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
					document.getElementById(
						"p" + x + (y - tempShipFound)
					).innerText = shotsFired;
					return;
				}
				for (let i = 1; i < 10; i++) {
					if (y - i < 0) {
						break;
					} else if (gameBoard[x][y - i] == 1) {
						document.getElementById("s" + x + (y - i)).style.background = "red";
						document.getElementById("s" + x + (y - i)).classList.add("hit");
						gameBoard[x][y - i] = 2;
						shotsFired++;
						shipFound++;
						document.getElementById("p" + x + (y - i)).innerText = shotsFired;
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
					document.getElementById("p" + (x + 1) + y).innerText = shotsFired;
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
					document.getElementById("p" + (x + 1) + y).innerText = shotsFired;
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
					document.getElementById("p" + (x - 1) + y).innerText = shotsFired;
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
					document.getElementById("p" + (x - 1) + y).innerText = shotsFired;
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
					document.getElementById("p" + x + (y + 1)).innerText = shotsFired;
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
					document.getElementById("p" + x + (y + 1)).innerText = shotsFired;
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
				document.getElementById("p" + x + (y - 1)).innerText = shotsFired;
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
				document.getElementById("p" + x + (y - 1)).innerText = shotsFired;
				return;
			}
		}
	};

	const searchingShot = function () {
		let x;
		let y;
		if (shotsFired < 8) {
			do {
				if (shotsFired < 4) {
					x = randomIntFromInterval(2, 7);
					y = randomIntFromInterval(2, 7);
				} else {
					x = randomIntFromInterval(1, 8);
					y = randomIntFromInterval(1, 8);
				}
			} while ((x % 2 != 0 && y % 2 == 0) || (x % 2 == 0 && y % 2 != 0));
		} else {
			const location = probabilityCalculator();
			[x, y] = location;
			resetProbabilityChart();
		}
		lastShotX = x;
		lastShotY = y;
		if (gameBoard[x][y] == 0) {
			document.getElementById("s" + x + y).style.background = "#4d88ff";
			document.getElementById("s" + x + y).classList.add("miss");
			gameBoard[x][y] = 3;
			shotsFired++;
			document.getElementById("p" + x + y).innerText = shotsFired;
		} else if (gameBoard[x][y] == 1) {
			document.getElementById("s" + x + y).style.background = "red";
			document.getElementById("s" + x + y).classList.add("hit");
			gameBoard[x][y] = 2;
			shotsFired++;
			shipFound++;
			document.getElementById("p" + x + y).innerText = shotsFired;
		} else if (
			gameBoard[x][y] == 2 ||
			gameBoard[x][y] == 3 ||
			gameBoard[x][y] == 4
		) {
			searchingShot();
		}
	};

	const probabilityCalculator = function () {
		const lengthsLeft = [];
		let counter = 0;
		if (!carrierSunk) {
			lengthsLeft.push(5);
		} else if (!battleshipSunk) {
			lengthsLeft.push(4);
		} else if (!submarineSunk) {
			lengthsLeft.push(3);
		} else if (!cruiserSunk) {
			lengthsLeft.push(3);
		} else if (!destroyerSunk) {
			lengthsLeft.push(2);
		}
		for (let n = 0; n < lengthsLeft.length; n++) {
			for (let i = 0; i < rows; i++) {
				for (let j = 0; j < rows - lengthsLeft[n] + 1; j++) {
					for (let k = 0; k < lengthsLeft[n]; k++) {
						if (gameBoard[i][j + k][0] !== 2 && gameBoard[i][j + k][0] !== 3 && gameBoard[i][j + k][0] !== 4) {
							counter++;
						}
					}
					if (counter === lengthsLeft[n]) {
						for (let k = 0; k < lengthsLeft[n]; k++) {
							probabilityChart[i][j + k]++;
						}
					}
					counter = 0;
				}
			}
			for (let i = 0; i < cols; i++) {
				for (let j = 0; j < cols - lengthsLeft[n] + 1; j++) {
					for (let k = 0; k < lengthsLeft[n]; k++) {
						if (gameBoard[j + k][i][0] !== 2 && gameBoard[j + k][i][0] !== 3 && gameBoard[j + k][i][0] !== 4) {
							counter++;
						}
					}
					if (counter === lengthsLeft[n]) {
						for (let k = 0; k < lengthsLeft[n]; k++) {
							probabilityChart[j + k][i]++;
						}
					}
					counter = 0;
				}
			}
		}
		let currentMax = 0;
		let x;
		let y;
		for (let i = 0; i < cols; i++) {
			for (let j = 0; j < rows; j++) {
				if (probabilityChart[i][j] > currentMax) {
					currentMax = probabilityChart[i][j];
					x = i;
					y = j;
				}
			}
		}
		return [x, y];
	};

	const resetProbabilityChart = function () {
		for (let i = 0; i < cols; i++) {
			for (let j = 0; j < rows; j++) {
				probabilityChart[i][j] = 0;
			}
		}
	};

	const compMove = function () {
		if (gameOver) {
			return;
		}
		if (shipFound > 0) {
			shipFoundAttack();
		} else {
			searchingShot();
		}
		shipSunkChecker();
		gaveOverChecker();
	};

	const shipHitButNotSunkReassign = function () {
		for (let i = 0; i < cols; i++) {
			for (let j = 0; j < rows; j++) {
				if (document.getElementById("s" + i + j).style.background == "red") {
					lastShotX = i;
					lastShotY = j;
					return;
				}
			}
		}
	};

	const sunkColorChange = function (shipName) {
		for (let i = 0; i < cols; i++) {
			for (let j = 0; j < rows; j++) {
				if (
					document.getElementById("s" + i + j).classList.contains(shipName) &&
					document.getElementById("s" + i + j).classList.contains("hit")
				) {
					document.getElementById("s" + i + j).style.background = "darkred";
				}
			}
		}
	};

	document.getElementById("compfr").addEventListener("click", function () {
		for (let i = 0; i < 100; i++) {
			if (gameOver) {
				break;
			} else {
				compMove();
			}
		}
	});
})();
