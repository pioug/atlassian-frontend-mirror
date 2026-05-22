import React, { useCallback, useContext } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';
import { Reference } from '@atlaskit/popper';

import type { TriggerProps } from '../types';
import { useGetMemoizedMergedTriggerRefNew } from '../use-get-memoized-merged-trigger-ref-new';

import { IdContext } from './id-context';
import { IsOpenContext } from './is-open-context';
import { RoleContext } from './role-context';
import { SetTriggerRefContext } from './set-trigger-ref-context';
import { TriggerRefObjectContext } from './trigger-ref-object-context';
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
	const triggerRefObject = useContext(TriggerRefObjectContext);
	const isOpen = useContext(IsOpenContext);
	const getMergedTriggerRef = useGetMemoizedMergedTriggerRefNew();
	const role = useContext(RoleContext);

	// Stable ref callback — avoids creating a new function instance on every render,
	// which would cause React to detach and reattach the ref unnecessarily.
	// triggerRefObject is a MutableRefObject (from useRef) so its identity never changes,
	// meaning this callback is effectively created once per mount.
	const triggerRef = useCallback(
		(node: HTMLElement | null) => {
			triggerRefObject.current = node;
		},
		[triggerRefObject],
	);

	const ariaHasPopup = role === 'dialog' ? 'dialog' : true;

	// When the top-layer flag is on, bypass Popper's <Reference> entirely.
	// We only need to set triggerRefObject.current — no Popper ref merging needed.
	if (fg('platform-dst-top-layer')) {
		return (
			<>
				{children({
					ref: triggerRef,
					'aria-controls': id,
					'aria-expanded': isOpen,
					'aria-haspopup': ariaHasPopup,
				})}
			</>
		);
	}

	return (
		<Reference>
			{({ ref }) =>
				children({
					ref: getMergedTriggerRef(ref, setTriggerRef),
					'aria-controls': id,
					'aria-expanded': isOpen,
					'aria-haspopup': ariaHasPopup,
				})
			}
		</Reference>
	);
};
