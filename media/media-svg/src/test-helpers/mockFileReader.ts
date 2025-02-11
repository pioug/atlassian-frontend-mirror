const originalFileReader = global.FileReader;

const unMockFileReader = () => {
	Object.defineProperty(global, 'FileReader', {
		writable: true,
		value: originalFileReader,
	});
};

const mockFileReader = (e: Error) => {
	const fileReader = {
		onerror: (_: Error) => {},
		readAsDataURL: () => {
			fileReader.onerror(e);
			unMockFileReader();
		},
	};
	Object.defineProperty(global, 'FileReader', {
		writable: true,
		value: jest.fn().mockImplementation(() => fileReader),
	});
};

export const failDataURIConversionOnce = (e: Error) => {
	mockFileReader(e);
};
