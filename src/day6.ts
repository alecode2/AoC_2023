import fs from 'node:fs';

const file:string = fs.readFileSync('day6.txt').toString();
//const file:string = fs.readFileSync('day6test.txt').toString();
const races: {time: number, distance: number}[] = [];
//Part 1
/*
const input = file.split(/\s+/);

races.push({time: Number(input[0]), distance: Number(input[4])});
races.push({time: Number(input[1]), distance: Number(input[5])});
races.push({time: Number(input[2]), distance: Number(input[6])});
races.push({time: Number(input[3]), distance: Number(input[7])});

console.log(Part1());
*/
//Part 2
const input2 = file.split(/\n+/);
const time = Number(input2[0].trim().replace(/\s+/g, ''));
const distance = Number(input2[1].trim().replace(/\s+/g, ''));

console.log(Part2(time, distance));


//Finding the highest and lowest number that beats the race
function Part1(): number {
    let margin = 1

    for (let i = 0; i < races.length; i++) {
        const distance = races[i].distance;
        const time = races[i].time;

        let lowest;
        let highest;
        let hold = 0;
        let max = time;

        while (hold < time && (lowest == null || highest == null)) {
            hold++;
            max--;

            if (lowest == null && (hold * (time - hold) > distance)) {
                lowest = hold;
            }
            if (highest == null && (max * (time - max) > distance)) {
                highest = time - hold;
            }

        }

        margin *= highest + 1 - lowest;
    }

    return margin;
}

function Part2(time: number, distance: number): number {
    let lowest;
    let highest;
    let hold = 0;
    let max = time;

    while (hold < time) {
        hold++;
        max--;

        if (lowest == null && (hold * (time - hold) > distance)) {
            lowest = hold;
        }
        if (highest == null && (max * (time - max) > distance)) {
            highest = time - hold;
        }
    }
    console.log(highest, lowest);
    return highest + 1 - lowest;
}
