import { type HashingFunction } from '../src/domain';

export const sha1Hasher: HashingFunction = (blob) => {
	function arrayBufferToHex(buffer: ArrayBuffer) {
		return Array.prototype.map
			.call(new Uint8Array(buffer), (x: number) => ('00' + x.toString(16)).slice(-2))
			.join('');
	}

	function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
		const fileReader = new FileReader();

		return new Promise<ArrayBuffer>((resolve, reject) => {
			fileReader.onload = function () {
				resolve(this.result as ArrayBuffer);
			};
			fileReader.onerror = reject;

			fileReader.readAsArrayBuffer(blob);
		});
	}

	return blobToArrayBuffer(blob)
		.then((arrayBuffer) => crypto.subtle.digest('SHA-1', arrayBuffer))
		.then(arrayBufferToHex);
};
