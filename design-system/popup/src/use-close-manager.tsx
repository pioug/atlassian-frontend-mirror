import type React from 'react';
// eslint-disable-next-line no-duplicate-imports
import { useEffect, useRef } from 'react';

import { bind, bindAll } from 'bind-event-listener';

import noop from '@atlaskit/ds-lib/noop';
import { useLayering } from '@atlaskit/layering';
import { fg } from '@atlaskit/platform-feature-flags';

import { type CloseManagerHook } from './types';
import { isInteractiveElement } from './utils/is-element-interactive';
import { useAnimationFrame } from './utils/use-animation-frame';

export const useCloseManager = ({
	isOpen,
	onClose,
	popupRef,
	triggerRef,
	autoFocus,
	shouldDisableFocusTrap,
	shouldUseCaptureOnOutsideClick: capture,
	shouldCloseOnTab,
	shouldRenderToParent,
}: CloseManagerHook): void => {
	const { isLayerDisabled, currentLevel } = useLayering();
	const { requestFrame, cancelAllFrames } = useAnimationFrame();
	const mouseDownTarget = useRef<EventTarget | null>(null);

	useEffect(() => {
		if (!isOpen || !popupRef) {
			return noop;
		}

		const closePopup = (event: Event | React.MouseEvent | React.KeyboardEvent) => {
			if (onClose) {
				let currentLevel: string | null = null;
				if (event.target instanceof HTMLElement) {
					currentLevel =
						event.target.closest(`[data-ds--level]`)?.getAttribute('data-ds--level') ?? null;
				}
				currentLevel ? onClose(event, Number(currentLevel)) : onClose(event);
			}

			if (shouldDisableFocusTrap && fg('platform_dst_popup-disable-focuslock')) {
				// Restoring the normal focus order for trigger.
				requestFrame(() => {
					triggerRef?.setAttribute('tabindex', '0');

					if (popupRef && autoFocus) {
						popupRef.setAttribute('tabindex', '0');
					}
				});
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

			if (isLayerDisabled()) {
				if (target instanceof HTMLElement) {
					const layeredElement = target.closest?.(`[data-ds--level]`);
					if (layeredElement) {
						const closeType = layeredElement.getAttribute('[data-ds--close--type]');
						if (closeType === 'single') {
							// if the close type is single, we won't close other disabled layers when clicking outside
							return;
						}
						const levelOfClickedLayer = layeredElement.getAttribute('data-ds--level');
						if (levelOfClickedLayer && Number(levelOfClickedLayer) > currentLevel) {
							// won't trigger onClick event when we click in a higher layer.
							return;
						}
					}
				}
			}

			const isClickOnPopup = popupRef && popupRef.contains(target as Node);
			const isClickOnTrigger = triggerRef && triggerRef.contains(target as Node);
			const didClickStartInsidePopup =
				popupRef &&
				mouseDownTarget.current instanceof Node &&
				popupRef.contains(mouseDownTarget.current);

			if (!isClickOnPopup && !isClickOnTrigger && !didClickStartInsidePopup) {
				closePopup(event);
				// If there was an outside click on a non-interactive element, the focus should be on the trigger.
				if (
					document.activeElement &&
					!isInteractiveElement(document.activeElement as HTMLElement) &&
					fg('platform_dst_popup-disable-focuslock')
				) {
					triggerRef?.focus();
				}
			}
		};

		const onMouseDown = (event: MouseEvent) => {
			/**
			 * Tracking the target of the mouse down event.
			 * This is used to prevent the popup from closing when the user mouses down inside the popup, but then
			 * moves the mouse outside the popup before releasing the mouse button.
			 *
			 * This is a common user interaction - users may have mistakenly clicked on something, or changed their mind,
			 * so they try to cancel their click by moving their mouse away from what they had moused down on.
			 *
			 * Blanket uses the same technique.
			 */
			mouseDownTarget.current = event.target;
		};

		const onKeyDown = (event: KeyboardEvent | React.KeyboardEvent) => {
			if (fg('platform_dst_popup-disable-focuslock')) {
				const { key, shiftKey } = event;
				if (shiftKey && key === 'Tab' && !shouldRenderToParent) {
					if (isLayerDisabled()) {
						return;
					}
					// We need to move the focus to the popup trigger when the popup is displayed in React.Portal.
					requestFrame(() => {
						const isPopupFocusOut = popupRef && !popupRef.contains(document.activeElement);

						if (isPopupFocusOut) {
							closePopup(event);

							if (currentLevel === 1) {
								triggerRef?.focus();
							}
						}
					});
					return;
				}

				if (key === 'Tab') {
					// We have cases where we need to close the Popup on Tab press.
					// Example: DropdownMenu
					if (shouldCloseOnTab) {
						if (isLayerDisabled()) {
							return;
						}
						closePopup(event);
						return;
					}

					if (isLayerDisabled() && document.activeElement?.closest('[aria-modal]')) {
						return;
					}

					if (shouldDisableFocusTrap) {
						if (shouldRenderToParent) {
							// We need to move the focus to the previous interactive element before popup trigger
							requestFrame(() => {
								const isPopupFocusOut = popupRef && !popupRef.contains(document.activeElement);
								if (isPopupFocusOut) {
									closePopup(event);
								}
							});
						} else {
							requestFrame(() => {
								if (!document.hasFocus()) {
									closePopup(event);
								}
							});
						}
						return;
					}
				}

				if (isLayerDisabled()) {
					return;
				}

				if (key === 'Escape' || key === 'Esc') {
					if (triggerRef && autoFocus) {
						triggerRef.focus();
					}
					closePopup(event);
				}
			} else {
				if (isLayerDisabled()) {
					return;
				}
				const { key } = event;
				if (key === 'Escape' || key === 'Esc' || (shouldCloseOnTab && key === 'Tab')) {
					closePopup(event);
				}
			}
		};

		let unbind = noop;
		if (fg('popup-onclose-fix')) {
			setTimeout(() => {
				unbind = bindAll(window, [
					{
						type: 'click',
						listener: onClick,
						options: { capture },
					},
					{
						type: 'keydown',
						listener: onKeyDown,
					},
					{
						type: 'mousedown',
						listener: onMouseDown,
					},
				]);
			}, 0);
		} else {
			unbind = bindAll(window, [
				{
					type: 'click',
					listener: onClick,
					options: { capture },
				},
				{
					type: 'keydown',
					listener: onKeyDown,
				},
				{
					type: 'mousedown',
					listener: onMouseDown,
				},
			]);
		}

		// bind onBlur event listener to fix popup not close when clicking on iframe outside
		let unbindBlur = noop;
		unbindBlur = bind(window, {
			type: 'blur',
			listener: function onBlur(e: FocusEvent) {
				if (isLayerDisabled() || !(document.activeElement instanceof HTMLIFrameElement)) {
					return;
				}
				closePopup(e);
			},
		});

		return () => {
			if (fg('popup-onclose-fix')) {
				setTimeout(() => {
					unbind();
				}, 0);
			} else {
				unbind();
			}
			cancelAllFrames();
			unbindBlur();
		};
	}, [
		isOpen,
		onClose,
		popupRef,
		triggerRef,
		autoFocus,
		shouldDisableFocusTrap,
		capture,
		isLayerDisabled,
		shouldCloseOnTab,
		currentLevel,
		shouldRenderToParent,
		requestFrame,
		cancelAllFrames,
	]);
};
