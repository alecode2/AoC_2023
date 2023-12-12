/*
We need to parse all games by line, each line has a series of values separated by semicolon.
we need to get the max of each of the three colors from all the semicolon ranges.

we can perform operation on each line like this:
    We get the number before the :
    Then we split by character and run it one by one
        if we find a number we store it in a variable
        when we find the letters we store them into a variable until we get a word match
        when we get a word match we check in the dictionary if the stored number is higher or lower than the stated.
        If new value is higher we store the new value in that dictionary address
    We can add that dictionary to the list of dictionaries (I will use objects instead)

    Once we get a list of all the games with max cubes for each color we can run them against the threshold and
    find which games are valid. Then we tally the sum of ids of said games.


    Tasks:
    Create an object with the 4 fields
        id
        red
        green
        blue
    Get the values for each tag from a game round
    Tally the highest values of each one in a game
    Evaluate the tallied games against the criteria
    Add up the ids of the valid games
*/
import fs from 'node:fs';
import readline from 'node:readline';

//Function calls
//console.log(await ValidateGameResults("day2test.txt"));
console.log(await ValidateGameResults("day2.txt"));


//Functions
async function ValidateGameResults(fileName: string): Promise<Number> {
    const fileStream = fs.createReadStream(fileName);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });

    let games:GameInfo[] = new Array<GameInfo>(); 
    let validGamesSum: number = 0;

    for await (let line of rl) { 
        const regex = new RegExp('[,:;]', 'g');
        const subst = ` $&`;
        let lastToken: string;
        let game: GameInfo = { id: 0, red: 0, green: 0, blue: 0};
        let r:number, g: number, b: number; 
        r = g = b = 0;
        
        const array: string[] = line.concat(";").replace(regex, subst).split(" ");

        array.forEach((token) => {
            if (token == "Game" || token == ":" || token == ",") {
                //Do nothing                
            } else if(token == ";") {
                //Part 1
                game.red = Math.max(r, game.red);
                game.green = Math.max(g, game.green);
                game.blue = Math.max(b, game.blue);
                r = g = b = 0;
            } else if(token == "red") {
                r += Number(lastToken);
            } else if(token == "green") {
                g += Number(lastToken);
            } else if(token == "blue") {
                b += Number(lastToken);
            } else if(lastToken == "Game") {
                game.id = Number(token);
            }
            //Store lastToken for next iteration
            lastToken = token;            
        });

        games.push(game);
    }
    
    games.forEach((game) => {
        //Part 1
        /*
        if(game.red <= 12 && game.green <= 13 && game.blue <= 14) {
            validGamesSum += game.id;
        }
        */
        //Part 2
        validGamesSum += game.red * game.green * game.blue;

    });

    return validGamesSum;
}

interface GameInfo {
    id: number;
    red: number;
    green: number;
    blue: number;
}



