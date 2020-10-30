/** Extracted into its own file so the mock variables can be instantiated before other imports in the test file that would otherwise be hoisted before it */
jest.mock('../../util', () => ({
  ...jest.requireActual<Object>('../../util'),
  fileSizeMb: jest.fn().mockReturnValue(11),
}));

jest.mock('@atlaskit/media-ui', () => ({
  ...jest.requireActual<Object>('@atlaskit/media-ui'),
  fileToDataURI: jest.fn(() => mockFileToDataURIPromise),
  getOrientation: jest.fn(() => mockGetOrientationPromise),
}));

export const mockFileToDataURIPromise = Promise.resolve('some-data-uri');
export const mockGetOrientationPromise = Promise.resolve(7);
