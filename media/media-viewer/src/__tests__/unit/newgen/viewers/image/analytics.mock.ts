/** Extracted into its own file so the mock variables can be instantiated before other imports in the test file that would otherwise be hoisted before it */
import {
  setHasError as setInteractiveImgHasError,
  InteractiveImg,
} from '../../../../mocks/_interactive-img';

const mockInteractiveImg = {
  InteractiveImg,
};
jest.mock(
  '../../../../../viewers/image/interactive-img',
  () => mockInteractiveImg,
);

export { setInteractiveImgHasError };
