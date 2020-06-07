import mongoose from 'mongoose';
import knn from 'rbush-knn';
import {
  connectMongo,
  RBush,
} from '../utils';
import { Points, IPoint } from '../models';

interface ICluster {
  type: 'Point',
  coordinates: number[],
  includes: string[],
  length: number,
}

const getRandomPoint = (tree: RBush) => {
  const digChildren = (data: { children?: any[] }): any => (
    data.children
      && data.children.length
      && data.children[0]
      ? digChildren(data.children[0])
      : data
  );

  const found: IPoint = digChildren(tree.data);
  console.log({ found });
  return found;
};

export const clusterize = async (radius: number) => {
  const clusters: ICluster[] = [];
  const LEAF_SIZE = 5;
  console.time('fetching items');
  const points = await Points.find();
  console.log(points);
  console.timeEnd('fetching items');

  console.time('indexing');
  const index = new RBush(LEAF_SIZE);
  index.load(points);
  console.timeEnd('indexing');

  const processPoints = (tree: RBush) => {
    const selectedPoint = getRandomPoint(tree);
    console.log({ selectedPoint });
    const knnPoints: IPoint[] = knn(tree, selectedPoint.coordinates[0], selectedPoint.coordinates[1], Infinity, undefined, radius);
    const cluster: ICluster = {
      type: 'Point',
      coordinates: selectedPoint.coordinates,
      includes: knnPoints.map((point: IPoint) => point._id),
      length: knnPoints.length,
    };
    clusters.push(cluster);
    // console.log({ cluster });
    knnPoints.forEach((point: IPoint) => tree.remove(point));
    processPoints(tree);
  };
  processPoints(index);

  console.log({ clusters });
}

(async () => {
  try {
    connectMongo().then(async (url) => {
      console.log('\x1b[32m', `${url} clusterize connected`, '\x1b[0m');
      let radius: string | number = process.argv.slice(2)[0];
      if (!radius) radius = 30;
      radius = +radius;
      await clusterize(radius);
      mongoose.disconnect();
      console.log('\x1b[32m', `${url} clusterize disconnected`, '\x1b[0m');
      process.exit(0);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
