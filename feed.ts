import { Points } from './src/models';

export const generatePoint = (_id?: string | number) => {
  const random1 = Math.random();
  const negative1 = Math.random() > 0.5;
  const lat = ((negative1 ? -random1 : random1) * 85).toFixed(6);
  const random2 = Math.random();
  const negative2 = Math.random() > 0.5;
  const long = ((negative2 ? -random2 : random2) * 180).toFixed(6);

  return {
    type: 'Point',
    coordinates: [+long, +lat],
  };
};

const createPointsChunk = (chunkSise: number) => {
  const result = [];
  for (let i = 0; i < chunkSise; i++) {
    result.push(generatePoint())
  }
  return result;
}

export default async (amount: number, chunkSize = amount / 20) => {
  if (!amount || amount < 0) throw new Error('amount should be more than 0');
  if (chunkSize > amount) throw new Error("chunkSize can't be higher than total amount of points");
  console.log('feeding DB');
  try {
    for (let i = 0; i < amount; i += chunkSize) {
      const points = createPointsChunk(chunkSize);
      await Points.collection.insertMany(points);
      console.log(`${i + chunkSize}`.padStart(`${amount}`.length) + ' inserted');
    }
    console.log('\x1b[32m', `Fed DB!`, '\x1b[0m');
  } catch (err) {
    console.log(err);
  }
};
