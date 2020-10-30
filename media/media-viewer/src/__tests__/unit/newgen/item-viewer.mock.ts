/** Extracted into its own file so the mock variables can be instantiated before other imports in the test file that would otherwise be hoisted before it */
import { setViewerPayload, ImageViewer } from '../../mocks/_image-viewer';

const mockImageViewer = {
  ImageViewer,
};
jest.mock('../../../newgen/viewers/image', () => mockImageViewer);
jest.mock('unzipit', () => ({
  unzip: () => {
    return {
      archive: 'file',
      entries: { 'file_a.jpeg': { name: 'file_a.jpeg' } },
    };
  },
  HTTPRangeReader: () => 'reader',
}));

export { setViewerPayload };
