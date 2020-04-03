export const collectionCache = {};

export class CollectionFetcher {
  constructor() {}

  public getItems = jest.fn();
  public removeFile = jest.fn();
  public loadNextPage = jest.fn();
}
