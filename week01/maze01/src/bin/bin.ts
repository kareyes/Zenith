
import readline from 'readline';
import { select, input } from '@inquirer/prompts';

async function main() {
  const players = [{
    name: 'player1',
    type: 1
  }, {
    name: 'player2',
    type: 2
  }];

  // Inquirer block
  const player = await select({
    message: 'Choose a player',
    choices: players.map(player => player.name),
  });

  console.log(player);
  // End inquirer block

  // readline.emitKeypressEvents(process.stdin);
  // process.stdin.setRawMode(true);

  // process.stdin.on('keypress', (ch, key) => {
  //   if (key.ctrl && key.name === 'c') process.exit();
  //   console.log(key);
  // });
  const readline = require('readline')
  readline.emitKeypressEvents(process.stdin)
  process.stdin.setRawMode(true)
  process.stdin.resume()
  process.stdin.on('keypress', (str, key) => {
    if (str === '\u0003') {
      process.exit()
    }
    console.log(key)
  })
}

main();
// setInterval(() => console.log('tick'), 20000);