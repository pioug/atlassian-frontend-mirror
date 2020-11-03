/** Extracted into its own file so the mock variables can be instantiated before other imports in the test file that would otherwise be hoisted before it */
import { fakeMediaClient } from '@atlaskit/media-test-helpers';
export const mockMediaClient = fakeMediaClient();
jest.mock('@atlaskit/media-client', () => ({
  __esModule: true,
  getMediaClient: jest.fn(() => mockMediaClient),
}));
