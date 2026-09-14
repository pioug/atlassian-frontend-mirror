import { overflowLayout } from '../__fixtures__/overflow.adf';
import * as layout4Col from '../__fixtures__/layout-4-columns.adf.json';
import * as layout5Col from '../__fixtures__/layout-5-columns.adf.json';

import { extensionHandlers } from '@atlaskit/editor-test-helpers/extensions';

import { generateRendererComponent } from '../__helpers/rendererComponents.vr.ap';
import type { ComponentType } from 'react';

export const OverflowLayoutRenderer: ComponentType<any> = generateRendererComponent({
	document: overflowLayout,
	appearance: 'full-page',
	extensionHandlers,
});

export const Layout4ColInFullWidthRenderer: ComponentType<any> = generateRendererComponent({
	document: layout4Col,
	appearance: 'full-width',
});

export const Layout5ColRenderer: ComponentType<any> = generateRendererComponent({
	document: layout5Col,
	appearance: 'full-page',
});
