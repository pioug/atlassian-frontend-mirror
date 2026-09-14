import type { ComponentType } from 'react';

import type { DocNode } from '@atlaskit/adf-schema/doc';
import {
	tableBackgroundColorPalette,
	tableBackgroundColorPaletteNew,
} from '@atlaskit/adf-schema/tableNodes';

import { tableAdf, tableWithNumberedColumnAdf } from '../__fixtures__/full-width-adf';
import { overflowTableFullWidth, overflowTableWide } from '../__fixtures__/overflow.adf';
import tableWithWrappedNodesAdf from '../__fixtures__/table-with-wrapped-nodes.adf.json';
import tableComplexSelectionsAdf from '../__fixtures__/table-complex-selections.adf.json';
import { tableColorAdf } from '../__fixtures__/table-color';

import { generateRendererComponent } from '../__helpers/rendererComponents.vr.ap';

export const TableRenderer: ComponentType<any> = generateRendererComponent({
	document: tableAdf,
	appearance: 'full-width',
});

export const TableRendererWithNumberedColumnFullWidth: ComponentType<any> =
	generateRendererComponent({
		document: tableWithNumberedColumnAdf,
		appearance: 'full-width',
	});

export const WideTableRendererFullWidth: ComponentType<any> = generateRendererComponent({
	document: overflowTableWide,
	appearance: 'full-width',
});

export const FullWidthTableRendererFullWidth: ComponentType<any> = generateRendererComponent({
	document: overflowTableFullWidth,
	appearance: 'full-width',
	UNSTABLE_allowTableAlignment: true,
	UNSTABLE_allowTableResizing: true,
});

export const TableRendererWideOverflow: ComponentType<any> = generateRendererComponent({
	document: overflowTableWide,
	appearance: 'full-page',
	UNSTABLE_allowTableResizing: true,
});

export const TableRendererFullWidthOverflow: ComponentType<any> = generateRendererComponent({
	document: overflowTableFullWidth,
	appearance: 'full-page',
	UNSTABLE_allowTableResizing: true,
});

export const TableRendererWrappedNodes: ComponentType<any> = generateRendererComponent({
	document: tableWithWrappedNodesAdf,
	appearance: 'full-page',
});

export const TableRendererComplexNodes: ComponentType<any> = generateRendererComponent({
	document: tableComplexSelectionsAdf,
	appearance: 'full-page',
});

export const TableRendererBackgroundColor: ComponentType<any> = generateRendererComponent({
	document: tableColorAdf,
	appearance: 'full-page',
});

const createTableWithBackgroundColors = (
	palette: ReadonlyMap<string, string>,
	columnCount: number,
): DocNode => {
	const cells = Array.from(palette.keys()).map((background) => ({
		type: 'tableCell' as const,
		attrs: {
			background,
			colwidth: [100],
		},
		content: [
			{
				type: 'paragraph' as const,
				content: [],
			},
		],
	}));

	const rows = Array.from({ length: Math.ceil(cells.length / columnCount) }, (_, index) => ({
		type: 'tableRow' as const,
		content: cells.slice(index * columnCount, (index + 1) * columnCount),
	}));

	return {
		version: 1,
		type: 'doc',
		content: [
			{
				type: 'table',
				attrs: {
					isNumberColumnEnabled: false,
					width: columnCount * 100,
				},
				content: rows,
			},
		],
	};
};

export const LegacyPaletteRenderer: ComponentType<any> = generateRendererComponent({
	document: createTableWithBackgroundColors(tableBackgroundColorPalette, 7),
	appearance: 'full-page',
	UNSTABLE_allowTableResizing: true,
});

export const ExpandedPaletteRenderer: ComponentType<any> = generateRendererComponent({
	document: createTableWithBackgroundColors(tableBackgroundColorPaletteNew, 10),
	appearance: 'full-page',
	UNSTABLE_allowTableResizing: true,
});

export const TableRendereWithNumberedColumnFullPage: ComponentType<any> = generateRendererComponent(
	{
		document: tableWithNumberedColumnAdf,
		appearance: 'full-page',
	},
);

export const TableRendererFullWidthComment: ComponentType<any> = generateRendererComponent({
	document: overflowTableFullWidth,
	appearance: 'comment',
});

export const TableRendererWideComment: ComponentType<any> = generateRendererComponent({
	document: overflowTableWide,
	appearance: 'comment',
});

export const TableRendererComment: ComponentType<any> = generateRendererComponent({
	document: tableAdf,
	appearance: 'comment',
});

export const TableRendererWithNumberedColumnComment: ComponentType<any> = generateRendererComponent(
	{
		document: tableWithNumberedColumnAdf,
		appearance: 'comment',
	},
);

export const TableRendererWithoutAppearance: ComponentType<any> = generateRendererComponent({
	document: tableAdf,
	appearance: undefined,
});

export const TableRendererFullWidthWithoutAppearance: ComponentType<any> =
	generateRendererComponent({
		document: overflowTableFullWidth,
		appearance: undefined,
	});

export const TableRendererWideWithoutAppearance: ComponentType<any> = generateRendererComponent({
	document: overflowTableWide,
	appearance: undefined,
});

export const TableRendererWithNumberedColumnWithoutAppearance: ComponentType<any> =
	generateRendererComponent({
		document: tableWithNumberedColumnAdf,
		appearance: undefined,
	});
