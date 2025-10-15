self.onmessage = function(args) {
    let x = args.data.x
    let y = args.data.y
    let wp = args.data.wp

    let result = {
        x: x,
        y: y,
        wall: false
    }

    if ( Math.random() > wp) {
        result.wall = true
    }    
    self.postMessage(result)
}
