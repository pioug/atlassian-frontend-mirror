import type { EditorCommand } from '@atlaskit/editor-common/types/editor-command';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types/next-editor-plugin';
import type { ReadonlyTransaction, Transaction } from '@atlaskit/editor-prosemirror/state';

import type { NumberedHeadingsExternalState } from './types/numbered-headings';

/**
 * Settings stored outside ADF. Every value is optional: a missing value means the product has not
 * stored one, and each consumer applies its own default. Object values are compared shallowly, so
 * keep them flat.
 */
export type ExternalState = {
	numberedHeadings?: NumberedHeadingsExternalState;
};

export type ExternalStateKey = keyof ExternalState;

export type ExternalStateProvider = {
	/** Values already known when the editor starts. Synchronous. */
	getInitialState?: () => Partial<ExternalState> | undefined;
	/**
	 * Values that arrive later (async load, collaborators). Emit changes from other sources, in the
	 * order they were stored; don't echo this editor's own saves. Returns an unsubscribe function.
	 */
	subscribe?: (onChange: (state: Partial<ExternalState>) => void) => () => void;
	/**
	 * Saves one value. Must reject when the save fails. Resolves with the value now stored when the
	 * provider knows it (for example, another source's write landed after this one); the editor then
	 * shows that value once its saves for the key finish.
	 */
	updateState: <K extends ExternalStateKey>(
		key: K,
		value: ExternalState[K],
	) => Promise<ExternalStateStoredValue<K> | void>;
};

export type ExternalStatePluginOptions = {
	/** Defaults used before, or without, provider values. Provider initial values win. */
	initialState?: Partial<ExternalState>;
	/** Loads, saves and syncs values. Without one, values live in editor state only. */
	provider?: ExternalStateProvider;
};

export type ExternalStateSharedState = {
	state: ExternalState;
};

/** The value a provider reports as stored after a save. Wrapped so that `undefined` is distinguishable. */
export type ExternalStateStoredValue<K extends ExternalStateKey> = {
	value: ExternalState[K];
};

/** A value set by one transaction. Wrapped so that a change to `undefined` is distinguishable. */
export type ExternalStateChange<K extends ExternalStateKey> = {
	value: ExternalState[K];
};

export type ExternalStatePlugin = NextEditorPlugin<
	'externalState',
	{
		actions: {
			/**
			 * Current value of `key`. Before the editor state exists (for example in another
			 * plugin's state `init`), returns the initial value.
			 */
			getState: <K extends ExternalStateKey>(key: K) => ExternalState[K];
			/** The value `tr` sets for `key`, or `undefined` when `tr` does not change it. */
			getStateChange: <K extends ExternalStateKey>(
				tr: Transaction | ReadonlyTransaction,
				key: K,
			) => ExternalStateChange<K> | undefined;
			/**
			 * Sets `key` in editor state, then saves it through the provider, one save at a time per
			 * key. Requests made while a save runs collapse into the latest one. When the save fails,
			 * reverts to the last confirmed value, unless a newer request is waiting. Resolves with the
			 * result of the last value sent: `true` when saved (or when there is no provider) and
			 * `false` when the save failed.
			 */
			saveState: <K extends ExternalStateKey>(key: K, value: ExternalState[K]) => Promise<boolean>;
		};
		commands: {
			/** Sets `key` in editor state only. Not saved, not added to undo history. */
			setState: <K extends ExternalStateKey>(key: K, value: ExternalState[K]) => EditorCommand;
		};
		pluginConfiguration: ExternalStatePluginOptions | undefined;
		sharedState: ExternalStateSharedState;
	}
>;
