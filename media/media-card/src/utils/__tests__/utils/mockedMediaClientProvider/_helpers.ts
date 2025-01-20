export const normaliseInput = <T>(input?: T | T[]): T[] =>
	!input ? [] : input instanceof Array ? input : [input];

export const dataURItoBlob = (dataURI: string) => {
	const byteString = atob(dataURI.split(',')[1]);
	const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
	const ab = new ArrayBuffer(byteString.length);
	const ia = new Uint8Array(ab);
	for (let i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}
	const blob = new Blob([ab], { type: mimeString });
	return blob;
};
