import { useCallback, useState } from 'react';

import { defaultBeforeRemoveAction } from './default-before-remove-action';
import { TagStatus } from './tag-status';

/**
 * {description}.
 */
export function useTagRemoval(onBeforeRemoveAction: (() => boolean) | undefined): {
	status: TagStatus;
	handleRemoveRequest: () => void;
	onKeyPress: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
	removingTag: () => void;
	showingTag: () => void;
} {
	const [status, setStatus] = useState<TagStatus>(TagStatus.Showing);

	const handleRemoveRequest = useCallback((): void => {
		const beforeAction = onBeforeRemoveAction ?? defaultBeforeRemoveAction;
		if (beforeAction()) {
			// Defer onAfterRemoveAction until ShrinkOut's onFinish so ExitingPersistence can run
			// the exit animation (e.g. in multi-select and user pickers).
			setStatus(TagStatus.Removed);
		}
	}, [onBeforeRemoveAction]);

	const onKeyPress = useCallback(
		(e: React.KeyboardEvent<HTMLButtonElement>): void => {
			const spacebarOrEnter = e.key === ' ' || e.key === 'Enter';

			if (spacebarOrEnter) {
				e.stopPropagation();
				handleRemoveRequest();
			}
		},
		[handleRemoveRequest],
	);

	const removingTag = useCallback((): void => setStatus(TagStatus.Removing), []);
	const showingTag = useCallback((): void => setStatus(TagStatus.Showing), []);

	return {
		status,
		handleRemoveRequest,
		onKeyPress,
		removingTag,
		showingTag,
	};
}
