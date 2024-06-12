import { renameForwardedRefToRef } from './migrates/rename-forwarded-ref-to-ref';
import { createTransformer } from './utils';

const transformer = createTransformer('@atlaskit/textarea', [renameForwardedRefToRef]);

export default transformer;
