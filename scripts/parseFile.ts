import fs from 'fs';
const bigFile = fs.createReadStream('./bigFile.json', { flags: 'r', encoding: 'utf-8' });


