import { type Context, createContext } from 'react';

// Same structure as react's useRef.
// This allows modals to use a ref to scope their value
// const id = useRef(null);
// <InteractionIDContext.Provider value={id}>...<
export type InteractionIDContextType = {
	current: string | null;
};

// Subscription system for interaction ID changes
type InteractionIDListener = (newId: string | null) => void;
const listeners = new Set<InteractionIDListener>();

// Observable interaction ID implementation
class ObservableInteractionID implements InteractionIDContextType {
	private _current: string | null = null;

	get current(): string | null {
		return this._current;
	}

	set current(newId: string | null) {
		const oldId = this._current;
		this._current = newId;

		// Notify all listeners if the ID actually changed
		if (oldId !== newId) {
			listeners.forEach((listener) => listener(newId));
		}
	}
}

// Type declaration for globalThis extension
declare global {
	var __UFO_DEFAULT_INTERACTION_ID__: InteractionIDContextType | undefined;
}

// Ensures a single DefaultInteractionID instance exists across the entire application,
// even when the module is loaded multiple times in different contexts
const initializeGlobalDefaultInteractionID = (): InteractionIDContextType => {
	// Return existing instance if already initialized
	if (globalThis.__UFO_DEFAULT_INTERACTION_ID__) {
		return globalThis.__UFO_DEFAULT_INTERACTION_ID__;
	}

	// Create and store new instance globally
	const instance = new ObservableInteractionID();
	globalThis.__UFO_DEFAULT_INTERACTION_ID__ = instance;
	return instance;
};

// The default InteractionID object is a global singleton stored in globalThis.
// It holds the root value used in routing and is updated when new interactions start.
export const DefaultInteractionID: InteractionIDContextType =
	initializeGlobalDefaultInteractionID();

// Subscription functions
export const subscribeToInteractionIdChanges = (listener: InteractionIDListener): (() => void) => {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
};

// We use a context to allow modals to have their own lifecycle
const _default_1: Context<InteractionIDContextType> =
	createContext<InteractionIDContextType>(DefaultInteractionID);
export default _default_1;

export const getInteractionId = (): InteractionIDContextType => DefaultInteractionID;

export const useInteractionId = (): InteractionIDContextType => DefaultInteractionID;
