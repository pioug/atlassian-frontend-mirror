import { mockFileReaderError } from '../mockFileReaderError';

import { MockFileReader } from './MockFileReader';

export class MockFileReaderWithError extends MockFileReader {
	readAsDataURL: jest.Mock<any, any, any> = jest.fn().mockImplementation((): void => {
		this.errorEvent(mockFileReaderError);
	});
}
