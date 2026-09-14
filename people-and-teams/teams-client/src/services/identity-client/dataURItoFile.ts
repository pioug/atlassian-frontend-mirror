export function dataURItoFile(dataURI: string, filename = 'untitled'): Blob | File {
	if (dataURI.length === 0) {
		throw new Error('dataURI not found');
	}

	// convert base64/URLEncoded data component to raw binary data held in a string
	const byteString = dataURI.split(',')[0].includes('base64')
		? atob(dataURI.split(',')[1])
		: decodeURIComponent(dataURI.split(',')[1]);

	// separate out the mime component
	let mimeString: string;
	try {
		mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
	} catch (e) {
		mimeString = 'unknown';
	}

	// write the bytes of the string to a typed array
	const intArray = new Uint8Array(byteString.length);
	for (let i = 0; i < byteString.length; i++) {
		intArray[i] = byteString.charCodeAt(i);
	}

	const blob = new Blob([intArray], { type: mimeString });
	try {
		return new File([blob], filename, { type: mimeString });
	} catch (e) {
		// IE11 and Safari does not support the File constructor.
		return blob;
	}
}
