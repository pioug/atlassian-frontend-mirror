import { listeners } from './subscribeToInteractionIdChanges';

// Same structure as react's useRef.
// This allows modals to use a ref to scope their value
// const id = useRef(null);
// <InteractionIDContext.Provider value={id}>...<
export type InteractionIDContextType = {
	current: string | null;
};

class ObservableInteractionID implements InteractionIDContextType {
	private _current: string | null = null;

	get current(): string | null {
		return this._current;
	}

	set current(newId: string | null) {
		const oldId = this._current;
		this._current = newId;

		if (oldId !== newId) {
			listeners.forEach((listener) => listener(newId));
		}
	}
}

const initializeGlobalDefaultInteractionID = (): InteractionIDContextType => {
	if (globalThis.__UFO_DEFAULT_INTERACTION_ID__) {
		return globalThis.__UFO_DEFAULT_INTERACTION_ID__;
	}

	const instance = new ObservableInteractionID();
	globalThis.__UFO_DEFAULT_INTERACTION_ID__ = instance;
	return instance;
};

const DefaultInteractionID: InteractionIDContextType = initializeGlobalDefaultInteractionID();

export default DefaultInteractionID;

declare global {
	var __UFO_DEFAULT_INTERACTION_ID__: InteractionIDContextType | undefined;
}
