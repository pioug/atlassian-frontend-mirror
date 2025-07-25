/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useCallback } from 'react';

import { css, jsx } from '@compiled/react';
import FocusLock from 'react-focus-lock';
import ScrollLock, { TouchScrollable } from 'react-scrolllock';

import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next';
import Blanket from '@atlaskit/blanket';
import noop from '@atlaskit/ds-lib/noop';
import { Layering } from '@atlaskit/layering';
import FadeIn from '@atlaskit/motion/fade-in';
import Portal from '@atlaskit/portal';
import { layers } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import type { ModalDialogProps } from '../../types';
import useModalStack from '../hooks/use-modal-stack';
import usePreventProgrammaticScroll from '../hooks/use-prevent-programmatic-scroll';
import type { InternalModalWrapperProps } from '../types';

import ModalDialog from './modal-dialog';

export type { ModalDialogProps };

const fillScreenStyles = css({
	width: '100vw',
	height: '100vh',

	position: 'fixed',
	insetBlockStart: token('space.0', '0'),
	insetInlineStart: token('space.0', '0'),

	overflowY: 'auto',
	WebkitOverflowScrolling: 'touch',
});

const allowlistElements = (element: HTMLElement, callback?: (element: HTMLElement) => boolean) => {
	// Allow focus to reach elements outside the modal:
	// if AUI dialog is allowListed and visible
	if (!!document.querySelector('.aui-blanket:not([hidden])')) {
		return false;
	}
	// allows to pass a callback function to allow elements be ignored by focus lock
	if (typeof callback === 'function') {
		return callback(element);
	}
	return true;
};

/**
 * __Modal wrapper__
 *
 * A modal wrapper displays content that requires user interaction, in a layer above the page.
 * This component is primary container for other modal components.
 *
 * - [Examples](https://atlassian.design/components/modal-dialog/examples)
 * - [Code](https://atlassian.design/components/modal-dialog/code)
 * - [Usage](https://atlassian.design/components/modal-dialog/usage)
 */
const InternalModalWrapper = (props: InternalModalWrapperProps) => {
	const {
		autoFocus = true,
		focusLockAllowlist,
		shouldCloseOnEscapePress = true,
		shouldCloseOnOverlayClick = true,
		shouldScrollInViewport = false,
		shouldReturnFocus = true,
		stackIndex: stackIndexOverride,
		onClose: providedOnClose,
		onStackChange = noop,
		isBlanketHidden,
		children,
		height,
		width,
		onCloseComplete,
		onOpenComplete,
		label,
		testId,
		isFullScreen,
	} = props;

	const calculatedStackIndex = useModalStack({ onStackChange });
	const stackIndex = stackIndexOverride || calculatedStackIndex;
	const isForeground = stackIndex === 0;

	// When a user supplies a ref to focus we skip auto focus via react-focus-lock
	const autoFocusLock = typeof autoFocus === 'boolean' ? autoFocus : false;

	const onCloseHandler = usePlatformLeafEventHandler({
		fn: providedOnClose || noop,
		action: 'closed',
		componentName: 'modalDialog',
		packageName: process.env._PACKAGE_NAME_!,
		packageVersion: process.env._PACKAGE_VERSION_!,
	});

	const onBlanketClicked = useCallback(
		(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			if (shouldCloseOnOverlayClick) {
				onCloseHandler(e);
			}
		},
		[shouldCloseOnOverlayClick, onCloseHandler],
	);

	// This ensures to prevent additional re-renders while nothing is passed to focusLockAllowlist explicitly.
	const allowListCallback = useCallback(
		(element: HTMLElement) => allowlistElements(element, focusLockAllowlist),
		[focusLockAllowlist],
	);

	usePreventProgrammaticScroll();

	const modalDialogWithBlanket = (
		<Blanket
			isTinted={!isBlanketHidden}
			onBlanketClicked={onBlanketClicked}
			testId={testId && `${testId}--blanket`}
		>
			<ModalDialog
				testId={testId}
				label={label}
				autoFocus={autoFocus}
				stackIndex={stackIndex}
				onClose={onCloseHandler}
				shouldCloseOnEscapePress={shouldCloseOnEscapePress && isForeground}
				shouldScrollInViewport={shouldScrollInViewport}
				height={height}
				width={width}
				onCloseComplete={onCloseComplete}
				onOpenComplete={onOpenComplete}
				hasProvidedOnClose={Boolean(providedOnClose)}
				isFullScreen={isFullScreen}
			>
				{children}
			</ModalDialog>
		</Blanket>
	);

	let returnFocus = true;
	let onDeactivation: (node: HTMLElement) => void;

	if ('boolean' === typeof shouldReturnFocus) {
		returnFocus = shouldReturnFocus;
	} else {
		onDeactivation = () => {
			window.setTimeout(() => {
				shouldReturnFocus.current?.focus();
			}, 0);
		};
	}

	return (
		<Layering isDisabled={false}>
			<Portal zIndex={layers.modal()}>
				<FadeIn>
					{(fadeInProps) => (
						<div
							{...fadeInProps}
							css={fillScreenStyles}
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
							className={fadeInProps.className}
							aria-hidden={!isForeground}
						>
							<FocusLock
								autoFocus={autoFocusLock}
								returnFocus={returnFocus}
								onDeactivation={onDeactivation}
								whiteList={allowListCallback}
							>
								{/* Ensures scroll events are blocked on the document body and locked */}
								<ScrollLock />
								{/* TouchScrollable makes the whole modal dialog scrollable when scroll boundary is set to viewport. */}
								{shouldScrollInViewport ? (
									<TouchScrollable>{modalDialogWithBlanket}</TouchScrollable>
								) : (
									modalDialogWithBlanket
								)}
							</FocusLock>
						</div>
					)}
				</FadeIn>
			</Portal>
		</Layering>
	);
};

export default InternalModalWrapper;
