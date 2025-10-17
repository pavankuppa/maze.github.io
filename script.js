(function () {
    let maze;
    const form = document.getElementById("mazeForm");
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const form = event.target;
        const rows = parseInt(form.rows.value);
        const cols = parseInt(form.cols.value);
        const wallProbability = parseInt(form.wallProbability.value);
        if (maze) {
            maze.clear();
            maze.update(rows, cols, wallProbability);
        } else {
            maze = new Maze(rows, cols, wallProbability);
        }
    });

    class Maze {
        constructor(rows, cols, wallProbability) {
            this.dotColor = "red";
            this.wallColor = "green";
            this.radius = 3;
            this.boxSize = 30;

            this.#initialize(rows, cols, wallProbability);

            this.#createCanvas();
            this.#drawDot();
            this.#wallWorker();
            this.#generateWall();
        }

        #initialize(rows, cols, wallProbability) {
            this.rows = rows;
            this.cols = cols;
            this.wallProbability = wallProbability;
            if (this.canvas) {
                this.canvas.width = this.cols * this.boxSize + this.cols;
                this.canvas.height = this.rows * this.boxSize + this.rows;
                this.context = this.canvas.getContext("2d");
            }
        }

        #generateWall() {
            const request = {
                width: this.canvas.width,
                height: this.canvas.height,
                boxSize: this.boxSize,
                wallProbability: this.wallProbability,
            };

            this.wallWorker.postMessage(request);
        }

        #wallWorker() {
            if (typeof Worker !== "undefined") {
                if (typeof worker == "undefined") {
                    let that = this;
                    this.wallWorker = new Worker("maze_worker.js");
                    this.wallWorker.onmessage = function (result) {
                        that.#drawWall(result.data);
                    };
                }
            }
        }

        #createCanvas() {
            const container = document.getElementById("canvas-view");
            this.canvas = document.createElement("canvas");
            this.canvas.width = this.cols * this.boxSize + this.cols;
            this.canvas.height = this.rows * this.boxSize + this.rows;

            this.context = this.canvas.getContext("2d");
            container.append(this.canvas);
        }

        #drawDot() {
            this.context.beginPath();
            this.context.fillStyle = this.dotColor;
            for (
                let i = this.boxSize / 2;
                i < this.canvas.height;
                i += this.boxSize + 1
            ) {
                for (
                    let j = this.boxSize / 2;
                    j < this.canvas.width;
                    j += this.boxSize + 1
                ) {
                    this.context.fillRect(j, i, this.radius, this.radius);
                }
            }
        }

        #drawWall(result) {
            if (result) {
                this.context.strokeStyle = this.wallColor;
                this.context.lineWidth = 1;
                this.context.beginPath();
                this.context.moveTo(result.x, result.y);
                if (result.type == "h") {
                    this.context.lineTo(result.x, result.y + this.boxSize);
                } else {
                    this.context.lineTo(result.x + this.boxSize, result.y);
                }
                this.context.stroke();
            }
        }

        clear() {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }

        update(rows, cols, wallProbability) {
            this.#initialize(rows, cols, wallProbability);
            this.#drawDot();
            this.#generateWall();
        }
    }
})();


