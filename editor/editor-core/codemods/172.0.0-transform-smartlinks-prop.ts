import { renameSmartLinksProp } from './migrates/rename-smartlinks-prop';
import { createTransformer } from './utils';

const transformer = createTransformer('@atlaskit/editor-core', [
  renameSmartLinksProp,
]);

export default transformer;
