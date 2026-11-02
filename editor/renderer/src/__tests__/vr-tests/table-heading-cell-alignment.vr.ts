import { snapshot } from '@af/visual-regression';

import {
	TableHeadingCellAlignmentRenderer,
	TableHeadingCellAlignmentSortableRenderer,
} from './table-heading-cell-alignment.fixture.vr.ap';

snapshot(TableHeadingCellAlignmentRenderer, {
	description: 'first-block headings in table cells line up with paragraph text',
	featureFlags: {
		platform_editor_table_heading_cell_alignment: true,
	},
});

snapshot(TableHeadingCellAlignmentSortableRenderer, {
	description:
		'first-block headings in sortable header cells and heading wrappers line up with paragraph text',
	featureFlags: {
		platform_editor_table_heading_cell_alignment: true,
		platform_editor_copy_link_a11y_inconsistency_fix: true,
	},
});

snapshot(TableHeadingCellAlignmentRenderer, {
	description: 'first-block headings in table cells keep top alignment when the gate is off',
	featureFlags: {
		platform_editor_table_heading_cell_alignment: false,
	},
});
