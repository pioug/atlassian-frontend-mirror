import { sha256 } from 'js-sha256';

import { fg } from '@atlaskit/platform-feature-flags/fg';

import { toFileReaderError } from './fileReaderError';
import { type Hasher } from './hasher';

export class SimpleHasher implements Hasher {
	hash(blob: Blob): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();

			reader.readAsArrayBuffer(blob);
			reader.onload = () => {
				resolve(
					`sha256-${sha256
						.create()
						.update(reader.result ?? '')
						.hex()}`,
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
