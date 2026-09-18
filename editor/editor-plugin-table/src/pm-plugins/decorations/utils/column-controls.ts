import type { ReadonlyTransaction, Transaction } from '@atlaskit/editor-prosemirror/state';
import type { DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';

import { TableDecorations } from '../../../types';
import {
	createColumnSelectedDecoration,
	findColumnControlSelectedDecoration,
	findControlsHoverDecoration,
	updateDecorations,
} from '../../utils/decoration';
import { composeDecorations } from './compose-decorations';
import type { DecorationTransformer, DecorationTransformerParams } from './types';

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
}: DecorationTransformerParams): DecorationSet => {
	return composeDecorations([
		removeColumnControlsSelectedDecoration,
		removeControlsHoverDecoration,
		maybeUpdateColumnSelectedDecoration,
	])({ decorationSet, tr });
};
