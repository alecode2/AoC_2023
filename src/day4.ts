/*
 The steps to follow are similar to day 2

 We get each line, we trim the beggining "Card "
 we split by spaces, we get the first number while removing the ":"
 we add numbers to dictionary with a 0
 when we reach the "|" we stop adding to the dict and start
 checking against the dictionary. Adding to the value for each hit
 
 after we process the line we multiply by 2 for each hit
 (First hit must add a 1, we can do Math.max(current, 1))

 we add the result to the totalPoints
*/

//Imports
import fs from 'node:fs';
import readline from 'node:readline';

//Function calls
console.log(await getTotalPoints("day4test.txt"));
console.log(await getTotalPoints("day4.txt"));


async function getTotalPoints(fileName: string): Promise<number> {
    const fileStream = fs.createReadStream(fileName);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });

    const cardsArray = new Array<Card>();
    let totalPoints: number = 0;
    let totalCards: number = 0;

    for await (const line of rl) {
        //Trim the beggining and split by any number of whitespace characters
        const lineArray = line.slice(5).split(/\s+/);

        //flag for changing from winners to scratched numbers
        let scratched: boolean = false;

        let card: Card = { id: 0, winners: new Map<number, number>(), points: 0, copies: 1 };

        //Get Game id
        card.id = Number(lineArray.shift().replace(":", ""));

        lineArray.forEach(element => {
            const _element = Number(element);
            if (element == '|') {
                scratched = true;
            } else if (!scratched) {
                card.winners.set(_element, 0);
            } else if (card.winners.has(_element)) {
                card.winners.set(_element, card.winners.get(_element) + 1)
            }
        });

        card.winners.forEach((value, key) => {
            if (value > 0) {
                //Part 1
                //card.points = Math.max(card.points, .5) * 2;

                //Part 2
                card.points++;
            }
        });
        cardsArray.push(card);
    }

    for (let i = 0; i < cardsArray.length; i++) {
        const card = cardsArray[i];

        //Part 1
        //totalPoints += card.points;

        //Part 2
        let j: number = i + 1;
        let copies: number = card.points;

        while (j < cardsArray.length && copies > 0) {
            cardsArray[j].copies += card.copies;
            j++;
            copies--;
        }
    }
    //Part 1
    //return totalPoints;

    //Part 2
    cardsArray.forEach((_card) => {
        totalCards += _card.copies;
    })

    return totalCards;
}

interface Card {
    id: Number,
    winners: Map<number, number>,
    points: number
    copies: number
}