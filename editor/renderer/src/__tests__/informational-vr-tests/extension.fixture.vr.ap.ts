import type { ComponentType } from 'react';
import { extensionsWithinExpand } from '../__fixtures__/extension-layouts';
import { generateRendererComponent } from '../__helpers/rendererComponents.vr.ap';
import { extensionHandlers } from '@atlaskit/editor-test-helpers/extensions';

export const ExtensionsWithinExpand: ComponentType<any> = generateRendererComponent({
	document: extensionsWithinExpand,
	appearance: 'full-page',
	extensionHandlers,
});
