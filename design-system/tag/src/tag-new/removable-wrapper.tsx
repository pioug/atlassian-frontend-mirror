/**
 * Shared utilities for TagNew and AvatarTag components.
 * Note: CSS styles cannot be shared due to Compiled CSS static analysis requirements.
 */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

import { ExitingPersistence, ShrinkOut } from '@atlaskit/motion';

import { TagStatus } from './tag-status';

/**
 * Stable key so ExitingPersistence can match this child across the remove transition
 * (see ShrinkOut + ExitingPersistence docs in @atlaskit/motion).
 */
const removableShrinkOutChildKey = 'atlaskit-tag-removable-shrink-out';

const motionWrapperStyles = css({
	display: 'inline-flex',
});

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
