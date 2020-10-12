import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import makeDir from 'mkdirp';
import styleSheet from '../src';

const writeFile = promisify(fs.writeFile);
const DIST = path.join(__dirname, '..', 'dist');

async function buildCSSReset() {
  try {
    makeDir.sync(DIST);
    await writeFile(path.join(DIST, 'bundle.css'), styleSheet);
  } catch (err) {
    console.error(`Failed to build css-reset due to ${err}`);
  }
}

buildCSSReset().then(() => {
  console.log('successfully build css-reset');
});
