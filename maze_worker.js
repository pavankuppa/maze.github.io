self.onmessage = function (request) {
    const width = request.data.width
    const height = request.data.height
    const wallProbability = request.data.wallProbability
    const boxSize = request.data.boxSize

    let walls = []

    for (let i = boxSize + 1; i <= height; i += boxSize + 1) {
        for (let j = boxSize + 1; j <= width; j += boxSize + 1) {
            if (j != width)
                walls.push({ x: j, y: i - (boxSize + 1), type: "h" })
            if (i != height)
                walls.push({ x: j - (boxSize + 1), y: i, type: "v" })
        }
    }

    walls = shuffleWalls(walls)

    let counts = 0;
    const total = Math.ceil(walls.length * wallProbability / 100)
    while (counts <= total) {
        const index = Math.floor(Math.random() * walls.length);
        self.postMessage(walls[index])
        walls.splice(index, 1)
        counts++;
    }
}

function shuffleWalls(walls) {
    for (let i = walls.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // random index
        [walls[i], walls[j]] = [walls[j], walls[i]];   // swap
    }
    return walls;
}
