import mongoose from 'mongoose';
// import { PerformanceObserver, performance } from 'perf_hooks';
import KDBush from 'kdbush';
import geoKDBush from 'geokdbush';
import { Points } from '../src/models';
import { connectMongo } from '../src/utils';
import { generatePoint } from '../feed';

// const obs = new PerformanceObserver((items) => {
//   console.log(items.getEntries()[0].duration);
//   performance.clearMarks();
// });
// obs.observe({ entryTypes: ['measure'] });
// performance.measure('Start to Now');

const benchmark = async (repeatsNumber: number, radius: number) => {
  let number = 0;
  for (let i = 0; i < repeatsNumber; i++) {
    const points = await Points.aggregate.near({
      near: generatePoint(),
      distanceField: 'distance',
      spherical: true,
      maxDistance: +radius,
    });
    number = points.length;
  }
  return number;
}

const benchmark2 = async (repeatsNumber: number, radius: number) => {
  let number = 0;

  console.time('fetching items');
  const points = await Points.find();
  console.timeEnd('fetching items');

  console.time('indexing');
  const index = new KDBush(points, (p: any) => p.coordinates[0], (p: any) => p.coordinates[1], 64, Float64Array);
  console.timeEnd('indexing');

  console.time('finding');
  for (let i = 0; i < repeatsNumber; i++) {
    const randomPoint = generatePoint();
    const points = geoKDBush.around(
      index,
      randomPoint.coordinates[0],
      randomPoint.coordinates[1],
      Infinity,
      radius,
    );
    number = points.length;
  }
  console.timeEnd('finding');
  return number;
}

(async () => {
  try {
    const [inputRepeats, inputRadius] = process.argv.slice(2);
    let repeatsNumber: number, radius: number;

    if (!inputRepeats) repeatsNumber = 500;
    else repeatsNumber = Math.floor(+inputRepeats);

    if (!inputRadius) radius = 500;
    else radius = Math.floor(+inputRadius);

    console.log('\x1b[32m', `repeatsNumber ${repeatsNumber}`, '\x1b[0m');
    console.log('\x1b[32m', `radius ${radius}km`, '\x1b[0m');

    connectMongo().then(async (url) => {
      console.log('\x1b[32m', `${url} benchmark connected`, '\x1b[0m');

      // console.time('total');
      // const found = await benchmark(repeatsNumber, radius * 1000);
      // console.timeEnd('total')
      // console.log(found + ' items');

      console.time('total');
      const found2 = await benchmark2(repeatsNumber, radius);
      console.timeEnd('total')
      console.log(found2 + ' items');

      mongoose.disconnect();
      console.log('\x1b[32m', `${url} benchmark disconnected`, '\x1b[0m');
      process.exit(0);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
