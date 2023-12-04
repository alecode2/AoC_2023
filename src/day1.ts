import fs from 'node:fs';
import readline from 'node:readline';

async function findCalibration() {
    const words: string[] = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
    let firstDigit: number;
    let lastDigit: number;
    let calibrationResult: number = 0;

    const fileStream = fs.createReadStream("day1.txt");
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });

    for await (const line of rl) {
        const array: string[] = line.split("");
        firstDigit = lastDigit = -1;

        for (let i = 0; i < array.length; i++) {
            let currentValue: number = -1;

            if (array[i].match(/[a-z]/i)) {
                let word: string = "";
                let j = i;

                while (!words.includes(word) && j < array.length) {
                    word += array[j];

                    if (words.includes(word)) {
                        currentValue = words.findIndex((element) => element == word);
                    } else {
                        j++;
                    }
                }

            } else {
                currentValue = Number(array[i]);
            }

            if (currentValue > -1) {
                if (firstDigit == -1) {
                    firstDigit = currentValue;
                }
                lastDigit = currentValue;
            }

        }
        calibrationResult += firstDigit * 10 + lastDigit;
    }

    console.log("Result: " + calibrationResult);
}


findCalibration();




