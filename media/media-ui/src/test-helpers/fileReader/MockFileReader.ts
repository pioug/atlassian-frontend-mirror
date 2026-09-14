export class MockFileReader {
	loadEvent = (): void => {};
	errorEvent = (_: {}): void => {};
	result: string | null | ArrayBuffer;

	constructor(result: string | null | ArrayBuffer = 'mockResult') {
		this.result = result;
	}

	addEventListener: jest.Mock<any, any, any> = jest
		.fn()
		.mockImplementation((eventName: string, fn: () => void): void => {
			if (eventName === 'load') {
				this.loadEvent = fn;
			} else if (eventName === 'error') {
				this.errorEvent = fn;
			}
		});

	readAsDataURL: jest.Mock<any, any, any> = jest.fn().mockImplementation((): void => {
		this.loadEvent();
	});

	readAsArrayBuffer: jest.Mock<any, any, any> = jest.fn().mockImplementation((): void => {
		this.loadEvent();
	});
}
