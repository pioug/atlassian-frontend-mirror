import { fileReaderSpy } from './fileReader/fileReaderSpy';
import { MockFileReader } from './fileReader/MockFileReader';

export const mockFileReader = (result: string | null | ArrayBuffer): MockFileReader => {
	const fileReader = new MockFileReader(result);
	fileReaderSpy.mockImplementation(() => fileReader);
	return fileReader;
};
