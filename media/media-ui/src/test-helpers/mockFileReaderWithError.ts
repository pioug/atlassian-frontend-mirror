import { fileReaderSpy } from './fileReader/fileReaderSpy';
import { MockFileReaderWithError } from './fileReader/MockFileReaderWithError';

export const mockFileReaderWithError = (): MockFileReaderWithError => {
	const fileReader = new MockFileReaderWithError();
	fileReaderSpy.mockImplementation(() => fileReader);
	return fileReader;
};
