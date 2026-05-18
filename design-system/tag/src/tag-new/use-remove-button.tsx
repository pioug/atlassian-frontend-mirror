/**
 * Shared utilities for TagNew and AvatarTag components.
 * Note: CSS styles cannot be shared due to Compiled CSS static analysis requirements.
 */
import React, {
	type MouseEvent as ReactMouseEvent,
	type ReactNode,
	useCallback,
	useMemo,
} from 'react';

import RemoveButton from '../tag/internal/removable/remove-button';

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
