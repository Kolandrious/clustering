import fs from 'fs';
import { v4 as uuid } from 'uuid';
const file = fs.createWriteStream('./bigFile.json');

const getRow = () => {
  const random1 = Math.random();
  const lat = ((random1 <= 0.5 ? -random1 : random1) * 90).toFixed(6);
  const random2 = Math.random();
  const long = ((random2 <= 0.5 ? -random2 : random2) * 180).toFixed(6);
  return `{ "lat": ${lat}, "long": ${long}, "id": "${uuid()}"}`;
};

file.write(`{\n  "points": [\n    ${getRow()}`);
for (let i = 0; i <= 1e4; i++) {
  file.write(`,\n    ${getRow()}`);
}
file.write(`\n  ]\n}`);

file.close();
file.end();