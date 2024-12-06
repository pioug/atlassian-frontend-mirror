// @ts-ignore -- ReadonlyTransaction is a local declaration and will cause a TS2305 error in CCFE typecheck
import type { ReadonlyTransaction, Transaction } from '@atlaskit/editor-prosemirror/state';
import type { DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { findTable } from '@atlaskit/editor-tables/utils';

import { TableDecorations } from '../../../types';
import {
	createColumnControlsDecoration,
	createColumnSelectedDecoration,
	findColumnControlSelectedDecoration,
	findControlsHoverDecoration,
	updateDecorations,
} from '../../utils/decoration';

import { composeDecorations } from './compose-decorations';
import type { BuildDecorationTransformerParams, DecorationTransformer } from './types';

const isColumnSelected = (tr: Transaction | ReadonlyTransaction): boolean =>
	tr.selection instanceof CellSelection && tr.selection.isColSelection();

// @see: https://product-fabric.atlassian.net/browse/ED-3796
const removeControlsHoverDecoration: DecorationTransformer = ({ decorationSet }) =>
	decorationSet.remove(findControlsHoverDecoration(decorationSet));

const maybeUpdateColumnSelectedDecoration: DecorationTransformer = ({ decorationSet, tr }) => {
	if (!isColumnSelected(tr)) {
		return decorationSet;
	}

	return updateDecorations(
		tr.doc,
		decorationSet,
		createColumnSelectedDecoration(tr),
		TableDecorations.COLUMN_SELECTED,
	);
};

const maybeUpdateColumnControlsDecoration: DecorationTransformer = ({ decorationSet, tr }) => {
	const table = findTable(tr.selection);

	if (!table) {
		return decorationSet;
	}

	return updateDecorations(
		tr.doc,
		decorationSet,
		createColumnControlsDecoration(tr.selection),
		TableDecorations.COLUMN_CONTROLS_DECORATIONS,
	);
};

// @see: https://product-fabric.atlassian.net/browse/ED-7304
const removeColumnControlsSelectedDecoration: DecorationTransformer = ({ decorationSet }) =>
	decorationSet.remove(findColumnControlSelectedDecoration(decorationSet));

const hasColumnSelectedDecorations = (decorationSet: DecorationSet): boolean =>
	!!findColumnControlSelectedDecoration(decorationSet).length;

export const maybeUpdateColumnControlsSelectedDecoration: DecorationTransformer = ({
	decorationSet,
	tr,
}) => {
	if (!hasColumnSelectedDecorations(decorationSet)) {
		return decorationSet;
	}

	return removeColumnControlsSelectedDecoration({ decorationSet, tr });
};

export const buildColumnControlsDecorations = ({
	decorationSet,
	tr,
	options,
}: BuildDecorationTransformerParams): DecorationSet => {
	if (options.isDragAndDropEnabled) {
		return composeDecorations([
			removeColumnControlsSelectedDecoration,
			removeControlsHoverDecoration,
			maybeUpdateColumnSelectedDecoration,
		])({ decorationSet, tr });
	}

	return composeDecorations([
		removeColumnControlsSelectedDecoration,
		removeControlsHoverDecoration,
		maybeUpdateColumnSelectedDecoration,
		maybeUpdateColumnControlsDecoration,
	])({ decorationSet, tr });
};
