/* eslint-disable @repo/internal/dom-events/no-unsafe-event-listeners */
import React, { type SyntheticEvent, useCallback, useEffect } from 'react';

import { canUseDOM } from 'exenv';

import {
	createAndFireEvent,
	type CreateUIAnalyticsEvent,
	withAnalyticsContext,
	withAnalyticsEvents,
} from '@atlaskit/analytics-next';
import { UNSAFE_LAYERING, useCloseOnEscapePress } from '@atlaskit/layering';
import { fg } from '@atlaskit/platform-feature-flags';
import Portal from '@atlaskit/portal';

import Blanket from './blanket';
import DrawerPrimitive from './primitives';
import { type CloseTrigger, type DrawerProps } from './types';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

const createAndFireOnClick = (
	createAnalyticsEvent: CreateUIAnalyticsEvent,
	trigger: CloseTrigger,
) =>
	createAndFireEventOnAtlaskit({
		action: 'dismissed',
		actionSubject: 'drawer',
		attributes: {
			componentName: 'drawer',
			packageName,
			packageVersion,
			trigger,
		},
	})(createAnalyticsEvent);

// escape close manager for layering
const EscapeCloseManager = ({
	createAnalyticsEvent,
	handleClose,
}: {
	createAnalyticsEvent?: CreateUIAnalyticsEvent;
	handleClose: (event: SyntheticEvent<any>, analyticsEvent: any) => void;
}) => {
	const onClose: (e: KeyboardEvent) => void = React.useCallback(
		(event) => {
			if (handleClose) {
				const analyticsEvent =
					createAnalyticsEvent && createAndFireOnClick(createAnalyticsEvent, 'escKey');
				handleClose(event as unknown as React.KeyboardEvent, analyticsEvent);
			}
		},
		[handleClose, createAnalyticsEvent],
	);
	useCloseOnEscapePress({ onClose: onClose });
	// only create a dummy component for using ths hook in class component
	return <span />;
};

/**
 * __Drawer base__
 *
 * A drawer is a panel that slides in from the left side of the screen.
 *
 * - [Examples](https://atlassian.design/components/drawer/examples)
 * - [Code](https://atlassian.design/components/drawer/code)
 * - [Usage](https://atlassian.design/components/drawer/usage)
 */
export const DrawerBase = ({
	width = 'narrow',
	isOpen,
	isFocusLockEnabled = true,
	shouldReturnFocus = true,
	autoFocusFirstElem = true,
	onKeyDown,
	createAnalyticsEvent,
	onClose,
	testId,
	children,
	icon,
	closeLabel,
	scrollContentLabel,
	shouldUnmountOnExit,
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

	const handleClose = useCallback(
		(event: SyntheticEvent<any>, trigger: CloseTrigger) => {
			const analyticsEvent =
				createAnalyticsEvent && createAndFireOnClick(createAnalyticsEvent, trigger);

			if (onClose) {
				onClose(event, analyticsEvent);
			}
		},
		[createAnalyticsEvent, onClose],
	);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (!fg('platform.design-system-team.inline-message-layering_wfp1p')) {
				// when feature flag on, we will use the EscapeCloseManager instead
				if (event.key === 'Escape' && isOpen) {
					handleClose(event as unknown as React.KeyboardEvent, 'escKey');
				}
			}
			if (onKeyDown) {
				onKeyDown(event as unknown as React.KeyboardEvent);
			}
		};

		if (isOpen) {
			window.addEventListener('keydown', handleKeyDown);
		}

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [handleClose, isOpen, onKeyDown]);

	const handleBlanketClick = (event: SyntheticEvent<HTMLElement>) => {
		handleClose(event, 'blanket');
	};

	const handleBackButtonClick = (event: SyntheticEvent<HTMLElement>) => {
		handleClose(event, 'backButton');
	};

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
				shouldUnmountOnExit={shouldUnmountOnExit}
				// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
				overrides={overrides}
				autoFocusFirstElem={autoFocusFirstElem}
				isFocusLockEnabled={isFocusLockEnabled}
				shouldReturnFocus={shouldReturnFocus}
				scrollContentLabel={scrollContentLabel}
			>
				{isOpen && fg('platform.design-system-team.inline-message-layering_wfp1p') ? (
					<UNSAFE_LAYERING isDisabled={false}>
						{children}
						<EscapeCloseManager
							createAnalyticsEvent={createAnalyticsEvent}
							handleClose={handleClose}
						/>
					</UNSAFE_LAYERING>
				) : (
					children
				)}
			</DrawerPrimitive>
		</Portal>
	);
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
const Drawer = withAnalyticsContext({
	componentName: 'drawer',
	packageName,
	packageVersion,
})(withAnalyticsEvents()(DrawerBase));

export default Drawer;
