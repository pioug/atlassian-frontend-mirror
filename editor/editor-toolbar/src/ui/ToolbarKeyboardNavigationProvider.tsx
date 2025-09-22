import React, { useLayoutEffect, useRef } from 'react';

import type { ToolbarKeyboardNavigationProviderConfig } from '../types';

type ToolbarKeyboardNavigationProviderProps = ToolbarKeyboardNavigationProviderConfig & {
	children: React.ReactNode;
};

export const ToolbarKeyboardNavigationProvider = ({
	children,
	childComponentSelector,
	dom,
	isShortcutToFocusToolbar,
	handleFocus,
	handleEscape,
	ariaLabel,
	ariaControls,
}: ToolbarKeyboardNavigationProviderProps) => {
	const wrapperRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		if (!wrapperRef.current) {
			return;
		}

		const { current: element } = wrapperRef;

		const handleKeyDown = (event: KeyboardEvent): void => {
			const targetElement = event.target;

			if (
				targetElement instanceof HTMLElement &&
				!targetElement.closest(`${childComponentSelector}`)
			) {
				return;
			}

			switch (event.key) {
				case 'Escape':
					handleEscape(event);
					break;
				default:
			}
		};

		const globalKeyDownHandler = (event: KeyboardEvent): void => {
			if (isShortcutToFocusToolbar && isShortcutToFocusToolbar(event)) {
				handleFocus(event);
			}
		};

		// ignored via go/ees005
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		element?.addEventListener('keydown', handleKeyDown);
		// ignored via go/ees005
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		dom?.addEventListener('keydown', globalKeyDownHandler);
		return () => {
			// ignored via go/ees005
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			element?.removeEventListener('keydown', handleKeyDown);
			// ignored via go/ees005
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			dom?.removeEventListener('keydown', globalKeyDownHandler);
		};
	}, [
		wrapperRef,
		childComponentSelector,
		dom,
		isShortcutToFocusToolbar,
		handleFocus,
		handleEscape,
	]);

	return (
		<div
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- ignored via go/DSP-18766
			className="custom-key-handler-wrapper"
			ref={wrapperRef}
			aria-label={ariaLabel}
			aria-controls={ariaControls}
		>
			{children}
		</div>
	);
};
