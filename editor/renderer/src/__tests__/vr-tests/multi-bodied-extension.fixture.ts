import { extensionHandlers } from '@atlaskit/editor-test-helpers/extensions';
import { multiBodiedExtensionNodeAdf } from '../__fixtures__/full-width-adf';

import { generateRendererComponent } from '../__helpers/rendererComponents';

export const MultiBodiedExtensionRenderer = generateRendererComponent({
	document: multiBodiedExtensionNodeAdf,
	appearance: 'full-width',
	extensionHandlers: extensionHandlers,
});
