import { type default as React, type RefObject } from 'react';

import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';

export type WidthNames = 'small' | 'medium' | 'large' | 'x-large';

export type KeyboardOrMouseEvent = React.MouseEvent<any> | React.KeyboardEvent<any> | KeyboardEvent;

export type Appearance = 'danger' | 'warning';

export type OnCloseHandler = (e: KeyboardOrMouseEvent, analyticEvent: UIAnalyticsEvent) => void;

export type OnCloseCompleteHandler = (element: HTMLElement) => void;

export type OnOpenCompleteHandler = (node: HTMLElement, isAppearing: boolean) => void;

export type OnStackChangeHandler = (stackIndex: number) => void;

export type { ModalHeaderProps } from './modal-header';
export type { ModalTitleProps } from './modal-title';
export type { ModalBodyProps } from './modal-body';
export type { ModalFooterProps } from './modal-footer';

export type { ModalAttributes } from './internal/context';

export interface ModalDialogProps {
	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required
	/**
	 * Focus is moved to the first interactive element inside the modal dialog
	 * when `true`. It is not recommended to set to `false` as this creates
	 * accessibility regressions. Pass an element `ref` to focus on a specific element.
	 *
	 * Default value is `true`.
	 *
	 * @deprecated {@link https://hello.jira.atlassian.cloud/browse/ENGHEALTH-28588 Learn more about why `false` should not be used and will be removed.}
	 */
	autoFocus?: boolean | RefObject<HTMLElement | null | undefined>;

	/**
	 * Contents of the modal dialog.
	 */
	children?: React.ReactNode;

	/**
	 * Callback function which lets you allowlist nodes so they can be interacted with outside of the focus lock.
	 * Return `true` if focus lock should handle element, `false` if not.
	 */
	focusLockAllowlist?: (element: HTMLElement) => boolean;

	/**
	 * Height of the modal dialog.
	 * When unset the modal dialog will grow to fill the viewport and then start overflowing its contents.
	 */
	height?: number | string;

	/**
	 * Width of the modal dialog.
	 * The recommended way to specify modal width is using named size options.
	 */
	width?: number | string | WidthNames;

	/**
	 * Callback function called when the modal dialog is requesting to be closed.
	 */
	onClose?: OnCloseHandler;

	/**
	 * Callback function called when the modal dialog has finished closing.
	 */
	onCloseComplete?: OnCloseCompleteHandler;

	/**
	 * Callback function called when the modal dialog has finished opening.
	 */
	onOpenComplete?: OnOpenCompleteHandler;

	/**
	 * Callback function called when the modal changes position in the stack.
	 */
	onStackChange?: OnStackChangeHandler;

	/**
	 * Will set the scroll boundary to the viewport.
	 * If set to false, the scroll boundary is set to the modal dialog body.
	 */
	shouldScrollInViewport?: boolean;

	/**
	 * Calls `onClose` when clicking the blanket behind the modal dialog.
	 */
	shouldCloseOnOverlayClick?: boolean;

	/**
	 * Calls `onClose` when pressing escape.
	 */
	shouldCloseOnEscapePress?: boolean;

	/**
	 * ReturnFocus controls what happens when the user exits
	 * focus lock mode. If true, focus returns to the element that had focus before focus lock
	 * was activated. If false, focus remains where it was when the FocusLock was deactivated.
	 * If ref is passed, focus returns to that specific ref element.
	 */
	shouldReturnFocus?: boolean | RefObject<HTMLElement>;

	/**
	 * Will remove the blanket tinted background color.
	 */
	isBlanketHidden?: boolean;

	/**
	 * The stackIndex is a reference to the position (index) of the calling dialog in a modal dialog stack.
	 * New modals added to the stack receive the highest stack index of 0. As more modals are added to the stack, their index is dynamically increased according to their new position.
	 * Don't alter the modal stack position using `stackIndex` in implementations of third-party libraries (e.g. AUI modal), it may lead to unpredictable bugs, especially if the third party library has its own focus lock.
	 * Additionally, each modal in the stack gets a vertical offset based on `stackIndex` value.
	 */
	stackIndex?: number;

	/**
	 * The label of the modal dialog that is announced to users of assistive
	 * technology. This should only be used if there is no modal title being
	 * associated to your modal, either via using the modal title component or the
	 * `titleId` prop within the `useModal` context.
	 */
	label?: string;

	/**
	 * A `testId` prop is provided for specified elements,
	 * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 * If not overridden using `testId` prop in the respective components, this will set `data-testid` on these elements when defined:
	 * - Modal dialog: `{testId}`
	 * - Modal header: `{testId}--header`
	 * - Close button: `{testId}--close-button`
	 * - Modal title: `{testId}--title`
	 * - Modal body: `{testId}--body`
	 * - Modal footer: `{testId}--footer`
	 * - Scrollable element: `{testId}--scrollable`
	 * - Blanket: `{testId}--blanket`
	 */
	testId?: string;
}
