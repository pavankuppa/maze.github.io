self.onmessage = function(request) {
    const width = request.data.width
    const height = request.data.height
    const wallProbability = request.data.wallProbability
    const boxSize = request.data.boxSize

    const walls = []

    for(let i = boxSize+1; i <= height; i+=boxSize+1){
        for(let j = boxSize+1; j <= width; j+=boxSize+1){
            walls.push({ x: j, y: i -(boxSize+1), type: "h" })
            walls.push({ x: j-(boxSize+1), y: i, type: "v" })
        }
    }

    let counts = 0;
    const total = Math.ceil(walls.length*wallProbability/100)
    while(counts <= total) {
        const index = Math.floor(Math.random() * walls.length);
        self.postMessage(walls[index])
        walls.splice(index, 1)
        counts++;
    }

}
