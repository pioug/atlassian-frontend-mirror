import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import makeDir from 'mkdirp';
import styleSheet from '../src/styles';

const writeFile = promisify(fs.writeFile);
const distFolder = path.join(__dirname, '..', 'dist');

async function buildCSS() {
  try {
    makeDir.sync(distFolder);
    await writeFile(path.join(distFolder, 'bundle.css'), styleSheet);
  } catch (err) {
    console.error(`Failed to build email-renderer CSS due to ${err}`);
  }
}

buildCSS().then(() => {
  console.log('successfully build email-renderer CSS');
});
