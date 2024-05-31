import { extensionsWithinExpand } from '../__fixtures__/extension-layouts';
import { generateRendererComponent } from '../__helpers/rendererComponents';
import { extensionHandlers } from '@atlaskit/editor-test-helpers/extensions';

export const ExtensionsWithinExpand = generateRendererComponent({
	document: extensionsWithinExpand,
	appearance: 'full-page',
	extensionHandlers,
});
