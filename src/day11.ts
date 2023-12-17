import fs from 'node:fs';

const fileName = 'day11.txt';
//const fileName = 'day11test.txt';
let grid: string[][] = [];
let galaxies: { y: number, x: number; }[] = [];

//Load file
fs.readFileSync(fileName, 'utf8')
    .split(/\n/)
    .forEach((line) => {
        grid.push(line.trim().split(''));
    });

grid = expandUniverse(grid);
galaxies = getGalaxies(grid);
//console.log(galaxies);
console.log(getSumOfDistances(galaxies));

function expandUniverse(grid: string[][]): string[][] {
    //Horizontal expansion
    for (let i = 0; i < grid[0].length; i++) {
        const column = [];

        for (let j = 0; j < grid.length; j++) {
            column.push(grid[j][i]);
        }

        if (!column.includes('#')) {

            for (let k = 0; k < grid.length; k++) {
                grid[k].splice(i, 0, '.');
            }
        }
        i++;
    }

    //Vertical expansion
    for (let i = 0; i < grid.length; i++) {
        const row = grid[i];
        if (!row.includes('#')) {
            grid.splice(i, 0, row);
            i++;
        }
    }

    return grid;
}

function getGalaxies(grid: string[][]): { x: number, y: number; }[] {
    const galaxies: { x: number, y: number; }[] = [];

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] == '#') {
                galaxies.push({ x: j, y: i });
            }
        }
    }

    return galaxies;
}

function getDistanceBetweenGalaxies(g_from: { x: number, y: number; }, g_to: { x: number, y: number; }): number {
    return Math.abs(g_to.y - g_from.y) + Math.abs(g_to.x - g_from.x);
}

function getSumOfDistances(galaxies: { x: number, y: number; }[]): number {
    let total = 0;

    for (let i = 0; i < galaxies.length; i++) {
        for (let j = i + 1; j < galaxies.length; j++) {
            total += getDistanceBetweenGalaxies(galaxies[i], galaxies[j]);
        }
    }

    return total;
}