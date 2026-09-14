export function fileToDataURI(blob: Blob): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.addEventListener('load', () => {
			const result = reader.result;
			if (typeof result === 'string') {
				resolve(result);
			} else if (result === null) {
				reject();
			}
		});
		reader.addEventListener('error', reject);
		reader.readAsDataURL(blob);
	});
}
