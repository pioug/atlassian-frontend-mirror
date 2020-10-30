/** Extracted into its own file so the mock variables can be instantiated before other imports in the test file that would otherwise be hoisted before it */
import { mockIsWebGLNotAvailable } from '@atlaskit/media-test-helpers';

mockIsWebGLNotAvailable(); // mock WebGL fail check before StatelessUploadView is imported
