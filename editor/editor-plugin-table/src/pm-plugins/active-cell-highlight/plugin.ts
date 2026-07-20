import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type {
	EditorState,
	// @ts-ignore -- ReadonlyTransaction is a local declaration
	ReadonlyTransaction,
	Transaction,
} from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { findCellClosestToPos } from '@atlaskit/editor-tables/utils';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { PluginInjectionAPI } from '../../types';
import { TableCssClassName as ClassName } from '../../types';

interface ActiveCellHighlightState {
	/** Position of the currently highlighted cell, or -1 if none */
	cellPos: number;
	decorationSet: DecorationSet;
	/** Whether the editor has had its first interaction. */
	hasHadInteraction?: boolean;
}

type ActiveCellHighlightStateField = {
	apply: (
		tr: Transaction | ReadonlyTransaction,
		prev: ActiveCellHighlightState,
		oldState: EditorState,
		newState: EditorState,
	) => ActiveCellHighlightState;
	init: (config: unknown, state: EditorState) => ActiveCellHighlightState;
};

const EMPTY_STATE: ActiveCellHighlightState = {
	cellPos: -1,
	decorationSet: DecorationSet.empty,
};

export const activeCellHighlightPluginKey: PluginKey<ActiveCellHighlightState> =
	new PluginKey<ActiveCellHighlightState>('tableActiveCellHighlight');

/**
 * Returns the position of the cell containing the cursor, or -1 if the cursor
 * is not in a table cell or the selection is a CellSelection.
 */
const getActiveCellPos = (state: EditorState): number => {
	if (state.selection instanceof CellSelection) {
		return -1;
	}

	try {
		const cell = findCellClosestToPos(state.selection.$from);
		return cell ? cell.pos : -1;
	} catch {
		return -1;
	}
};

/** Builds the decoration state highlighting the cell at `cellPos`. */
const buildState = (cellPos: number, state: EditorState): ActiveCellHighlightState => {
	if (cellPos === -1) {
		return EMPTY_STATE;
	}

	try {
		const cell = state.doc.nodeAt(cellPos);
		if (!cell) {
			return EMPTY_STATE;
		}

		const decoration = Decoration.node(cellPos, cellPos + cell.nodeSize, {
			class: ClassName.ACTIVE_CURSOR_CELL,
		});

		return {
			cellPos,
			decorationSet: DecorationSet.create(state.doc, [decoration]),
		};
	} catch {
		return EMPTY_STATE;
	}
};

const hasHadInteraction = (api: PluginInjectionAPI | undefined): boolean => {
	// The interaction plugin is optional - when absent, default to treating the editor as
	// interacted.
	if (!api?.interaction) {
		return true;
	}

	return api.interaction.sharedState.currentState()?.interactionState !== 'hasNotHadInteraction';
};

const createLegacyStateField = (): ActiveCellHighlightStateField => ({
	init: (_config, state) => buildState(getActiveCellPos(state), state),

	apply: (tr, prev, _oldState, newState) => {
		if (tr.docChanged) {
			// Doc changed — always rebuild since positions may have shifted.
			return buildState(getActiveCellPos(newState), newState);
		}

		if (!tr.selectionSet) {
			// Neither doc nor selection changed — nothing to do.
			return prev;
		}

		// Selection changed — only rebuild if the cursor moved to a different cell.
		const nextCellPos = getActiveCellPos(newState);
		return nextCellPos === prev.cellPos ? prev : buildState(nextCellPos, newState);
	},
});

/**
 * Stays hidden until the first interaction
 */
const createGatedStateField = (
	api: PluginInjectionAPI | undefined,
): ActiveCellHighlightStateField => ({
	init: (_config, state) => {
		const interacted = hasHadInteraction(api);
		return {
			...(interacted ? buildState(getActiveCellPos(state), state) : EMPTY_STATE),
			hasHadInteraction: interacted,
		};
	},

	apply: (tr, prev, _oldState, newState) => {
		const interacted = hasHadInteraction(api);

		// Keep the highlight hidden until the first interaction has happened.
		if (!interacted) {
			return prev;
		}

		// `true` only on the single transaction that crosses from "no interaction"
		// to "interacted" — the meta-only transaction that reveals the highlight.
		const isFirstInteraction = !prev.hasHadInteraction;

		if (!tr.docChanged && !tr.selectionSet && !isFirstInteraction) {
			// Doc, selection and interaction are all unchanged — nothing to do.
			return prev;
		}

		const nextCellPos = getActiveCellPos(newState);
		if (nextCellPos === prev.cellPos && !isFirstInteraction) {
			return prev;
		}

		return { ...buildState(nextCellPos, newState), hasHadInteraction: true };
	},
});

export const createPlugin = (api?: PluginInjectionAPI): SafePlugin<ActiveCellHighlightState> => {
	return new SafePlugin<ActiveCellHighlightState>({
		key: activeCellHighlightPluginKey,
		state: expValEquals('platform_editor_table_q4_patch_3', 'isEnabled', true)
			? createGatedStateField(api)
			: createLegacyStateField(),
		props: {
			decorations: (state) =>
				activeCellHighlightPluginKey.getState(state)?.decorationSet ?? DecorationSet.empty,
		},
	});
};
