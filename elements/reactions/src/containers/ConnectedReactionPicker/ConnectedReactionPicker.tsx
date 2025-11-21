import React from 'react';
import { type ReactionPickerProps, UfoErrorBoundary } from '../../components';
import { type StorePropInput } from '../../types';
import { PickerRender } from '../../ufo';

import { ReactionPicker } from '../../components/ReactionPicker';
export interface ConnectedReactionPickerProps extends Omit<ReactionPickerProps, 'onSelection'> {
	/**
	 * Individual id for a reaction
	 */
	ari: string;
	/**
	 * Wrapper id for reactions list
	 */
	containerAri: string;
	/**
	 * Reference to the store.
	 * @remarks
	 * This was initially implemented with a sync and Async versions and will be replaced with just a sync Store in a future release (Please use only the sync version)
	 */
	store: StorePropInput;
}

/**
 * Reaction Picker component
 */
export const ConnectedReactionPicker = (
	props: React.PropsWithChildren<ConnectedReactionPickerProps>,
): React.JSX.Element => {
	const { store, containerAri, ari } = props;
	/**
	 * callback event when an emoji item is selected
	 * @param emojiId unique id for the reaction emoji
	 */
	const onSelection = (emojiId: string) => {
		(async () => {
			const _store = await Promise.resolve(store);
			_store.addReaction(containerAri, ari, emojiId);
		})();
	};

	return (
		<UfoErrorBoundary experiences={[PickerRender]}>
			<ReactionPicker {...props} onSelection={onSelection} />
		</UfoErrorBoundary>
	);
};
