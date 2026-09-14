/** Extracted into its own file so the mock variables can be instantiated before other imports in the test file that would otherwise be hoisted before it */
import type { MediaClient } from '@atlaskit/media-client';
import { createMediaStore } from '@atlaskit/media-state/create-media-store';
import type { MediaStore } from '@atlaskit/media-state/media-store';
import { fakeMediaClient } from '@atlaskit/media-test-helpers';

export const mockMediaClient: MediaClient = fakeMediaClient();

// `fakeMediaClient()` auto-mocks `@atlaskit/media-client`, so `__DO_NOT_USE__getMediaStore()`
// returns `undefined`. `<FileCard>` (rendered by these tests) calls `useFileState` -> `useMediaStore`,
// which does `useStore(store)` and would throw on the missing store. Provide a real media store so
// the store-backed hooks work.
const mediaStore: MediaStore = createMediaStore();
mockMediaClient.__DO_NOT_USE__getMediaStore = () => mediaStore;

// `getMediaClient` is exposed as its own `/get-media-client` entry point; mock that entry point so
// consumers resolving a client through it receive the fake client.
jest.mock('@atlaskit/media-client-react/get-media-client', () => ({
	...jest.requireActual('@atlaskit/media-client-react/get-media-client'),
	__esModule: true,
	getMediaClient: jest.fn(() => mockMediaClient),
}));
