import React from 'react';

import {
	adfNestedTableInsideTable,
	adfNestedTableWithLotsOfRows,
	adfNestedTableInsideTableWithNumberedColumn,
} from './__fixtures__';

import { generateRendererComponent } from '../__helpers/rendererComponents.vr.ap';

export const NestedTableRenderer: React.ComponentType<any> = generateRendererComponent({
	document: adfNestedTableInsideTable,
	appearance: 'full-page',
	allowColumnSorting: true,
});

export const NestedTableNumberedColumnRenderer: React.ComponentType<any> =
	generateRendererComponent({
		document: adfNestedTableInsideTableWithNumberedColumn,
		appearance: 'full-page',
		allowColumnSorting: true,
	});

export const NestedTableWithOverflowRenderer: React.ComponentType<any> = generateRendererComponent({
	document: adfNestedTableWithLotsOfRows,
	appearance: 'full-page',
	stickyHeaders: true,
});

export function StickyHeaderNestedTableRenderer(): React.JSX.Element {
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
