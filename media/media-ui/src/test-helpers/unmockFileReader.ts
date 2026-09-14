import { fileReaderSpy } from './fileReader/fileReaderSpy';
import { GlobalFileReader } from './fileReader/globalFileReader';

export const unmockFileReader = (): any =>
	fileReaderSpy.mockImplementation(() => new GlobalFileReader());
