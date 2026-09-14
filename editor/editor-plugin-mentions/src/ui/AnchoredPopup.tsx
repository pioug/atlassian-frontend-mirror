import React, { useCallback, type ReactNode } from 'react';

import { Popup } from '@atlaskit/popup/popup';
import type { TriggerProps } from '@atlaskit/popup/types';

export type AnchoredPopupProps = {
	anchorElement: HTMLElement | null;
	content: ReactNode;
	isOpen: boolean;
	onClose: () => void;
};

/**
 * A `<Popup>` anchored to an externally-supplied DOM node. Unlike `PopupTrigger`, it has no
 * clickable trigger of its own — it opens whenever `isOpen` becomes true, so callers can drive
 * it from any external signal.
 */
export function AnchoredPopup({
	anchorElement,
	content,
	isOpen,
	onClose,
}: AnchoredPopupProps): JSX.Element {
	const renderContent = useCallback(() => (isOpen ? content : null), [isOpen, content]);

	const renderTrigger = useCallback(
		(triggerProps: TriggerProps) => {
			if (anchorElement && typeof triggerProps.ref === 'function') {
				triggerProps.ref(anchorElement);
			}
			return null;
		},
		[anchorElement],
	);

	return (
		<Popup
			isOpen={isOpen}
			onClose={onClose}
			placement="bottom-start"
			content={renderContent}
			trigger={renderTrigger}
			// Drops this popup's own `overflow: auto`, which otherwise clips the role picker's
			// menu — it renders as a normal DOM child here (not a body portal) so it stays inside
			// this popup's focus trap.
			shouldRenderToParent
		/>
	);
}
