import { removeConfigPanelWidthProp } from './migrates/remove-config-panel-width-prop';
import { createTransformer } from './utils';

const transformer = createTransformer('@atlaskit/editor-core', [
  removeConfigPanelWidthProp,
]);

export default transformer;
