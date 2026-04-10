export class FileFetcher {
	constructor() {}

	public getFileState: jest.Mock<any, any, any> = jest.fn();

	public getCurrentState: jest.Mock<any, any, any> = jest.fn();

	public getArtifactURL: jest.Mock<any, any, any> = jest.fn();

	public touchFiles: jest.Mock<any, any, any> = jest.fn();

	public upload: jest.Mock<any, any, any> = jest.fn();

	public downloadBinary: jest.Mock<any, any, any> = jest.fn();
}
