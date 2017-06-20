var router = require('express').Router();

//global variables, used in external functions
var mazePath = []; //keep track of the shortest path
var dist = 0; // keep track of current distance from maze start, and stop crawler if it runs into a previously checked block.

router.post('/', function(req, res) {
    mazePath = []; // reset path for new maze
    dist = 0; // reset distance for new maze
    var mazeInput = req.body.maze;
    var mazeMatrix = []; // create matrix to store maze
    var mazeLines = mazeInput.split('\n'); // split maze string by line/row.
    for(var i = 0; i < mazeLines.length; i++) {
        mazeMatrix.push(mazeLines[i].split('')); // split each character in each row and push to multi-dimensional array
    }
    var mazeStart = indexOf2DArray(mazeMatrix, 'A'); // find maze start
    var mazeEnd = indexOf2DArray(mazeMatrix, 'B'); // find maze end
    
    var solver = new SolveMaze(mazeMatrix); // create maze solver object with constructed maze matrix
    solver.crawl(mazeStart.row, mazeStart.col); // crawl the maze to mark each block with the distance from center. unreachable blocks will be left as is
    solver.findShortestPath(mazeEnd.row, mazeEnd.col); // once maze marked with distances, work backwards and store the shortest distance path coordinates
    for(var i = 0; i < mazePath.length; i++) {
        solver.maze[mazePath[i].row][mazePath[i].col] = '+'; // re-draws shortest path with '+'
    }
    res.send(solver); // send whole solver object back to client
})

function SolveMaze(maze) {
    this.maze = maze;
    this.hasSolution = true;
    this.start;
    this.end;
    this.numberOfSteps = -1;

    this.crawl = function(row, column) {
        // checks if current block is a wall or other (start, path, or previously visited)
        // if previously visited, if the previous marked distances is larger, override with new shortest path
        if ((this.maze[row][column] == '.') || (this.maze[row][column] == 'A') || (this.maze[row][column] > dist)) {
            if (this.maze[row][column] == 'A') {
                this.start = {row: row, col: column};
                this.maze[row][column] = 0; // starting block is marked as distance 0
            } else {
                // if not starting block, check each surrounding block to determine how far current block is from start
                this.maze[row][column] = checkPrevDistance(this.maze, row, column); 
            }
            //recursive - continue crawling, while staying in bounds of maze. 
            if(row < this.maze.length - 1) {
                this.crawl(row+1, column);
            }
            if(column < this.maze[row].length -1) {
                this.crawl(row, column + 1);
            }
            if(row > 0) {
                this.crawl(row-1,column);
            }
            if(column > 0) {
                this.crawl(row, column-1);
            }
        } 
        
    }

    this.findShortestPath = function(row, column) {
        var paths = []; // array to temporarily store possible paths
        if (this.maze[row][column] == 0) {
            // once start is found, set the number of steps. This means it has found shortest path from start to finish.
            this.numberOfSteps = mazePath.length; 
            return true; // end function
        }
        // first iteration, needs to check all 4 sides exist and are within the bounds of the maze, otherwise run into 'undefined' error on edges.
        if (this.maze[row][column] == 'B') { 
            this.end = {row: row, col: column}; // store this as the end on the object for front end manipulation if needed
            if (row > 0) {
                if (typeof(this.maze[row-1][column]) == 'number') {
                    paths.push({x: 0, y: -1});
                }
            }
            if (row < this.maze.length-1) {
                if (typeof(this.maze[row+1][column]) == 'number') {
                    paths.push({x: 0, y: 1});   
                }
            }
            if (column > 0) {
                if (typeof(this.maze[row][column-1]) == 'number') {
                paths.push({x: -1, y: 0});
                }
            }
            if (column < this.maze[row].length-1) {
                if (typeof(this.maze[row][column+1]) == 'number') {
                    paths.push({x: 1, y: 0});
                }
            }
            if (paths.length < 1) { //if on first iteration, no paths are added means the end has no surrounding numbers, therefore no solution.
                console.log("no solution");
                this.hasSolution = false; 
                return;
            }
        } else {
            mazePath.push({row: row, col: column}); // push current block into solution path

            // determine possible directions, store values in array for comparison.
            if (this.maze[row-1][column] < this.maze[row][column]) {
                paths.push({x: 0, y: -1});
            }
            if (this.maze[row+1][column] < this.maze[row][column]) {
                paths.push({x: 0, y: 1});
            }
            if (this.maze[row][column-1] < this.maze[row][column]) {
                paths.push({x: -1, y: 0});
            }
            if (this.maze[row][column+1] < this.maze[row][column]) {
                paths.push({x: 1, y: 0});
            }
        }  

        // set the next block to follow
        var newRow = row+paths[0].y;
        var newCol = column+paths[0].x;
        var shortPath = this.maze[row+paths[0].y][column+paths[0].x];

        //check if any other possible solutions are shorter distances than previously set, and override set values with the shortest distances.
        for (var i = 0; i < paths.length; i++) {
                if (this.maze[row+paths[i].y][column+paths[i].x] < shortPath) {
                    shortPath = this.maze[row+paths[i].y][column+paths[i].x]; // add shortest coordinate to path to follow shortest solution.
                    newRow = row+paths[i].y;
                    newCol = column+paths[i].x;
                }
        }
        //recursively start again with the shortest distance block, cannot go back to previous block since new block is a lower value. eventually will end on 0 (maze start)
        this.findShortestPath(newRow,newCol);
    }
}

function checkPrevDistance(maze, row, column) {
    var prevDist = [];
    // store each adjacent block to check if wall or open space.
    var w = maze[row][column-1];
    var n = maze[row+1][column];
    var s = maze[row-1][column];
    var e = maze[row][column+1];

    //check if each block is a number or not - if not a number, there was no previous shortest distance found yet.
    if (typeof(n) == 'number') {
        prevDist.push(n);
    }
    if (typeof(e) == 'number') {
        prevDist.push(e);
    }
    if (typeof(w) == 'number') {
        prevDist.push(w);
    }
    if (typeof(s) == 'number') {
        prevDist.push(s);
    }
    var lowDist = prevDist[0];
    // check each adjacent block for which has the lowest distance
    for(var i = 0; i < prevDist.length; i++) {
        if (prevDist[i] < lowDist) {
            lowDist = prevDist[i];
        }
    }
    dist = lowDist; // set dist to current distance traveled in order to override longer paths taken
    return lowDist+1; //return previous lowest distance to save to maze solution matrix, +1 to increment number of steps.
}


function indexOf2DArray(array, char) {
    for (var i = 0; i < array.length; i++) {
        for (var j = 0; j < array[i].length; j++) {
            if (array[i][j] == char) {
                return {row: i, col: j};
            }
        }
    }
    return false;
}

module.exports = router;