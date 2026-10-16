import type { ComponentType } from 'react';

import alignedHeadings from '../__fixtures__/headings-aligned-right.adf.json';
import nestedHeadings from '../__fixtures__/nested-headings-adf-panel-layout-table.json';
import { generateRendererComponent } from '../__helpers/rendererComponents.vr.ap';

export const NumberedHeadingsRenderer: ComponentType = generateRendererComponent({
	document: nestedHeadings,
	appearance: 'full-page',
	showHeadingNumbers: true,
	allowHeadingAnchorLinks: { allowNestedHeaderLinks: true },
});

export const RightAlignedNumberedHeadingsRenderer: ComponentType = generateRendererComponent({
	document: alignedHeadings,
	appearance: 'full-page',
	showHeadingNumbers: true,
	allowHeadingAnchorLinks: true,
});
