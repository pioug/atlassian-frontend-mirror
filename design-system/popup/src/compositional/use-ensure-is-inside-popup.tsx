import { useContext } from 'react';

import invariant from 'tiny-invariant';

import { EnsureIsInsidePopupContext } from './is-inside-popup-context';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export function useEnsureIsInsidePopup(): void {
	const context = useContext(EnsureIsInsidePopupContext);
	invariant(context, 'PopupTrigger and PopupContent components must be used within a Popup');
}
