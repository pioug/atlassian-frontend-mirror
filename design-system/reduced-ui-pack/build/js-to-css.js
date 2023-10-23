import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import makeDir from 'mkdirp';
import styleSheet from '../src';

const writeFile = promisify(fs.writeFile);
const SRC = path.join(__dirname, '..', 'src');

async function buildReducedUIPack() {
  try {
    makeDir.sync(SRC);
    await writeFile(path.join(SRC, 'bundle.css'), styleSheet);
  } catch (err) {
    console.error(`Failed to build reduced-ui-pack due to ${err}`);
  }
}

buildReducedUIPack().then(() => {
  console.log('successfully build reduced-ui-pack');
});
