import fs from 'node:fs';
import readLine from 'node:readline';

const fileName = 'day9.txt';
//const fileName = 'day9test.txt';
const seqs: number[][] = [];
let total = 0;

fs.readFileSync(fileName, 'utf8')
    .split(/\n/)
    .forEach((seq) => {
        seqs.push(seq.split(' ')
            .map((x) => {
                return Number(x);
            })
        );
    });

seqs.forEach(seq => {
    total += reduce(seq);
});
console.log(total);

function reduce(numbers: number[]): number {
    const _numbers: number[] = [];
    let sum = 0;

    for (let i = 1; i < numbers.length; i++) {
        const a = numbers[i - 1];
        const b = numbers[i];
        _numbers.push(b - a);
    }

    if (_numbers.filter(num => num != 0).length > 0) {
        sum = reduce(_numbers);
    }
    //Part 1
    //return numbers[numbers.length - 1] + sum;
    //Part 2
    return numbers[0] - sum;
}