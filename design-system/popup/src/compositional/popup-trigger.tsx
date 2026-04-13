import React, { useContext } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';
import { Reference } from '@atlaskit/popper';

import type { TriggerProps } from '../types';
import { useGetMemoizedMergedTriggerRefNew } from '../use-get-memoized-merged-trigger-ref-new';

import { IdContext } from './id-context';
import { IsOpenContext } from './is-open-context';
import { RoleContext } from './role-context';
import { SetTriggerRefContext } from './set-trigger-ref-context';
import { useEnsureIsInsidePopup } from './use-ensure-is-inside-popup';

export type PopupTriggerProps = {
	children: (props: TriggerProps) => React.ReactNode;
};

/**
 * __Popup trigger__
 *
 * Popup trigger is the component that renders the trigger for the popup.
 *
 * It must be a child of the Popup component.
 */
export const PopupTrigger = ({ children }: PopupTriggerProps): React.JSX.Element => {
	useEnsureIsInsidePopup();
	const id = useContext(IdContext);
	const setTriggerRef = useContext(SetTriggerRefContext);
	const isOpen = useContext(IsOpenContext);
	const getMergedTriggerRef = useGetMemoizedMergedTriggerRefNew();
	const role = useContext(RoleContext);

	return (
		<Reference>
			{({ ref }) =>
				children({
					ref: getMergedTriggerRef(ref, setTriggerRef),
					'aria-controls': id,
					'aria-expanded': isOpen,
					'aria-haspopup':
						role === 'dialog' && fg('platform_dst_nav4_flyout_menu_slots_close_button')
							? 'dialog'
							: true,
				})
			}
		</Reference>
	);
};
