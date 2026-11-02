import type { ComponentType } from 'react';

import tableHeadingCellAlignmentAdf from '../__fixtures__/table-heading-cell-alignment.adf.json';
import { generateRendererComponent } from '../__helpers/rendererComponents.vr.ap';

export const TableHeadingCellAlignmentRenderer: ComponentType<any> = generateRendererComponent({
	document: tableHeadingCellAlignmentAdf,
	appearance: 'full-page',
});

export const TableHeadingCellAlignmentSortableRenderer: ComponentType<any> =
	generateRendererComponent({
		document: tableHeadingCellAlignmentAdf,
		appearance: 'full-page',
		allowColumnSorting: true,
		allowHeadingAnchorLinks: {
			allowNestedHeaderLinks: true,
		},
	});
