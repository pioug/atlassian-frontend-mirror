export const collectionCache = {};

export class CollectionFetcher {
	constructor() {}

	public getItems: jest.Mock<any, any, any> = jest.fn();
	public removeFile: jest.Mock<any, any, any> = jest.fn();
	public loadNextPage: jest.Mock<any, any, any> = jest.fn();
}
