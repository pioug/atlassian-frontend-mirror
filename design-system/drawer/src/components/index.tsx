/* eslint-disable @repo/internal/dom-events/no-unsafe-event-listeners */
import React, { Component, type SyntheticEvent } from 'react';

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

import { defaultFocusLockSettings } from '../constants';

import Blanket from './blanket';
import DrawerPrimitive from './primitives';
import { type CloseTrigger, type DrawerProps, type DrawerWidth } from './types';

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

export class DrawerBase extends Component<DrawerProps, { renderPortal: boolean }> {
	static defaultProps = {
		width: 'narrow' as DrawerWidth,
		...defaultFocusLockSettings,
	};

	state = {
		renderPortal: false,
	};

	body = canUseDOM ? document.querySelector('body') : undefined;

	componentDidMount() {
		const { isOpen } = this.props;

		if (isOpen) {
			window.addEventListener('keydown', this.handleKeyDown);
		}
	}

	componentWillUnmount() {
		window.removeEventListener('keydown', this.handleKeyDown);
	}

	componentDidUpdate(prevProps: DrawerProps) {
		const { isOpen } = this.props;
		if (isOpen !== prevProps.isOpen) {
			if (isOpen) {
				window.addEventListener('keydown', this.handleKeyDown);
			} else {
				window.removeEventListener('keydown', this.handleKeyDown);
			}
		}
	}

	private handleBlanketClick = (event: SyntheticEvent<HTMLElement>) => {
		this.handleClose(event, 'blanket');
	};

	private handleBackButtonClick = (event: SyntheticEvent<HTMLElement>) => {
		this.handleClose(event, 'backButton');
	};

	private handleClose = (event: SyntheticEvent<any>, trigger: CloseTrigger) => {
		const { createAnalyticsEvent, onClose } = this.props;

		const analyticsEvent =
			createAnalyticsEvent && createAndFireOnClick(createAnalyticsEvent, trigger);

		if (onClose) {
			onClose(event, analyticsEvent);
		}
	};

	handleKeyDown = (event: KeyboardEvent) => {
		const { isOpen, onKeyDown } = this.props;

		if (!fg('platform.design-system-team.inline-message-layering_wfp1p')) {
			// when feature flag on, we will use the EscapeCloseManager instead
			if (event.key === 'Escape' && isOpen) {
				this.handleClose(event as unknown as React.KeyboardEvent, 'escKey');
			}
		}
		if (onKeyDown) {
			onKeyDown(event as unknown as React.KeyboardEvent);
		}
	};

	render() {
		if (!this.body) {
			return null;
		}
		const {
			testId,
			isOpen,
			children,
			icon,
			closeLabel,
			scrollContentLabel,
			width,
			shouldUnmountOnExit,
			onCloseComplete,
			onOpenComplete,
			autoFocusFirstElem,
			isFocusLockEnabled,
			shouldReturnFocus,
			overrides,
			zIndex = 'unset',
			label,
			titleId,
			enterFrom,
		} = this.props;

		const shouldHaveLayeringEnabled =
			fg('platform.design-system-team.inline-message-layering_wfp1p') && isOpen;

		return (
			<Portal zIndex={zIndex}>
				<Blanket
					isOpen={isOpen}
					onBlanketClicked={this.handleBlanketClick}
					testId={testId && `${testId}--blanket`}
				/>
				<DrawerPrimitive
					testId={testId}
					icon={icon}
					closeLabel={closeLabel}
					in={isOpen}
					onClose={this.handleBackButtonClick}
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
					{shouldHaveLayeringEnabled ? (
						<UNSAFE_LAYERING isDisabled={false}>
							{children}
							<EscapeCloseManager
								createAnalyticsEvent={this.props.createAnalyticsEvent}
								handleClose={this.handleClose}
							/>
						</UNSAFE_LAYERING>
					) : (
						children
					)}
				</DrawerPrimitive>
			</Portal>
		);
	}
}

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
