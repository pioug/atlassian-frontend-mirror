import getJest from './getJest';

const jestHelper = getJest();

class MockFileReader {
	loadEvent = () => {};
	errorEvent = (_: {}) => {};
	result: string | null | ArrayBuffer;

	constructor(result: string | null | ArrayBuffer = 'mockResult') {
		this.result = result;
	}

	addEventListener = jestHelper
		.fn()
		.mockImplementation((eventName: string, fn: () => void): void => {
			if (eventName === 'load') {
				this.loadEvent = fn;
			} else if (eventName === 'error') {
				this.errorEvent = fn;
			}
		});

	readAsDataURL = jestHelper.fn().mockImplementation((): void => {
		this.loadEvent();
	});

	readAsArrayBuffer = jestHelper.fn().mockImplementation((): void => {
		this.loadEvent();
	});
}

const mockFileReaderError = { message: 'error' };

class MockFileReaderWithError extends MockFileReader {
	readAsDataURL = jestHelper.fn().mockImplementation((): void => {
		this.errorEvent(mockFileReaderError);
	});
}

const GlobalFileReader = globalThis.FileReader;
let FileReader: any;
if (globalThis.FileReader && typeof jest !== 'undefined') {
	FileReader = jestHelper
		.spyOn(globalThis, 'FileReader')
		.mockImplementation(() => new GlobalFileReader());
}

const mockFileReader = (result: string | null | ArrayBuffer) => {
	const fileReader = new MockFileReader(result);
	FileReader.mockImplementation(() => fileReader);
	return fileReader;
};

const mockFileReaderWithError = () => {
	const fileReader = new MockFileReaderWithError();
	FileReader.mockImplementation(() => fileReader);
	return fileReader;
};

const unmockFileReader = () => FileReader.mockImplementation(() => new GlobalFileReader());

export { mockFileReader, mockFileReaderWithError, unmockFileReader, mockFileReaderError };
