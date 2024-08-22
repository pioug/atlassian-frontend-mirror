import React, { useCallback, useMemo } from 'react';

import { type TriggerProps } from '@atlaskit/popup';

import { type ProfileCardTriggerProps } from './types';

export const PopupTrigger = <T,>({
	children,
	trigger,
	forwardRef,
	showProfilecard,
	hideProfilecard,
	ariaLabelledBy,
	...props
}: Partial<TriggerProps> & {
	showProfilecard: () => void;
	hideProfilecard: () => void;
	forwardRef: React.Ref<HTMLSpanElement>;
} & Pick<ProfileCardTriggerProps<T>, 'ariaLabelledBy' | 'trigger' | 'children'>) => {
	const onMouseEnter = useCallback(() => {
		showProfilecard();
	}, [showProfilecard]);

	const onKeyPress = useCallback(
		(event: React.KeyboardEvent) => {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				showProfilecard();
			}
		},
		[showProfilecard],
	);

	const onClick = useCallback(
		(event: React.MouseEvent) => {
			// If the user clicks on the trigger then we don't want that click event to
			// propagate out to parent containers. For example when clicking a mention
			// lozenge in an inline-edit.
			event.stopPropagation();
			showProfilecard();
		},
		[showProfilecard],
	);

	const containerListeners = useMemo(
		() =>
			trigger === 'hover'
				? {
						onMouseEnter: onMouseEnter,
						onMouseLeave: hideProfilecard,
						onBlur: hideProfilecard,
						onKeyPress: onKeyPress,
					}
				: {
						onClick: onClick,
						onKeyPress: onKeyPress,
					},
		[hideProfilecard, onClick, onKeyPress, onMouseEnter, trigger],
	);

	return (
		<span {...props} {...containerListeners} ref={forwardRef} aria-labelledby={ariaLabelledBy}>
			{children}
		</span>
	);
};
