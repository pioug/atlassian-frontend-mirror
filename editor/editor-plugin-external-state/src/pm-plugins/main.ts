import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ReadonlyTransaction, Transaction } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { ExternalState, ExternalStateKey } from '../externalStatePluginType';

export type ExternalStatePluginState = {
	state: ExternalState;
};

type ExternalStateMeta = {
	values: Partial<ExternalState>;
};

export const externalStatePluginKey: PluginKey<ExternalStatePluginState> =
	new PluginKey<ExternalStatePluginState>('externalStatePlugin');

const getKeys = (values: Partial<ExternalState>): ExternalStateKey[] =>
	Object.keys(values) as ExternalStateKey[];

/** Values are primitives or flat objects, so a shallow comparison is enough. */
const isSameValue = (a: unknown, b: unknown): boolean => {
	if (a === b) {
		return true;
	}
	if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) {
		return false;
	}
	const aRecord = a as Record<string, unknown>;
	const bRecord = b as Record<string, unknown>;
	const aKeys = Object.keys(aRecord);
	return (
		aKeys.length === Object.keys(bRecord).length &&
		aKeys.every((key) => aRecord[key] === bRecord[key])
	);
};

/** Keeps only the values that differ from `current`. */
export const getChangedValues = (
	current: ExternalState,
	values: Partial<ExternalState>,
): Partial<ExternalState> | undefined => {
	const changed: Partial<ExternalState> = {};
	let hasChanges = false;
	for (const key of getKeys(values)) {
		if (!isSameValue(current[key], values[key])) {
			Object.assign(changed, { [key]: values[key] });
			hasChanges = true;
		}
	}
	return hasChanges ? changed : undefined;
};

/** Not undoable. Callers can add steps to the same transaction, such as an analytics step. */
export const setValuesMeta = (tr: Transaction, values: Partial<ExternalState>): Transaction =>
	tr
		.setMeta(externalStatePluginKey, { values } satisfies ExternalStateMeta)
		.setMeta('addToHistory', false);

export const getValuesMeta = (
	tr: Transaction | ReadonlyTransaction,
): Partial<ExternalState> | undefined =>
	(tr.getMeta(externalStatePluginKey) as ExternalStateMeta | undefined)?.values;

const applyValues = (
	pluginState: ExternalStatePluginState,
	values: Partial<ExternalState>,
): ExternalStatePluginState => {
	const changed = getChangedValues(pluginState.state, values);
	return changed ? { state: { ...pluginState.state, ...changed } } : pluginState;
};

type CreatePluginOptions = {
	initialState: ExternalState;
	/** Called once the view exists. Returns a cleanup function for view destruction. */
	onViewCreated: (editorView: EditorView) => (() => void) | undefined;
};

export const createPlugin = ({
	initialState,
	onViewCreated,
}: CreatePluginOptions): SafePlugin<ExternalStatePluginState> =>
	new SafePlugin<ExternalStatePluginState>({
		key: externalStatePluginKey,
		state: {
			init: () => ({ state: initialState }),
			apply: (tr, pluginState) => {
				const values = getValuesMeta(tr);
				return values ? applyValues(pluginState, values) : pluginState;
			},
		},
		view: (editorView) => {
			const cleanup = onViewCreated(editorView);
			return {
				destroy: () => cleanup?.(),
			};
		},
	});
