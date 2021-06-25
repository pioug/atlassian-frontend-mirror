import { createTransformer } from './utils';
import { renameUnsafeCardProp } from './migrates/rename-unsafe-cards-prop';

const transformer = createTransformer('@atlaskit/editor-core', [
  renameUnsafeCardProp,
]);

export default transformer;
