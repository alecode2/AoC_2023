import fs from 'node:fs';
import readline, { Interface } from 'node:readline';

//const fileStream = fs.createReadStream('day7othertest.txt');
//const fileStream = fs.createReadStream('day7test.txt');
const fileStream = fs.createReadStream('day7.txt');
const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity});

const values: Array<string> = new Array('J','2','3','4','5','6','7','8','9','T','Q','K','A');
const lines: Map<string, number> = new Map<string, number>();
let hands: string[] = [];
let winnings: number = 0;

//Load data
for await(const line of rl) {
    const hand = line.split(/\s+/g);
    hands.push(hand[0]);
    lines.set(hand[0], Number(hand[1]));
}
//sort the list with compare hands
hands = hands.sort(compareHands);

for (let i = 0; i < hands.length; i++) {
    const hand = hands[i];
    winnings += lines.get(hand) * (i + 1);
    console.log(`hand: ${hand} wager: ${lines.get(hand)} position ${i + 1}`);
}
console.log(winnings);
//UTILS
function getHandType(hand:string): number {
    const map = new Map<string, number>();

    for (let i = 0; i < hand.length; i++) {
        const element = hand[i];
        if(map.has(element)) {
            map.set(element, map.get(element) + 1)
        } else {
            map.set(element, 1);
        }
    }
    /*
    Part 2
    We need to get J count from the map
    then we get the highest and lowest, we add Js to the highest
    */

    let ret = 0;
    let highest = 0;
    let second = 0;
    let jokers = map.get('J') || 0;

    for(let [key, value] of map) {
        if(key == 'J') {
            continue;
        }
        if(highest == null || highest < value) {
            if(highest < value) {
                second = highest;
            }
            highest = value;
            
        } else if (second == null || second < value) {
            second = value
        }
    }  
    //Part 2  
    //console.log(`${hand} highest:${highest} second:${second} jokers:${jokers}`);
    highest += jokers;

    if(highest == 3 && second == 2) {
        ret = 3.5;
    } else if(highest == 2 && second == 2) {
        ret = 2.5;
    } else {
        ret = highest;
    }

    return ret;
}

function compareHands(hand: string, other: string):number {

    if(getHandType(hand) > getHandType(other)){
        return 1;
    } else if(getHandType(hand) < getHandType(other)) {
        return -1;
    } 

    for (let i = 0; i < hand.length; i++) {
        const c_val = values.findIndex(card => card === hand[i]) + 1;
        const o_val = values.findIndex(ocard => ocard === other[i]) + 1;

        if(c_val > o_val) {
            return 1;
        } else if(c_val < o_val) {
            return -1;
        }
    }

    return 0;
}