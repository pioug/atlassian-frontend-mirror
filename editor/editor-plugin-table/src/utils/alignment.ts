import type { TableLayout } from '@atlaskit/adf-schema';
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';

import { FULL_WIDTH_EDITOR_CONTENT_WIDTH } from '../pm-plugins/table-resizing/utils/consts';
import type { AlignmentOptions } from '../types';

export const ALIGN_START = 'align-start';
export const ALIGN_CENTER = 'center';

/**
 * Normalise table layout attribute an alignment value ('center' or 'align-start'), returns
 * center if layout equals a breakout value (e.g. 'default', 'wide', 'full-width')
 */
export const normaliseAlignment = (layout: TableLayout): AlignmentOptions =>
	layout === ALIGN_CENTER || layout === ALIGN_START ? layout : ALIGN_CENTER;

/**
 * We don't want to switch alignment in Full-width editor
 */
export const shouldChangeAlignmentToCenterResized = (
	isTableAlignmentEnabled: boolean | undefined,
	tableNode: PmNode,
	lineLength: number | undefined,
	updatedTableWidth: number,
) =>
	isTableAlignmentEnabled &&
	tableNode &&
	tableNode.attrs.layout === ALIGN_START &&
	lineLength &&
	updatedTableWidth > lineLength &&
	lineLength < FULL_WIDTH_EDITOR_CONTENT_WIDTH;
