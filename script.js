document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('gameContainer');
    const scoreDisplay = document.getElementById('score');
    let tiles = new Array(16).fill(0);
	let score = 0;
	
    const updateScore = (value) => {
        score += value;
        scoreDisplay.textContent = score; // Update the score display
    };

    const drawBoard = () => {
        container.innerHTML = '';
        tiles.forEach(tile => {
            const tileElement = document.createElement('div');
            tileElement.textContent = tile > 0 ? tile : '';
            tileElement.className = 'tile';
            tileElement.style.backgroundColor = tile > 0 ? `#${Math.log2(tile) * 3 % 16}c8c8c` : '#cdc1b4';
            container.appendChild(tileElement);
        });
    };

    const addTile = () => {
        let empty = tiles.flatMap((v, i) => v === 0 ? i : []);
        if (empty.length === 0) {
            return false;  // No space to add a new tile
        }
        let index = empty[Math.floor(Math.random() * empty.length)];
        tiles[index] = Math.random() > 0.9 ? 4 : 2;
        drawBoard();
        return true;
    };

    const slide = (row) => {
        let arr = row.filter(val => val);
        let missing = 4 - arr.length;
        let zeros = Array(missing).fill(0);
        return arr.concat(zeros);
    };

	const combine = (row) => {
		for (let i = 0; i < row.length - 1; i++) { // Iterate from left to right for merging
			if (row[i] === row[i + 1] && row[i] !== 0) {
                const combinedValue = row[i] * 2;
                row[i] = combinedValue;
				row[i + 1] = 0; // Set the second tile to zero
                updateScore(combinedValue); // Update score when tiles combine
				i++; // Increment i to skip the next tile after merging
			}
		}
		return row;
	};
	
	const checkAvailableMoves = () => {
		// Check for any empty spaces
		if (tiles.some(tile => tile === 0)) {
			return true;
		}

		// Check for possible merges horizontally and vertically
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				const tile = tiles[4 * i + j];
				// Check horizontally (except for the last column)
				if (j < 3 && tile === tiles[4 * i + j + 1]) {
					return true;
				}
				// Check vertically (except for the last row)
				if (i < 3 && tile === tiles[4 * (i + 1) + j]) {
					return true;
				}
			}
		}

		// If no empty spaces and no possible merges, no moves are available
		return false;
	};

	const handleMove = (direction) => {
		const oldTiles = [...tiles];
		for (let i = 0; i < 4; i++) {
			let row = [];
			switch (direction) {
				case 'up':
					row = [tiles[i], tiles[i + 4], tiles[i + 8], tiles[i + 12]];
					break;
				case 'down':
					row = [tiles[i + 12], tiles[i + 8], tiles[i + 4], tiles[i]];
					break;
				case 'left':
					row = [tiles[4 * i], tiles[4 * i + 1], tiles[4 * i + 2], tiles[4 * i + 3]];
					break;
				case 'right':
					row = [tiles[4 * i + 3], tiles[4 * i + 2], tiles[4 * i + 1], tiles[4 * i]];
					break;
			}
			row = slide(row);
			row = combine(row);
			row = slide(row); // Slide again to ensure all tiles are pushed after combining
			switch (direction) {
				case 'up':
					row.forEach((val, index) => tiles[i + 4 * index] = val);
					break;
				case 'down':
					row.reverse().forEach((val, index) => tiles[i + 4 * index] = val);
					break;
				case 'left':
					row.forEach((val, index) => tiles[4 * i + index] = val);
					break;
				case 'right':
					row.reverse().forEach((val, index) => tiles[4 * i + index] = val);
					break;
			}
		}
		if (oldTiles.join('') !== tiles.join('')) {
			if (!addTile()) {
				if (!checkAvailableMoves()) {
					alert('Game Over! No more moves possible.');
				}
			}
		}
		drawBoard();
	};

    document.addEventListener('keyup', (e) => {
        switch (e.key) {
            case 'ArrowUp':
                handleMove('up');
                break;
            case 'ArrowDown':
                handleMove('down');
                break;
            case 'ArrowLeft':
                handleMove('left');
                break;
            case 'ArrowRight':
                handleMove('right');
                break;
        }
        drawBoard();
    });

    addTile(); // Add the initial tile
    addTile(); // Add the second initial tile
});
