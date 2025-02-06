import React from 'react';

import { adfNestedTableInsideTable, adfNestedTableWithLotsOfRows } from './__fixtures__';

import { generateRendererComponent } from '../__helpers/rendererComponents';

export const NestedTableRenderer = generateRendererComponent({
	document: adfNestedTableInsideTable,
	appearance: 'full-page',
	allowColumnSorting: true,
});

export const NestedTableWithOverflowRenderer = generateRendererComponent({
	document: adfNestedTableWithLotsOfRows,
	appearance: 'full-page',
	stickyHeaders: true,
});

export function StickyHeaderNestedTableRenderer() {
	return (
		<div
			id="testscrollcontainer"
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={{ overflow: 'scroll', width: 500, height: 500 }}
		>
			<NestedTableWithOverflowRenderer />
		</div>
	);
}
