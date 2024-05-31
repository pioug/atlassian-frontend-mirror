import { renameUnsafeCardProp } from './migrates/rename-unsafe-cards-prop';
import { createTransformer } from './utils';

const transformer = createTransformer('@atlaskit/editor-core', [renameUnsafeCardProp]);

export default transformer;
