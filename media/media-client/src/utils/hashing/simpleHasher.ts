import * as Rusha from 'rusha';
import { fg } from '@atlaskit/platform-feature-flags';
import { type Hasher } from './hasher';
import { toFileReaderError } from './fileReaderError';

export class SimpleHasher implements Hasher {
	hash(blob: Blob): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();

			reader.readAsArrayBuffer(blob);
			reader.onload = () => {
				resolve(
					Rusha.createHash()
						.update(reader.result ?? '')
						.digest('hex'),
				);
			};
			reader.onerror = (event) => {
				if (fg('platform_media_filereader_error_surfacing')) {
					reject(toFileReaderError(reader.error));
				} else {
					reject(event);
				}
			};
		});
	}
}
