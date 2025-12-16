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
	type ReactNode,
	useCallback,
	useMemo,
	useRef,
	useState,
} from 'react';

import { jsx } from '@compiled/react';

import __noop from '@atlaskit/ds-lib/noop';
import Link from '@atlaskit/link';
import { ExitingPersistence, ShrinkOut } from '@atlaskit/motion';

import RemoveButton from '../tag/internal/removable/remove-button';

// CSS variable names for dynamic color values
export const iconColorVar = '--ds-tag-icon';
export const borderTokenVar = '--tag-border-token';
export const iconTokenVar = '--tag-icon-token';

// Tag status enum
export enum TagStatus {
	Showing = 'showing',
	Removing = 'removing',
	Removed = 'removed',
}

export const defaultBeforeRemoveAction = () => true;
export const noop = __noop;

// Shared hook for tag removal logic
// TODO: Fill in the hook {description}.
/**
 * {description}.
 */
export function useTagRemoval(
	text: string,
	onBeforeRemoveAction: (() => boolean) | undefined,
	onAfterRemoveAction: ((text: string) => void) | undefined,
) {
	const [status, setStatus] = useState<TagStatus>(TagStatus.Showing);

	const handleRemoveComplete = useCallback(() => {
		(onAfterRemoveAction ?? noop)(text);
		setStatus(TagStatus.Removed);
	}, [onAfterRemoveAction, text]);

	const handleRemoveRequest = useCallback(() => {
		const beforeAction = onBeforeRemoveAction ?? defaultBeforeRemoveAction;
		if (beforeAction()) {
			handleRemoveComplete();
		}
	}, [handleRemoveComplete, onBeforeRemoveAction]);

	const onKeyPress = useCallback(
		(e: React.KeyboardEvent<HTMLButtonElement>) => {
			const spacebarOrEnter = e.key === ' ' || e.key === 'Enter';

			if (spacebarOrEnter) {
				e.stopPropagation();
				handleRemoveRequest();
			}
		},
		[handleRemoveRequest],
	);

	const removingTag = useCallback(() => setStatus(TagStatus.Removing), []);
	const showingTag = useCallback(() => setStatus(TagStatus.Showing), []);

	return {
		status,
		handleRemoveRequest,
		onKeyPress,
		removingTag,
		showingTag,
	};
}

// useLink hook
/**
 * Shared hook for link handling
 */
export function useLink(href: string | undefined, linkComponent: ComponentType<any> | undefined) {
	const isLink = Boolean(href);
	const LinkComponent = linkComponent ?? Link;

	return { isLink, LinkComponent };
}

/**
 * Hook for tracking link/button hover/focus state (replaces CSS :has() selectors in this component)
 */
export function useButtonInteraction() {
	const [isLinkHovered, setIsLinkHovered] = useState(false);
	const [isOverButton, setIsOverButton] = useState(false);
	const [isButtonFocused, setIsButtonFocused] = useState(false);
	const [isLinkFocused, setIsLinkFocused] = useState(false);
	// Track if last interaction was via mouse (to determine keyboard vs mouse focus)
	const hadMouseDownRef = useRef(false);

	// Button handlers
	const buttonHandlers = useMemo(
		() => ({
			onMouseEnter: () => setIsOverButton(true),
			onMouseLeave: () => setIsOverButton(false),
			onMouseDown: () => {
				hadMouseDownRef.current = true;
			},
			onFocus: () => {
				// Only track keyboard focus for focus ring styles
				// If mousedown happened just before focus, it's mouse focus (not keyboard)
				if (!hadMouseDownRef.current) {
					setIsButtonFocused(true);
				}
				hadMouseDownRef.current = false;
			},
			onBlur: () => setIsButtonFocused(false),
		}),
		[],
	);

	// Link handlers - includes hover tracking
	const linkHandlers = useMemo(
		() => ({
			onMouseEnter: () => setIsLinkHovered(true),
			onMouseLeave: () => setIsLinkHovered(false),
			onMouseDown: () => {
				hadMouseDownRef.current = true;
			},
			onFocus: () => {
				// Only track keyboard focus for focus ring styles
				// If mousedown happened just before focus, it's mouse focus (not keyboard)
				if (!hadMouseDownRef.current) {
					setIsLinkFocused(true);
				}
				hadMouseDownRef.current = false;
			},
			onBlur: () => setIsLinkFocused(false),
		}),
		[],
	);

	return {
		isLinkHovered,
		isOverButton,
		isButtonFocused,
		isLinkFocused,
		buttonHandlers,
		linkHandlers,
	};
}

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
		onMouseDown: () => void;
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
	children: ReactNode;
}

// Shared component for motion wrapper
export function RemovableWrapper({ isRemovable, status, children }: RemovableWrapperProps) {
	if (isRemovable) {
		return (
			<ExitingPersistence>
				{!(status === TagStatus.Removed) && (
					<ShrinkOut>{(motion) => <span ref={motion.ref}>{children}</span>}</ShrinkOut>
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
	linkHandlers,
}: LinkWrapperProps) {
	if (isLink && href) {
		return (
			<LinkComponent
				href={href}
				testId={testId ? `${testId}--link` : undefined}
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
