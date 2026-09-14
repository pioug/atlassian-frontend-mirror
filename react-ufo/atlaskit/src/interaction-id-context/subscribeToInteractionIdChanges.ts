// Subscription system for interaction ID changes
type InteractionIDListener = (newId: string | null) => void;

export const listeners: Set<InteractionIDListener> = new Set();

// Subscription functions
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const subscribeToInteractionIdChanges = (listener: InteractionIDListener): (() => void) => {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
};
