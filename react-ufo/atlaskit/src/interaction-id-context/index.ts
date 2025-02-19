import { createContext } from 'react';

// Same structure as react's useRef.
// This allows modals to use a ref to scope their value
// const id = useRef(null);
// <InteractionIDContext.Provider value={id}>...<
export type InteractionIDContextType = {
	current: string | null;
};

// The default InteractionID object is a global singleton
// It's the one that holds the root value used in routing,
// and is overwritten when we have new interactions start.
export const DefaultInteractionID: InteractionIDContextType = {
	current: null,
};

// We use a context to allow modals to have their own lifecycle
export default createContext<InteractionIDContextType>(DefaultInteractionID);

export const getInteractionId = () => DefaultInteractionID;

export const useInteractionId = () => DefaultInteractionID;
