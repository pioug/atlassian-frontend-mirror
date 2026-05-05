import React, { useCallback, useMemo } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';
import { type TriggerProps } from '@atlaskit/popup';

import { type ProfileCardTriggerProps } from './types';

const PopupTriggerInner = <T,>(
	{
		children,
		trigger,
		showProfilecard,
		hideProfilecard,
		ariaLabelledBy,
		...props
	}: Partial<TriggerProps> & {
		showProfilecard: () => void;
		hideProfilecard: () => void;
	} & Pick<ProfileCardTriggerProps<T>, 'ariaLabelledBy' | 'trigger' | 'children'>,
	ref: React.Ref<HTMLSpanElement>,
) => {
	// rename to onMouseOver when cleaning up update_profile_card_to_open_on_mouse_over
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
			// Prevent the click event from propagating to parent containers.
			event.stopPropagation();
			showProfilecard();
		},
		[showProfilecard],
	);

	const containerListeners = useMemo(
		() =>
			trigger === 'hover'
				? {
						...(fg('update_profile_card_to_open_on_mouse_over')
							? { onMouseOver: onMouseEnter, onMouseOut: hideProfilecard }
							: { onMouseEnter, onMouseLeave: hideProfilecard }),
						onBlur: hideProfilecard,
						onKeyPress,
					}
				: {
						onClick,
						onKeyPress,
					},
		[hideProfilecard, onClick, onKeyPress, onMouseEnter, trigger],
	);

	return (
		<span {...props} {...containerListeners} ref={ref} aria-labelledby={ariaLabelledBy}>
			{children}
		</span>
	);
};

export const PopupTrigger = React.forwardRef(PopupTriggerInner) as <T>(
	props: Partial<TriggerProps> & {
		showProfilecard: () => void;
		hideProfilecard: () => void;
	} & Pick<ProfileCardTriggerProps<T>, 'ariaLabelledBy' | 'trigger' | 'children'> &
		React.RefAttributes<HTMLSpanElement>,
) => JSX.Element;
