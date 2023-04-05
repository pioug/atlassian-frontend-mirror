import { createTransformer } from './utils';
import { removeConfigPanelWidthProp } from './migrates/remove-config-panel-width-prop';

const transformer = createTransformer('@atlaskit/editor-core', [
  removeConfigPanelWidthProp,
]);

export default transformer;
