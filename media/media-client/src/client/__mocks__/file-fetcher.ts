export class FileFetcher {
  constructor() {}

  public getFileState = jest.fn();

  public getCurrentState = jest.fn();

  public getArtifactURL = jest.fn();

  public touchFiles = jest.fn();

  public upload = jest.fn();

  public downloadBinary = jest.fn();
}
