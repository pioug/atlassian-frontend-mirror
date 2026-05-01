/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/**
 * Shared utilities for TagNew and AvatarTag components.
 * Note: CSS styles cannot be shared due to Compiled CSS static analysis requirements.
 */
import {
	type ComponentType,
	Fragment,
	type MouseEvent as ReactMouseEvent,
	type ReactNode,
	useCallback,
	useMemo,
} from 'react';

import { css, jsx } from '@compiled/react';

import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { ExitingPersistence, ShrinkOut } from '@atlaskit/motion';

import RemoveButton from '../tag/internal/removable/remove-button';

import { TagStatus } from './tag-status';
// CSS variable names for dynamic color values
export const iconColorVar = '--ds-tag-icon';
export const borderTokenVar = '--tag-border-token';
export const iconTokenVar = '--tag-icon-token';

/**
 * Stable key so ExitingPersistence can match this child across the remove transition
 * (see ShrinkOut + ExitingPersistence docs in @atlaskit/motion).
 */
const removableShrinkOutChildKey = 'atlaskit-tag-removable-shrink-out';

const motionWrapperStyles = css({
	display: 'inline-flex',
});

// Props for the remove button hook
interface UseRemoveButtonProps {
	isRemovable: boolean;
	tagText: string;
	removeButtonLabel?: string;
	testId?: string;
	handleRemoveRequest: () => void;
	removingTag: () => void;
	showingTag: () => void;
	onKeyPress: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
	shape?: 'default' | 'circle';
	buttonHandlers?: {
		onMouseEnter: () => void;
		onMouseLeave: () => void;
		onMouseDown: (e?: ReactMouseEvent<HTMLButtonElement>) => void;
		onFocus: () => void;
		onBlur: () => void;
	};
}

// Shared hook for remove button creation
// TODO: Fill in the hook {description}.
/**
 * {description}.
 */
export function useRemoveButton({
	isRemovable,
	tagText,
	removeButtonLabel,
	testId,
	handleRemoveRequest,
	removingTag,
	showingTag,
	onKeyPress,
	shape = 'default',
	buttonHandlers,
}: UseRemoveButtonProps): ReactNode {
	const handleFocus = useCallback(() => {
		removingTag();
		buttonHandlers?.onFocus();
	}, [removingTag, buttonHandlers]);

	const handleBlur = useCallback(() => {
		showingTag();
		buttonHandlers?.onBlur();
	}, [showingTag, buttonHandlers]);

	return useMemo(() => {
		if (!isRemovable) {
			return undefined;
		}
		return (
			<RemoveButton
				aria-label={`${removeButtonLabel || 'Remove'} ${tagText}`}
				onClick={handleRemoveRequest}
				onFocus={handleFocus}
				onBlur={handleBlur}
				onKeyPress={onKeyPress}
				onMouseEnter={buttonHandlers?.onMouseEnter}
				onMouseLeave={buttonHandlers?.onMouseLeave}
				onMouseDown={buttonHandlers?.onMouseDown}
				testId={testId ? `close-button-${testId}` : undefined}
				shape={shape}
			/>
		);
	}, [
		isRemovable,
		removeButtonLabel,
		tagText,
		handleRemoveRequest,
		handleFocus,
		handleBlur,
		onKeyPress,
		buttonHandlers,
		testId,
		shape,
	]);
}

// Props for the removable wrapper
interface RemovableWrapperProps {
	isRemovable: boolean;
	status: TagStatus;
	onShrinkOutExitComplete?: () => void;
	children: ReactNode;
}

// Shared component for motion wrapper
export function RemovableWrapper({
	isRemovable,
	status,
	onShrinkOutExitComplete,
	children,
}: RemovableWrapperProps):
	| string
	| number
	| boolean
	| JSX.Element
	| Iterable<ReactNode>
	| null
	| undefined {
	if (isRemovable) {
		return (
			<ExitingPersistence>
				{!(status === TagStatus.Removed) && (
					<ShrinkOut
						key={removableShrinkOutChildKey}
						onFinish={
							onShrinkOutExitComplete
								? (phase) => {
										if (phase === 'exiting') {
											onShrinkOutExitComplete();
										}
									}
								: undefined
						}
					>
						{(motion) => (
							<span ref={motion.ref} css={motionWrapperStyles}>
								{children}
							</span>
						)}
					</ShrinkOut>
				)}
			</ExitingPersistence>
		);
	}

	return children;
}

// Props for the link wrapper
interface LinkWrapperProps {
	isLink: boolean;
	href?: string;
	LinkComponent: ComponentType<any>;
	testId?: string;
	children: ReactNode;
	onClick?: (e: React.MouseEvent<HTMLAnchorElement>, analyticsEvent: UIAnalyticsEvent) => void;
	linkHandlers?: {
		onMouseEnter: () => void;
		onMouseLeave: () => void;
		onMouseDown: () => void;
		onFocus: () => void;
		onBlur: () => void;
	};
}

// Shared component for conditional link wrapping
export function LinkWrapper({
	isLink,
	href,
	LinkComponent,
	testId,
	children,
	onClick,
	linkHandlers,
}: LinkWrapperProps): JSX.Element {
	if (isLink && href) {
		return (
			<LinkComponent
				href={href}
				testId={testId ? `${testId}--link` : undefined}
				onClick={onClick}
				onMouseEnter={linkHandlers?.onMouseEnter}
				onMouseLeave={linkHandlers?.onMouseLeave}
				onMouseDown={linkHandlers?.onMouseDown}
				onFocus={linkHandlers?.onFocus}
				onBlur={linkHandlers?.onBlur}
			>
				{children}
			</LinkComponent>
		);
	}
	return <Fragment>{children}</Fragment>;
}

export { TagStatus } from './tag-status';
export { defaultBeforeRemoveAction } from './default-before-remove-action';
export { noop } from './noop';
export { useLink } from './use-link';
export { useButtonInteraction } from './use-button-interaction';

export { useTagRemoval } from './use-tag-removal';
