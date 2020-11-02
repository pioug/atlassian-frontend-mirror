import { renameForwardedRefToRef } from './migrates/rename-forwardedRef-to-ref';
import { createTransformer } from './utils';

const transformer = createTransformer('@atlaskit/textarea', [
  renameForwardedRefToRef,
]);

export default transformer;
