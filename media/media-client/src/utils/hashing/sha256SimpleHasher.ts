import { sha256 } from 'js-sha256';
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
