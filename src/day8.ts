import fs from 'node:fs';
import readline, { Interface } from 'node:readline';
import { start } from 'node:repl';

//const fileName = 'day8test.txt';
const fileName = 'day8.txt';
const file = fs.readFileSync(fileName, 'utf8');
const lines = file.split(/\r?\n/);

const nodes: Record<string, {name: string, left: string, right: string}> = {};
const sequence: string = lines[0];
let start_nodes: string[] = [];
let end_nodes = new Set<string>();

LoadNodes();
//Part 1
//console.log(Traverse());

//Part 2
/*
Because the specific input provided containst closed loops for all A to Z nodes we can measure the number of steps for each one of those loops
then we can use least common multiple and determine the number of steps. This solution is not general and the instructions provided suck
*/
const numbers: number[] = TraverseGhosts();
console.log(lcm(numbers));


function LoadNodes() {
    for (let i = 2; i < lines.length; i++) {

        let nodeName = lines[i].substring(0, 3);
        let leftNodeName = lines[i].substring(7, 10);
        let rightNodeName = lines[i].substring(12, 15);
        nodes[nodeName] = {
            name: nodeName,
            left: leftNodeName,
            right: rightNodeName,
        };

        if (nodeName.endsWith('A')) {
            start_nodes.push(nodeName);
        } else if(nodeName.endsWith('Z')) {
            end_nodes.add(nodeName);
        }
    }
}

function Traverse(): number {
    const end_node = 'ZZZ';
    let endFound = false;

    let moveCount = 0;
    let pointer = 0;
    
    let currentNode = 'AAA';
    
    while (!endFound) {
        const node = nodes[currentNode];
        const move = sequence[pointer];
        
        if (node.name === end_node) {
            endFound = true;
        } else {
            moveCount++;
            currentNode = move == 'L' ? node.left : node.right;
        }

        pointer = sequence.length == (pointer + 1) ? 0 : (pointer + 1); //Looping over the sequence
    }

    return moveCount;
}

//We traverse once with each ghost until we reach a Z node and we get the number of steps to reach said node once
function TraverseGhosts(): number[] {
    let moveCount = 0;
    let pointer = 0;
    const end_node_hits: number[] = [];

    while (end_nodes.size > 0) {
        const move = sequence[pointer];

        for (let i = 0; i < start_nodes.length; i++) {
            const node = nodes[start_nodes[i]];

            if(end_nodes.has(node.name)) {
                console.log(`end node:${node.name} start node:${start_nodes[i]} iteration:${moveCount}`);
                end_nodes.delete(node.name);
                end_node_hits.push(moveCount);
            }

            start_nodes[i] = move == 'L' ? node.left : node.right;
        }
        moveCount++;
        pointer = sequence.length == (pointer + 1) ? 0 : (pointer + 1); //Looping over the sequence  
    }

    return end_node_hits;
}

function lcm(arr: number[]): number {
  return arr.reduce((prev, n) => (prev * n) / gcd(prev, n));
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

