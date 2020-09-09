import * as Rusha from 'rusha';

import { Hasher } from './hasher';

export class SimpleHasher implements Hasher {
  hash(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsArrayBuffer(blob);

      reader.onload = () => {
        resolve(Rusha.createHash().update(reader.result).digest('hex'));
      };

      reader.onerror = reject;
    });
  }
}
