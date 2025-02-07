import { createInterface } from 'readline/promises';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = async (query: string) => {
    const answer = await rl.question(query);
    return answer;
  };
  
  const clear = () => {
    process.stdout.write('\u001b[H\u001b[2J\u001b[3J');
  };


  export { question, clear };
