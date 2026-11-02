import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type {
	ExternalState,
	ExternalStateKey,
	ExternalStatePlugin,
	ExternalStateProvider,
} from './externalStatePluginType';
import { setState } from './pm-plugins/commands/set-state';
import {
	createPlugin,
	externalStatePluginKey,
	getChangedValues,
	getValuesMeta,
	setValuesMeta,
} from './pm-plugins/main';

type KeySaves = {
	loop?: Promise<boolean>;
	/** Counts provider updates, so a late acknowledgement can't replace a newer value. */
	providerUpdates: number;
	/** The latest value the user asked to save, until the save loop sends it. */
	requested?: { value: ExternalState[ExternalStateKey] };
	/** The provider reported the stored value, so the editor shows it when the loop ends. */
	shouldShowConfirmed?: boolean;
};

export const externalStatePlugin: ExternalStatePlugin = ({ config, api }) => {
	const provider = config?.provider;
	const initialState: ExternalState = {
		...config?.initialState,
		...provider?.getInitialState?.(),
	};
	// Last values the provider confirmed. A failed save reverts to these.
	const confirmedState: ExternalState = { ...initialState };
	const keySaves = new Map<ExternalStateKey, KeySaves>();
	// A save can finish after the editor is destroyed; it must not revert into a destroyed view.
	let isDestroyed = false;

	const getCurrentState = (): ExternalState =>
		api?.externalState?.sharedState.currentState()?.state ?? initialState;

	const setStateCommand = <K extends ExternalStateKey>(key: K, value: ExternalState[K]) =>
		setState(getCurrentState, key, value);

	const getKeySaves = (key: ExternalStateKey): KeySaves => {
		let saves = keySaves.get(key);
		if (!saves) {
			saves = { providerUpdates: 0 };
			keySaves.set(key, saves);
		}
		return saves;
	};

	const send = async (
		provider: ExternalStateProvider,
		key: ExternalStateKey,
		value: ExternalState[ExternalStateKey],
		saves: KeySaves,
	): Promise<boolean> => {
		const providerUpdates = saves.providerUpdates;
		try {
			const stored = await provider.updateState(key, value);
			if (stored) {
				// The provider knows which write is stored, even when another source's value arrived
				// during the request.
				Object.assign(confirmedState, { [key]: stored.value });
				saves.shouldShowConfirmed = true;
			} else if (saves.providerUpdates === providerUpdates) {
				// A provider update that arrived during the request may be newer than this write.
				Object.assign(confirmedState, { [key]: value });
			}
			return true;
		} catch {
			if (!saves.requested && !isDestroyed) {
				api?.core?.actions.execute(setStateCommand(key, confirmedState[key]));
			}
			return false;
		}
	};

	const runSaveLoop = async (
		provider: ExternalStateProvider,
		key: ExternalStateKey,
		saves: KeySaves,
	): Promise<boolean> => {
		let result = true;
		while (saves.requested) {
			const { value } = saves.requested;
			saves.requested = undefined;
			result = await send(provider, key, value, saves);
		}
		saves.loop = undefined;
		if (saves.shouldShowConfirmed && !isDestroyed) {
			saves.shouldShowConfirmed = false;
			const changed = getChangedValues(getCurrentState(), { [key]: confirmedState[key] });
			if (changed) {
				api?.core?.actions.execute(({ tr }) => setValuesMeta(tr, changed));
			}
		}
		return result;
	};

	/** Saves one value per key at a time. Requests made meanwhile collapse into the latest one. */
	const requestSave = (
		key: ExternalStateKey,
		value: ExternalState[ExternalStateKey],
	): Promise<boolean> => {
		if (!provider) {
			return Promise.resolve(true);
		}
		const saves = getKeySaves(key);
		saves.requested = { value };
		saves.loop ??= Promise.resolve().then(() => runSaveLoop(provider, key, saves));
		return saves.loop;
	};

	const onViewCreated = (editorView: EditorView) => {
		isDestroyed = false;
		const unsubscribe = provider?.subscribe?.((values) => {
			Object.assign(confirmedState, values);
			// A running save would overwrite this value, so keep showing the user's.
			const shown: Partial<ExternalState> = {};
			for (const key of Object.keys(values) as ExternalStateKey[]) {
				const saves = getKeySaves(key);
				saves.providerUpdates += 1;
				if (!saves.loop) {
					Object.assign(shown, { [key]: values[key] });
				}
			}
			const current = externalStatePluginKey.getState(editorView.state)?.state;
			const changed = current && getChangedValues(current, shown);
			if (changed) {
				editorView.dispatch(setValuesMeta(editorView.state.tr, changed));
			}
		});

		return () => {
			isDestroyed = true;
			keySaves.clear();
			unsubscribe?.();
		};
	};

	return {
		name: 'externalState',

		pmPlugins() {
			return [
				{
					name: 'externalState',
					plugin: () => createPlugin({ initialState, onViewCreated }),
				},
			];
		},

		actions: {
			getState: (key) => getCurrentState()[key],

			getStateChange: (tr, key) => {
				const values = getValuesMeta(tr);
				return values && key in values ? { value: values[key] } : undefined;
			},

			saveState: (key, value) => {
				api?.core?.actions.execute(setStateCommand(key, value));
				return requestSave(key, value);
			},
		},

		commands: {
			setState: setStateCommand,
		},

		getSharedState(editorState) {
			if (!editorState) {
				return { state: initialState };
			}
			return { state: externalStatePluginKey.getState(editorState)?.state ?? initialState };
		},
	};
};
