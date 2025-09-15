/// <reference types="node" />
/* eslint-disable @repo/internal/dom-events/no-unsafe-event-listeners */
import React, { type SyntheticEvent, useCallback, useEffect } from 'react';

import { canUseDOM } from 'exenv';

import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next';
import { Layering, useCloseOnEscapePress } from '@atlaskit/layering';
import Portal from '@atlaskit/portal';

import Blanket from './blanket';
import { DrawerPanel } from './drawer-panel/drawer-panel';
import type { DrawerProps } from './types';

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
	testId,
	children,
	onClose,
	onCloseComplete,
	onOpenComplete,
	zIndex = 'unset',
	label,
	titleId,
	enterFrom,
}: DrawerProps) => {
	const handleClose = usePlatformLeafEventHandler({
		fn: (evt: SyntheticEvent<HTMLElement>, analyticsEvent) => onClose?.(evt, analyticsEvent),
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
		fn: (evt: SyntheticEvent<HTMLElement>, analyticsEvent) => onClose?.(evt, analyticsEvent),
		action: 'dismissed',
		componentName: 'drawer',
		packageName: process.env._PACKAGE_NAME_ as string,
		packageVersion: process.env._PACKAGE_VERSION_ as string,
		analyticsData: {
			trigger: 'blanket',
		},
	});

	const handleBackButtonClick = usePlatformLeafEventHandler({
		fn: (evt: SyntheticEvent<HTMLElement>, analyticsEvent) => onClose?.(evt, analyticsEvent),
		action: 'dismissed',
		componentName: 'drawer',
		packageName: process.env._PACKAGE_NAME_ as string,
		packageVersion: process.env._PACKAGE_VERSION_ as string,
		analyticsData: {
			trigger: 'backButton',
		},
	});

	const body = canUseDOM ? document.querySelector('body') : undefined;

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
			<DrawerPanel
				testId={testId}
				isOpen={isOpen}
				onClose={handleBackButtonClick}
				onCloseComplete={onCloseComplete}
				onOpenComplete={onOpenComplete}
				width={width}
				enterFrom={enterFrom}
				label={label}
				titleId={titleId}
				autoFocusFirstElem={autoFocusFirstElem}
				isFocusLockEnabled={isFocusLockEnabled}
				shouldReturnFocus={shouldReturnFocus}
			>
				{isOpen ? (
					<Layering isDisabled={false}>
						{children}
						<EscapeCloseManager onClose={handleClose} />
					</Layering>
				) : (
					children
				)}
			</DrawerPanel>
		</Portal>
	);
};
