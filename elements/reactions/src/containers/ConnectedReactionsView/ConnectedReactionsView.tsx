import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { type WithSamplingUFOExperience } from '@atlaskit/emoji';
import { FabricElementsAnalyticsContext } from '@atlaskit/analytics-namespaced-context';
import { useAnalyticsEvents } from '@atlaskit/analytics-next';

import { UfoErrorBoundary, type ReactionsProps, type ReactionPickerProps } from '../../components';
import { Reactions } from '../../components/Reactions';
import { ufoExperiences } from '../../store';
import {
	ReactionStatus,
	type Actions,
	type State,
	type StorePropInput,
	type OnChangeCallback,
	type Store,
} from '../../types';
import { type ReactionUpdateSuccess } from '../../types/reaction';

export interface ConnectedReactionsViewProps
	extends Pick<
			ReactionsProps,
			| 'quickReactionEmojis'
			| 'onDialogOpenCallback'
			| 'onDialogCloseCallback'
			| 'onDialogSelectReactionCallback'
			| 'allowUserDialog'
			| 'allowAllEmojis'
			| 'emojiProvider'
			| 'emojiPickerSize'
			| 'miniMode'
			| 'summaryViewEnabled'
			| 'subtleReactionsSummaryAndPicker'
			| 'onlyRenderPicker'
			| 'isViewOnly'
			| 'allowSelectFromSummaryView'
			| 'reactionPickerPopperZIndex'
		>,
		Pick<ReactionPickerProps, 'pickerQuickReactionEmojiIds'> {
	/**
	 * Individual id for a reaction
	 */
	ari: string;
	/**
	 * Wrapper id for reactions list
	 */
	containerAri: string;
	/**
	 * Callback function when a reaction is successfully added
	 */
	onReactionSuccess?: ReactionUpdateSuccess;
	/**
	 * Optional boolean to control if particle animation on reactions appear
	 */
	particleEffectByEmojiEnabled?: boolean;

	/**
	 * Reference to the store.
	 * @remarks
	 * This was initially implemented with a sync and Async versions and will be replaced with just a sync Store in a future release (Please use only the sync version)
	 */
	store: StorePropInput;
}

/**
 * State Props required for <Reactions />
 */
type StateProps = Pick<ReactionsProps, 'reactions' | 'status' | 'flash' | 'particleEffectByEmoji'>;
/**
 * Dispatch Props required for <Reactions />
 */
type DispatchProps = Pick<
	ReactionsProps,
	'getReactionDetails' | 'onReactionClick' | 'onSelection' | 'loadReaction'
>;

/**
 * Export the mapper function outside the component so easier to do unit tests
 */
export const mapStateToPropsHelper = (
	containerAri: string,
	ari: string,
	particleEffectByEmojiEnabled?: boolean,
	state?: State,
) => {
	const reactionsState = state && state.reactions[`${containerAri}|${ari}`];

	if (!state || !reactionsState) {
		return { status: ReactionStatus.notLoaded, reactions: [] };
	}
	switch (reactionsState.status) {
		case ReactionStatus.ready:
			return {
				reactions: reactionsState.reactions,
				status: reactionsState.status,
				flash: state.flash[`${containerAri}|${ari}`],
				particleEffectByEmoji: particleEffectByEmojiEnabled
					? state.particleEffectByEmoji[`${containerAri}|${ari}`]
					: {},
			};
		case ReactionStatus.error:
			return {
				status: ReactionStatus.error,
				reactions: [],
			};
		default:
			return { status: ReactionStatus.loading, reactions: [] };
	}
};

/**
 * Export the mapper function outside the component so easier to do unit tests
 */
export const mapDispatchToPropsHelper = (
	actions: Actions,
	containerAri: string,
	ari: string,
	successCallBack?: ReactionUpdateSuccess,
) => {
	return {
		loadReaction: (): void => {
			actions.getReactions(containerAri, ari);
		},
		onReactionClick: (emojiId: string): void => {
			if (successCallBack) {
				actions.toggleReaction(containerAri, ari, emojiId, successCallBack);
				return;
			}
			actions.toggleReaction(containerAri, ari, emojiId);
		},
		getReactionDetails: (emojiId: string): void => {
			actions.getDetailedReaction(containerAri, ari, emojiId);
		},
		onSelection: (emojiId: string): void => {
			if (successCallBack) {
				actions.addReaction(containerAri, ari, emojiId, successCallBack);
				return;
			}
			actions.addReaction(containerAri, ari, emojiId);
		},
	};
};

export const ConnectedReactionsView = (
	props: React.PropsWithChildren<ConnectedReactionsViewProps>,
): React.JSX.Element => {
	const { ari, containerAri, store, particleEffectByEmojiEnabled, onReactionSuccess, ...rest } =
		props;
	/**
	 * Reference to the <Reactions /> component instance mandatory props
	 */
	const [stateData, setStateData] = useState<StateProps>();
	const [dispatchData, setDispatchData] = useState<DispatchProps>();
	// compose a UFO experience object
	const experienceInstance = useRef<WithSamplingUFOExperience>();
	const { createAnalyticsEvent } = useAnalyticsEvents();

	useEffect(() => {
		experienceInstance.current = ufoExperiences.render(ari);
	}, [ari]);

	// abort when component gets unmounted
	useEffect(() => {
		return function cleanup() {
			experienceInstance.current?.abort({
				metadata: {
					source: 'ConnectedReactionsView',
					ari,
					containerAri,
					reason: 'unmount',
				},
			});
		};
	}, [experienceInstance, containerAri, ari]);

	/**
	 * Maps the store instance "reactions" data to the <Reactions /> component state data
	 * @param state store instance latest data
	 */
	const mapStateToProps: (state?: State) => StateProps = useCallback(
		(state) => {
			return mapStateToPropsHelper(containerAri, ari, particleEffectByEmojiEnabled, state);
		},
		[containerAri, ari, particleEffectByEmojiEnabled],
	);

	/**
	 * Map the store instance "actions" methods to the <Reactions /> component actions methods
	 * @param actions list of actions in the store instance
	 */
	const mapDispatchToProps: (actions: Actions) => DispatchProps = useCallback(
		(actions) => {
			return mapDispatchToPropsHelper(actions, containerAri, ari, onReactionSuccess);
		},
		[ari, containerAri, onReactionSuccess],
	);

	const resolveStore = useCallback(
		(store: Store) => {
			if (store.setCreateAnalyticsEvent && createAnalyticsEvent) {
				store.setCreateAnalyticsEvent(createAnalyticsEvent);
			}

			const state = mapStateToProps(store.getState());
			const dispatch = mapDispatchToProps(store);
			setStateData(state);
			setDispatchData(dispatch);
		},
		[createAnalyticsEvent, mapDispatchToProps, mapStateToProps],
	);

	useMemo(() => {
		if (!('then' in store)) {
			// Store is not a Promise
			resolveStore(store);
		}
	}, [store, resolveStore]);

	useEffect(() => {
		(async () => {
			if ('then' in store) {
				// Store is a Promise
				const _store = await Promise.resolve(store);
				resolveStore(_store);
			}
		})();
	}, [store, resolveStore]);

	/**
	 * Listen to changes on the store data.
	 * TODO: Needs to be refactored inside the MemoryReactionsStore to different pattern, currently it relies on internal callbacks variable to trigger changes to the store.
	 * The flow that each action method triggers a call to "setState" => "triggerOnChange" => calls the callback function registered by the onChange method and de-register by the "removeOnChangeListener" method
	 */
	useEffect(() => {
		const onChangeCallback: OnChangeCallback = (state) => {
			const stateProps = mapStateToProps(state);
			setStateData(stateProps);
		};

		(async () => {
			const _store = await Promise.resolve(store);
			_store.onChange(onChangeCallback);
		})();

		return function cleanup() {
			(async () => {
				const _store = await Promise.resolve(store);
				_store.removeOnChangeListener(onChangeCallback);
			})();
		};
	}, [mapStateToProps, store]);

	return (
		<FabricElementsAnalyticsContext data={{ containerAri, ari }}>
			<UfoErrorBoundary
				experiences={experienceInstance.current ? [experienceInstance.current] : []}
			>
				{stateData && dispatchData && (
					<Reactions key={`${containerAri}|${ari}`} {...rest} {...dispatchData} {...stateData} />
				)}
			</UfoErrorBoundary>
		</FabricElementsAnalyticsContext>
	);
};
