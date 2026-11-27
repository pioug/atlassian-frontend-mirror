import { snapshot } from '@af/visual-regression';

import {
	TableHeadingCellAlignmentRenderer,
	TableHeadingCellAlignmentSortableRenderer,
} from './table-heading-cell-alignment.fixture.vr.ap';

snapshot(TableHeadingCellAlignmentRenderer, {
	description: 'first-block headings in table cells line up with paragraph text',
});

snapshot(TableHeadingCellAlignmentSortableRenderer, {
	description:
		'first-block headings in sortable header cells and heading wrappers line up with paragraph text',
});
