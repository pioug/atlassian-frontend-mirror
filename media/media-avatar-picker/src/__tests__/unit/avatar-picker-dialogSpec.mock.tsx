/** Extracted into its own file so the mock variables can be instantiated before other imports in the test file that would otherwise be hoisted before it */
export const mockFileFromDataURI = new File([], 'some-file-name');

jest.mock('@atlaskit/media-ui', () => ({
  ...jest.requireActual<Object>('@atlaskit/media-ui'),
  dataURItoFile: jest.fn(() => mockFileFromDataURI),
}));
