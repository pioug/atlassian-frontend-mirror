import type { FileInfo, API, Options } from 'jscodeshift';

import { removeConfigPanelWidthProp } from './migrates/remove-config-panel-width-prop';
import { createTransformer } from './utils';

const transformer: (fileInfo: FileInfo, _api: API, options: Options) => string = createTransformer(
	'@atlaskit/editor-core',
	[removeConfigPanelWidthProp],
);

export default transformer;
