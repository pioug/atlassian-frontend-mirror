// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import React, { useEffect } from 'react';

import { bind, bindAll } from 'bind-event-listener';

import noop from '@atlaskit/ds-lib/noop';
import { UNSAFE_useLayering } from '@atlaskit/layering';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { type CloseManagerHook } from './types';

export const useCloseManager = ({
	isOpen,
	onClose,
	popupRef,
	triggerRef,
	shouldUseCaptureOnOutsideClick: capture,
	shouldCloseOnTab,
}: CloseManagerHook): void => {
	const { isLayerDisabled, currentLevel } = UNSAFE_useLayering();

	useEffect(() => {
		if (!isOpen || !popupRef) {
			return noop;
		}

		const closePopup = (event: Event | React.MouseEvent | React.KeyboardEvent) => {
			if (onClose) {
				onClose(event);
			}
		};

		// This check is required for cases where components like
		// Select or DDM are placed inside a Popup. A click
		// on a MenuItem or Option would close the Popup, without registering
		// a click on DDM/Select.
		// Users would have to call `onClose` manually to close the Popup in these cases.
		// You can see the bug in action here:
		// https://codesandbox.io/s/atlaskitpopup-default-forked-2eb87?file=/example.tsx:0-1788
		const onClick = (event: MouseEvent | React.MouseEvent) => {
			const { target } = event;
			const doesDomNodeExist = document.body.contains(target as Node);

			if (!doesDomNodeExist) {
				return;
			}
			if (isLayerDisabled() && getBooleanFF('platform.design-system-team.iframe-layering_p3eb8')) {
				//if it is a disabled layer, we need to disable its click listener.
				return;
			}

			const isClickOnPopup = popupRef && popupRef.contains(target as Node);
			const isClickOnTrigger = triggerRef && triggerRef.contains(target as Node);

			if (!isClickOnPopup && !isClickOnTrigger) {
				closePopup(event);
			}
		};

		const onKeyDown = (event: KeyboardEvent | React.KeyboardEvent) => {
			if (isLayerDisabled()) {
				return;
			}
			const { key } = event;
			if (key === 'Escape' || key === 'Esc' || (shouldCloseOnTab && key === 'Tab')) {
				closePopup(event);
			}
		};

		const unbind = bindAll(window, [
			{
				type: 'click',
				listener: onClick,
				options: { capture },
			},
			{
				type: 'keydown',
				listener: onKeyDown,
			},
		]);

		// bind onBlur event listener to fix popup not close when clicking on iframe outside
		let unbindBlur = noop;
		if (getBooleanFF('platform.design-system-team.iframe-layering_p3eb8')) {
			unbindBlur = bind(window, {
				type: 'blur',
				listener: function onBlur(e: FocusEvent) {
					if (isLayerDisabled() || !(document.activeElement instanceof HTMLIFrameElement)) {
						return;
					}
					const wrapper = document.activeElement.closest('[data-ds--level]');
					if (!wrapper || currentLevel > Number(wrapper.getAttribute('data-ds--level'))) {
						closePopup(e);
					}
				},
			});
		}

		return () => {
			unbind();
			unbindBlur();
		};
	}, [
		isOpen,
		onClose,
		popupRef,
		triggerRef,
		capture,
		isLayerDisabled,
		shouldCloseOnTab,
		currentLevel,
	]);
};
