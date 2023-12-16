import fs from 'node:fs';
import readLine from 'node:readline';

const north = ['|', '7', 'F'];
const south = ['|', 'J', 'L'];
const east = ['-', 'F', 'L'];
const west = ['-', '7', 'J'];

const fileName = 'day10.txt';
//const fileName = 'day10test.txt';
const tiles: string[][] = [];

//Load file
fs.readFileSync(fileName, 'utf8')
    .split(/\n/)
    .forEach((line) => {
        tiles.push(line.trim().split(''));
    });

let start: { height: number; width: number; } = findStart(tiles);

const stacks = runThrough();
//Part 1
console.log(`Part 1: ${stacks.f_stack.length - 1}`);

//Part 2
//We remove the first element as it is repeated
stacks.f_stack.shift();
//Fix the starting tile, its too boring to do programatically
tiles[128][36] = 'F';
console.log(`Part 2: ${findEmptyTiles(tiles, stacks.f_stack.concat(stacks.s_stack))}`);

//Testing
//start = { height: 1, width: 9 };
//console.log(findDirections(tiles, start.height, start.width));

function runThrough() {
    const f_stack = [];
    const s_stack = [];
    let furthest = false;

    f_stack.push(start);
    s_stack.push(start);

    let positions = findDirections(tiles, start.height, start.width);
    let f_position = positions[0];
    let s_position = positions[1];

    while (!furthest) {
        f_stack.push(f_position);
        s_stack.push(s_position);

        if ((f_position == null || s_position == null) || f_position.height == s_position.height && f_position.width == s_position.width) {
            break;
        }

        f_position = findDirections(tiles, f_position.height, f_position.width)
            .filter((pos) => !f_stack.includes(
                f_stack.find(e => e.height === pos.height && e.width === pos.width)
            ))[0];
        s_position = findDirections(tiles, s_position.height, s_position.width)
            .filter((pos) => !s_stack.includes(
                s_stack.find(e => e.height === pos.height && e.width === pos.width)
            ))[0];

    }

    return { f_stack, s_stack };
}

function findStart(grid: string[][]): { height: number, width: number; } {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] == 'S') {
                return { height: i, width: j };
            }
        }
    }
}
//Because we know its a perfect loop there are only 2 valid directions for each given tile
function findDirections(grid: string[][], h: number, w: number) {
    const positions: { height: number; width: number; }[] = [];

    const inBounds = (y, x) => {
        return (y >= 0 && y < grid.length && x >= 0 && x < grid[0].length);
    };

    const checkDirection = (y, x, h, w, arr_from, arr_to) => {
        return inBounds(y, x) && (grid[y][x] == 'S' || arr_from.includes(grid[y][x])) && arr_to.includes(grid[h][w]);
    };

    //We check north, south, east and west
    if (checkDirection(h, w, h - 1, w, south, north)) {
        positions.push({ height: h - 1, width: w });
    }
    if (checkDirection(h, w, h + 1, w, north, south)) {
        positions.push({ height: h + 1, width: w });
    }
    if (checkDirection(h, w, h, w - 1, west, east)) {
        positions.push({ height: h, width: w - 1 });
    }
    if (checkDirection(h, w, h, w + 1, east, west)) {
        positions.push({ height: h, width: w + 1 });
    }
    return positions;
}

//Part 2
/*
    We scan line by line, when we find a char that delimits the loop we activate a flag, count all empty space
    and when another is reached we revert the flag.

    If we only take into account north corners then we dont need to check for the opposing corners on u turns
*/
function findEmptyTiles(grid: string[][], loop: { height: number, width: number; }[]) {
    const validChars = ['|', 'F', '7'];
    let emptyTiles = 0;

    for (let h = 0; h < grid.length; h++) {
        let inside = false;

        for (let w = 0; w < grid[h].length; w++) {
            const char = grid[h][w];
            const inLoop = loop.includes(loop.find(e => e.height == h && e.width == w));

            if (validChars.includes(char) && inLoop) {
                inside = !inside;
            } else if (inside && !inLoop) {
                emptyTiles++;
            }
        }
    }

    return emptyTiles;
}