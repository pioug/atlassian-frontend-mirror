/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useContext, useEffect, useRef } from 'react';

import { cssMap, jsx } from '@compiled/react';

import Heading from '@atlaskit/heading/heading';
import { Flex } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { CloseButton } from './close-button';
import {
	InitialFocusOriginContext,
	IsOpenContext,
	OnCloseContext,
	SetInitialFocusRefContext,
	useTitleId,
} from './flyout-menu-item-context';

const headerStyles = cssMap({
	root: {
		paddingInlineStart: token('space.050'),
		paddingBlockEnd: token('space.025'),
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.075'),
	},
	hasChildren: {
		paddingBlockEnd: token('space.050'),
	},
	flex: {
		justifyContent: 'space-between',
		gap: token('space.200'),
		flexDirection: 'row-reverse',
		alignItems: 'center',
		width: '100%',
		paddingInlineStart: token('space.025'),
	},
});

export interface FlyoutHeaderProps {
	/**
	 * Requests initial focus on the close button when the flyout opens or the
	 * header becomes available, without interrupting focus on another control.
	 * A control focused during loading keeps focus, including when the popup
	 * focused it automatically. Top-layer focuses the first loading control;
	 * the legacy popup focuses its container, allowing Close to take focus later.
	 * When false, the popup's default focus behavior is preserved.
	 *
	 * @default false
	 */
	autoFocusCloseButton?: boolean;

	/**
	 * The actions to display within the flyout header.
	 */
	children?: React.ReactNode;

	/**
	 * The accessible label for the close button in the flyout header.
	 *
	 * Used as the aria-label for the close button to ensure screen reader
	 * accessibility.
	 */
	closeButtonLabel: string;

	/**
	 * A unique string that appears as data attribute data-testid in the
	 * rendered code, serving as a hook for automated tests.
	 */
	testId?: string;

	/**
	 * The title of the flyout menu.
	 */
	title: string;
}

/**
 * __FlyoutHeader__
 *
 * The header section of a flyout menu. This component displays the title, and
 * close button, as well as any other provided actions relevant to the menu.
 * This component should be placed first within the FlyoutMenuItemContent.
 */
export const FlyoutHeader = (props: FlyoutHeaderProps): JSX.Element => {
	const { autoFocusCloseButton, children, testId, title, closeButtonLabel } = props;

	const id = useTitleId();
	const onCloseRef = useContext(OnCloseContext);
	const setInitialFocusRef = useContext(SetInitialFocusRefContext);
	const initialFocusOriginRef = useContext(InitialFocusOriginContext);
	const isOpen = useContext(IsOpenContext);
	const closeButtonRef = useRef<HTMLButtonElement | null>(null);
	const hasHandledInitialFocus = useRef(false);
	const focusCloseButton = useCallback(
		(button: HTMLButtonElement) => {
			if (!autoFocusCloseButton || !isOpen || hasHandledInitialFocus.current) {
				return;
			}
			// Ref callbacks can reattach during rerenders. Initialization must not
			// reclaim focus after the user starts interacting with the flyout.
			hasHandledInitialFocus.current = true;

			const dialog = button.closest('[role="dialog"]');
			const activeElement = button.ownerDocument.activeElement;
			const shouldPreserveCurrentFocus =
				activeElement !== dialog &&
				(dialog?.contains(activeElement) ||
					(initialFocusOriginRef?.current && activeElement !== initialFocusOriginRef.current));
			if (shouldPreserveCurrentFocus) {
				// Do not register a new target either: that would restart the legacy
				// focus trap and interrupt the user's focus through a different path.
				return;
			}

			if (setInitialFocusRef && activeElement !== dialog) {
				setInitialFocusRef(button);
			} else {
				// Lazy content arrived after the popup took focus. Keep the existing trap
				// and its return target instead of restarting it with a new initial target.
				button.focus();
			}
		},
		[autoFocusCloseButton, initialFocusOriginRef, isOpen, setInitialFocusRef],
	);
	const handleInitialFocus = useCallback(
		(button: HTMLButtonElement | null) => {
			closeButtonRef.current = button;
			if (button && setInitialFocusRef) {
				focusCloseButton(button);
			}
		},
		[focusCloseButton, setInitialFocusRef],
	);

	useEffect(() => {
		if (!isOpen) {
			hasHandledInitialFocus.current = false;
			return;
		}
		if (!setInitialFocusRef && closeButtonRef.current) {
			// Top-layer content is visible after layout effects. Its open-time focus
			// selection does not run again when a delayed header arrives.
			focusCloseButton(closeButtonRef.current);
		}
	}, [focusCloseButton, isOpen, setInitialFocusRef]);

	const handleClose = useCallback(
		(event: React.MouseEvent<HTMLButtonElement>) => {
			onCloseRef.current?.(event, 'close-button');
		},
		[onCloseRef],
	);

	return (
		<div
			css={[headerStyles.root, Boolean(children) && headerStyles.hasChildren]}
			data-testid={testId}
		>
			{
				// The reason we are putting the close button first in the DOM and then
				// reordering them is to ensure that users of assistive technology get
				// all the context of a modal when initial focus is placed on the close
				// button, since it's the first interactive element.
			}
			<Flex xcss={headerStyles.flex}>
				<CloseButton
					ref={autoFocusCloseButton ? handleInitialFocus : undefined}
					label={closeButtonLabel}
					onClick={handleClose}
					testId={testId && `${testId}--close-button`}
				/>
				<Heading size="xsmall" as="h2" id={id}>
					{title}
				</Heading>
			</Flex>
			{children}
		</div>
	);
};
