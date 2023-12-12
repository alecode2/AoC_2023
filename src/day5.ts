import fs from 'node:fs';
import readline, { Interface } from 'node:readline';

const seeds: Array<number> = new Array<number>();
const seeds_tuples: {start: number, end: number}[] = new Array<{start: number, end: number}>();
const almanac: AlmanacEntry[][] = new Array<AlmanacEntry[]>(); 

//Function Calls
//await loadAlmanac('day5test.txt');
await loadAlmanac('day5.txt');
//part1();
part2();
    
function part1() {
    const locations: number[] = [];

    seeds.forEach(seed => {
        locations.push(findLocationFromSeed(seed))
    });

    locations.sort();

    console.log(locations[0]);
}

function part2() {
    let location_ranges: {start: number, end: number}[] = [];
    
    seeds_tuples.forEach((seed_tuple) =>{
        const locations = findLocationsFromSeedRange(seed_tuple);
        location_ranges.push(...locations);
    });
    

    //Sort by location number ascending
    location_ranges.sort((a, b) => {
        if(a.start < b.start) return -1;
        if(a.start > b.start) return  1;
        return 0;
    });

    console.log(location_ranges[0]);
}

//Functions
//Part 1
function findLocationFromSeed(seed: number):number {

    const convert = (seed: number, table: AlmanacEntry[]) => {
        let res = seed;

        for (let i = 0; i < table.length; i++) {
            const entry = table[i];

            if(seed >= entry.src_start && seed <= entry.src_end) {
                res = seed - entry.src_start + entry.res_start;
                break;
            }
        }
        return res;
    }

    almanac.forEach((table) =>{
        seed = convert(seed, table);
    });

    return seed;
}

//Part 2
function findLocationsFromSeedRange(seedtuple: {start: number, end: number}):{start: number, end: number}[] {

    let result = new Array<{start: number; end: number;}>;
    result.push(seedtuple);

    const applyConversion = (table: AlmanacEntry[], tuples: { start: number; end: number; }[]) => {
        const _tuples: { start: number; end: number; }[] = tuples;
        const res: { start: number; end: number; }[] = new Array();

        while(_tuples.length > 0) {
            const tuple = _tuples.pop();
            let start = tuple.start;
            let end = tuple.end;

            let inRange:boolean = false;

            for (let j = 0; j < table.length; j++) {
                const entry = table[j];
                let res_start = entry.res_start;
                let src_start = entry.src_start;
                
                const o_start = Math.max(start, src_start);
                const o_end = Math.min(end, entry.src_end);

                if(o_start < o_end) {
                    res.push({ 
                        start: o_start - src_start + res_start, 
                        end: o_end - src_start + res_start
                    });
                    
                    if(o_start > start) {
                        _tuples.push({ start: start, end: o_start});
                    }
                    
                    if(end > o_end) {
                        _tuples.push({ start: o_end, end: end});
                    }

                    inRange = true;
                    break;
                }
            }
            if(!inRange) {
                res.push({ start: start, end: end});
            }

        }
        return res;
    }

    almanac.forEach((table) => {
        result = applyConversion(table, result);
    });
    

    return result;
}

//Utils
async function loadAlmanac(fileName: string) {
    const fileStream = fs.createReadStream(fileName);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });

    let almanacSection: Array<AlmanacEntry> = new Array<AlmanacEntry>;

    for await (const line of rl) {
        
        if(line.startsWith('seeds: ')) {
            const _seeds = line.slice(7).split(/\s+/);

            //Part 1
            for (let i = 0; i < _seeds.length; i++) {
                seeds.push(Number(_seeds[i]));
            }

            //Part 2
            for (let i = 0; i < _seeds.length; i += 2) {
                seeds_tuples.push({start: Number(_seeds[i]), end: Number(_seeds[i]) + Number(_seeds[i+1])});
            }

        } else if(line.endsWith('map:') ) {
            if(almanacSection.length > 0) {
                almanac.push(almanacSection);
            }

            almanacSection = new Array<AlmanacEntry>;

        } else if(line.match(/[0-9]/i)) {
            const values = line.trim().split(' ');

            let entry = { 
                src_start:Number(values[1]),
                src_end: Number(values[1])+ Number(values[2]) - 1,
                res_start: Number(values[0]), 
                res_end: Number(values[0]) + Number(values[2]) -1,
            };

            almanacSection.push(entry);
        }
    }

    if(almanacSection.length > 0) {
        almanac.push(almanacSection);
    }

}

interface AlmanacEntry {
    src_start: number, 
    src_end: number, 
    res_start: number, 
    res_end: number
}