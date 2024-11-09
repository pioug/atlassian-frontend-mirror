/* eslint-disable @repo/internal/dom-events/no-unsafe-event-listeners */
import React, { type SyntheticEvent, useCallback, useEffect } from 'react';

import { canUseDOM } from 'exenv';

import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next';
import { Layering, useCloseOnEscapePress } from '@atlaskit/layering';
import Portal from '@atlaskit/portal';

import Blanket from './blanket';
import DrawerPrimitive from './primitives';
import { type DrawerProps } from './types';

// escape close manager for layering
const EscapeCloseManager = ({ onClose }: { onClose?: (event: SyntheticEvent<any>) => void }) => {
	// wrap so that we can cast the event to a React.KeyboardEvent
	const handleClose = useCallback(
		(evt: KeyboardEvent) => {
			onClose && onClose(evt as unknown as React.KeyboardEvent);
		},
		[onClose],
	);

	useCloseOnEscapePress({ onClose: handleClose });

	return <span />;
};

/**
 * __Drawer__
 *
 * A drawer is a panel that slides in from the left side of the screen.
 *
 * - [Examples](https://atlassian.design/components/drawer/examples)
 * - [Code](https://atlassian.design/components/drawer/code)
 * - [Usage](https://atlassian.design/components/drawer/usage)
 */
export const Drawer = ({
	width = 'narrow',
	isOpen,
	isFocusLockEnabled = true,
	shouldReturnFocus = true,
	autoFocusFirstElem = true,
	onKeyDown,
	onClose,
	testId,
	children,
	icon,
	closeLabel,
	scrollContentLabel,
	onCloseComplete,
	onOpenComplete,
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	overrides,
	zIndex = 'unset',
	label,
	titleId,
	enterFrom,
}: DrawerProps) => {
	const body = canUseDOM ? document.querySelector('body') : undefined;

	const handleClose = usePlatformLeafEventHandler({
		fn: (evt: SyntheticEvent<HTMLElement>, analyticsEvent) =>
			onClose && onClose(evt, analyticsEvent),
		action: 'dismissed',
		componentName: 'drawer',
		packageName: process.env._PACKAGE_NAME_ as string,
		packageVersion: process.env._PACKAGE_VERSION_ as string,
		analyticsData: {
			trigger: 'escKey',
		},
	});

	const handleKeyDown = useCallback(
		(evt: KeyboardEvent) => {
			onKeyDown && onKeyDown(evt as unknown as SyntheticEvent);
		},
		[onKeyDown],
	);

	useEffect(() => {
		if (isOpen) {
			window.addEventListener('keydown', handleKeyDown);
		}

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [handleKeyDown, isOpen]);

	const handleBlanketClick = usePlatformLeafEventHandler({
		fn: (evt: SyntheticEvent<HTMLElement>, analyticsEvent) =>
			onClose && onClose(evt, analyticsEvent),
		action: 'dismissed',
		componentName: 'drawer',
		packageName: process.env._PACKAGE_NAME_ as string,
		packageVersion: process.env._PACKAGE_VERSION_ as string,
		analyticsData: {
			trigger: 'blanket',
		},
	});

	const handleBackButtonClick = usePlatformLeafEventHandler({
		fn: (evt: SyntheticEvent<HTMLElement>, analyticsEvent) =>
			onClose && onClose(evt, analyticsEvent),
		action: 'dismissed',
		componentName: 'drawer',
		packageName: process.env._PACKAGE_NAME_ as string,
		packageVersion: process.env._PACKAGE_VERSION_ as string,
		analyticsData: {
			trigger: 'backButton',
		},
	});

	if (!body) {
		return null;
	}

	return (
		<Portal zIndex={zIndex}>
			<Blanket
				isOpen={isOpen}
				onBlanketClicked={handleBlanketClick}
				testId={testId && `${testId}--blanket`}
			/>
			<DrawerPrimitive
				testId={testId}
				icon={icon}
				closeLabel={closeLabel}
				in={isOpen}
				onClose={handleBackButtonClick}
				onCloseComplete={onCloseComplete}
				onOpenComplete={onOpenComplete}
				width={width}
				enterFrom={enterFrom}
				label={label}
				titleId={titleId}
				// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
				overrides={overrides}
				autoFocusFirstElem={autoFocusFirstElem}
				isFocusLockEnabled={isFocusLockEnabled}
				shouldReturnFocus={shouldReturnFocus}
				scrollContentLabel={scrollContentLabel}
			>
				{isOpen ? (
					<Layering isDisabled={false}>
						{children}
						<EscapeCloseManager onClose={handleClose} />
					</Layering>
				) : (
					children
				)}
			</DrawerPrimitive>
		</Portal>
	);
};

export default Drawer;
