import { createTransformer } from './utils';
import { renameExperimentalTextColorProp } from './migrates/rename-experimental-text-color-prop';
import { removeConfigPanelWidthProp } from './migrates/remove-config-panel-width-prop';

const transformer = createTransformer('@atlaskit/editor-core', [
  renameExperimentalTextColorProp,
  removeConfigPanelWidthProp,
]);

export default transformer;
