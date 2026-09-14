export function fileToArrayBuffer(file: File): Promise<Uint8Array> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.addEventListener('load', () => {
			const array = new Uint8Array(reader.result as ArrayBuffer);
			resolve(array);
		});
		reader.addEventListener('error', reject);
		reader.readAsArrayBuffer(file);
	});
}
