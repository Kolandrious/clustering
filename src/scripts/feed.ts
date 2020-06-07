import mongoose from 'mongoose';
import feed from '../../feed';
import { connectMongo } from '../utils';

(async () => {
  try {
    let [inputAmount, inputChunkSize] = process.argv.slice(2);
    let amount: number, chunkSize: number;

    if (!inputAmount) amount = 100;
    else amount = Math.floor(+inputAmount);
    if (!inputChunkSize) chunkSize = amount / 20;
    else chunkSize = +inputChunkSize;
    chunkSize = Math.ceil(chunkSize);
    if (chunkSize > 50000) chunkSize = 50000;
    console.log('\x1b[32m', `amount ${amount}`, '\x1b[0m');
    console.log('\x1b[32m', `chunkSize ${chunkSize}`, '\x1b[0m');

    connectMongo().then(async (url) => {
      console.log('\x1b[32m', `${url} feedDb connected`, '\x1b[0m');
      await feed(amount, chunkSize);
      mongoose.disconnect();
      console.log('\x1b[32m', `${url} feedDb disconnected`, '\x1b[0m');
      process.exit(0);
    });
  } catch(err) {
    console.error(err);
    process.exit(1);
  }
})();
