import React from 'react';
import { getTestEmojiResource } from '@atlaskit/util-data-test/get-test-emoji-resource';
import { type EmojiProvider } from '@atlaskit/emoji';
import { renderWithIntl, mockReactDomWarningGlobal } from '../../__tests__/_testing-library';
import {
	ConnectedReactionsView,
	mapDispatchToPropsHelper,
	mapStateToPropsHelper,
} from './ConnectedReactionsView';
import {
	type Actions,
	ReactionStatus,
	type ReactionSummary,
	type StorePropInput,
} from '../../types';

describe('@atlaskit/reactions/containers/ConnectedReactionsView', () => {
	mockReactDomWarningGlobal();

	const containerAri = 'container-ari';
	const ari = 'ari';
	const reactionKey = `${containerAri}|${ari}`;

	const actions: Actions = {
		getReactions: jest.fn(),
		toggleReaction: jest.fn(),
		addReaction: jest.fn(),
		getDetailedReaction: jest.fn(),
	};

	const store: StorePropInput = new Promise((resolve) =>
		resolve({
			getReactions: jest.fn(),
			toggleReaction: jest.fn(),
			addReaction: jest.fn(),
			getDetailedReaction: jest.fn(),
			getState: jest.fn(),
			onChange: jest.fn(),
			removeOnChangeListener: jest.fn(),
			setCreateAnalyticsEvent: jest.fn(),
		}),
	);

	beforeEach(() => Object.keys(actions).forEach((key) => (actions as any)[key].mockClear()));

	describe('mapStateToPropsHelper', () => {
		it('should map empty state to notLoaded', () => {
			expect(
				mapStateToPropsHelper(containerAri, ari, false, {
					reactions: {},
					flash: {},
					particleEffectByEmoji: {},
				}),
			).toMatchObject({
				status: ReactionStatus.notLoaded,
				reactions: [],
			});
		});

		it.each([true, false])('should map ready state', (particleEffectByEmojiEnabled: boolean) => {
			const reactions: ReactionSummary[] = [];
			expect(
				mapStateToPropsHelper(containerAri, ari, particleEffectByEmojiEnabled, {
					reactions: {
						[reactionKey]: { status: ReactionStatus.ready, reactions },
					},
					flash: { [reactionKey]: { emojiA: true } },
					particleEffectByEmoji: { [reactionKey]: { emojiA: true } },
				}),
			).toEqual({
				status: ReactionStatus.ready,
				reactions,
				flash: { emojiA: true },
				particleEffectByEmoji: particleEffectByEmojiEnabled ? { emojiA: true } : {},
			});
		});

		it('should map loading state', () => {
			expect(
				mapStateToPropsHelper(containerAri, ari, true, {
					reactions: {
						[reactionKey]: { status: ReactionStatus.loading },
					},
					flash: {},
					particleEffectByEmoji: {},
				}),
			).toEqual({ status: ReactionStatus.loading, reactions: [] });
		});

		it('should map error state', () => {
			expect(
				mapStateToPropsHelper(containerAri, ari, true, {
					reactions: {
						[reactionKey]: {
							status: ReactionStatus.error,
							message: 'Failed to download reactions',
						},
					},
					flash: {},
					particleEffectByEmoji: {},
				}),
			).toEqual({ status: ReactionStatus.error, reactions: [] });
		});
	});

	describe('mapDispatchToPropsHelper', () => {
		it('should call getReactions on loadReaction', () => {
			mapDispatchToPropsHelper(actions, containerAri, ari).loadReaction();

			expect(actions.getReactions).toHaveBeenCalledTimes(1);
			expect(actions.getReactions).toHaveBeenCalledWith(containerAri, ari);
		});

		it('should call getDetailedReaction on getReactionDetails', () => {
			mapDispatchToPropsHelper(actions, containerAri, ari).getReactionDetails('emojiA');

			expect(actions.getDetailedReaction).toHaveBeenCalledTimes(1);
			expect(actions.getDetailedReaction).toHaveBeenCalledWith(containerAri, ari, 'emojiA');
		});

		const successCallBack = jest.fn();
		it('should call toggleReaction onReactionClick passing through success callback if present', () => {
			mapDispatchToPropsHelper(actions, containerAri, ari, successCallBack).onReactionClick(
				'emojiA',
			);

			expect(actions.toggleReaction).toHaveBeenCalledTimes(1);
			expect(actions.toggleReaction).toHaveBeenCalledWith(
				containerAri,
				ari,
				'emojiA',
				successCallBack,
			);
		});

		it('should call addReaction onSelection passing through success callback if present', () => {
			mapDispatchToPropsHelper(actions, containerAri, ari, successCallBack).onSelection('emojiA');

			expect(actions.addReaction).toHaveBeenCalledTimes(1);
			expect(actions.addReaction).toHaveBeenCalledWith(
				containerAri,
				ari,
				'emojiA',
				successCallBack,
			);
		});

		it('should call toggleReaction onReactionClick without passing success callback if not passed to onReactionClick', () => {
			mapDispatchToPropsHelper(actions, containerAri, ari).onReactionClick('emojiA');

			expect(actions.toggleReaction).toHaveBeenCalledTimes(1);
			expect(actions.toggleReaction).toHaveBeenCalledWith(containerAri, ari, 'emojiA');
		});

		it('should call addReaction onSelection without passing success callback if not passed to onSelection', () => {
			mapDispatchToPropsHelper(actions, containerAri, ari).onSelection('emojiA');

			expect(actions.addReaction).toHaveBeenCalledTimes(1);
			expect(actions.addReaction).toHaveBeenCalledWith(containerAri, ari, 'emojiA');
		});
	});

	it('should set createAnalyticsEvent function in the store in the componentDidMount', async () => {
		renderWithIntl(
			<ConnectedReactionsView
				store={store}
				containerAri={containerAri}
				ari={ari}
				emojiProvider={getTestEmojiResource() as Promise<EmojiProvider>}
			/>,
		);
		const _store = await Promise.resolve(store);
		expect(_store.setCreateAnalyticsEvent).toHaveBeenCalledTimes(1);
	});
});
