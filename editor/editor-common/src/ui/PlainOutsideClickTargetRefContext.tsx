import React from 'react';

// Use this context to pass in the reference of the element that should be considered as the outside click target
// The outside click target is the element that should be clicked outside of to trigger the `handleClickOutside` event
export const PlainOutsideClickTargetRefContext: React.Context<(el: HTMLElement | null) => void> =
	React.createContext<(el: HTMLElement | null) => void>(() => {});
