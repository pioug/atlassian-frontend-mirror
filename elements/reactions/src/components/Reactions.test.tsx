import React from 'react';
import { act, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { type EmojiProvider } from '@atlaskit/emoji';
import { getTestEmojiResource } from '@atlaskit/util-data-test/get-test-emoji-resource';

import { getReactionSummary, ari, containerAri } from '../MockReactionsClient';
import { mockReactDomWarningGlobal, renderWithIntl } from '../__tests__/_testing-library';
import type { FakeUFOInstance } from '../__tests__/_testing-library';
import { DefaultReactions } from '../shared/constants';
import { messages } from '../shared/i18n';
import { type QuickReactionEmojiSummary, ReactionStatus, type ReactionSummary } from '../types';
import { RENDER_REACTIONPICKER_TESTID } from './ReactionPicker';
import { RENDER_REACTION_TESTID } from './Reaction';
import { RENDER_MODAL_TESTID } from './ReactionsDialog';
import { RENDER_SELECTOR_TESTID } from './Selector';
import { RENDER_SHOWMORE_TESTID } from './ShowMore';
import { RENDER_REACTIONPICKERPANEL_TESTID } from './ReactionPicker';
import { RENDER_SUMMARY_BUTTON_TESTID } from './ReactionSummaryButton';

import {
	type ReactionsProps,
	Reactions,
	getTooltip,
	ufoExperiences,
	RENDER_REACTIONS_TESTID,
	RENDER_VIEWALL_REACTED_USERS_DIALOG,
} from './Reactions';

jest.mock('../shared/constants', () => ({
	...jest.requireActual('../shared/constants'),
	SAMPLING_RATE_REACTIONS_RENDERED_EXP: 1,
}));

describe('@atlaskit/reactions/components/Reactions', () => {
	const mockOnReactionsClick = jest.fn();
	const mockOnSelection = jest.fn();
	const mockLoadReaction = jest.fn();

	const fakeOpenDialogUFOExperience: FakeUFOInstance = {
		start: jest.fn(),
		success: jest.fn(),
		failure: jest.fn(),
		abort: jest.fn(),
		addMetadata: jest.fn(),
	};

	const fakeSelectedReactionChangeInsideDialogUFOExperience: FakeUFOInstance = {
		start: jest.fn(),
		success: jest.fn(),
		failure: jest.fn(),
		abort: jest.fn(),
		addMetadata: jest.fn(),
	};
	mockReactDomWarningGlobal(() => {
		// Mock the experiences for all dialog UfoExperience instances
		ufoExperiences.openDialog = fakeOpenDialogUFOExperience as any;
		ufoExperiences.selectedReactionChangeInsideDialog =
			fakeSelectedReactionChangeInsideDialogUFOExperience as any;
	});

	/**
	 * Pre defined selected emoji ids
	 */
	const reactions: ReactionSummary[] = [
		getReactionSummary(DefaultReactions[0].shortName, 4, false),
		getReactionSummary(DefaultReactions[2].shortName, 1, true),
	];

	// Dialog entrypoint shows when one emoji has 5+ reacts
	const reactionsForDialog: ReactionSummary[] = [
		getReactionSummary(DefaultReactions[0].shortName, 6, false),
		getReactionSummary(DefaultReactions[1].shortName, 3, true),
		getReactionSummary(DefaultReactions[2].shortName, 1, true),
		getReactionSummary(DefaultReactions[3].shortName, 1, true),
		getReactionSummary(DefaultReactions[4].shortName, 1, true),
	];

	/**
	 * Custom quick Reaction list to pick from
	 */
	const quickReactionEmojis: QuickReactionEmojiSummary = {
		ari,
		containerAri,
		emojiIds: [DefaultReactions[5].id ?? ''],
	};
	const status = ReactionStatus.ready;

	const renderReactions = (
		extraProps: Partial<ReactionsProps> = {},
		onEvent: (event: UIAnalyticsEvent, channel?: string) => void = () => {},
	) => {
		return renderWithIntl(
			<AnalyticsListener channel="fabric-elements" onEvent={onEvent}>
				<Reactions
					emojiProvider={getTestEmojiResource() as Promise<EmojiProvider>}
					reactions={reactions}
					status={status}
					onReactionClick={mockOnReactionsClick}
					onSelection={mockOnSelection}
					loadReaction={mockLoadReaction}
					{...extraProps}
				/>
			</AnalyticsListener>,
		);
	};

	it('should trigger "onReactionClick" when Reaction is clicked', async () => {
		renderReactions();

		const reactionButtons = await screen.findAllByTestId(RENDER_REACTION_TESTID);
		expect(reactionButtons.length).toEqual(reactions.length);
		await userEvent.click(reactionButtons[0]);
		expect(mockOnReactionsClick).toHaveBeenCalled();
	});

	it('should show pre-defined quickReactionEmojis type when reactions prop is empty', async () => {
		renderReactions({ reactions: [], quickReactionEmojis });
		const reactionButtons = await screen.findAllByTestId(RENDER_REACTION_TESTID);
		expect(reactionButtons.length).toEqual(quickReactionEmojis.emojiIds.length);
		for (let index = 0; index < reactionButtons.length; ++index) {
			expect(reactionButtons[index].dataset.emojiId).toEqual(quickReactionEmojis.emojiIds[index]);
		}
	});

	it('should ignore pre-defined quickReactionEmojis type when reactions prop is populated with at least one emoji', async () => {
		renderReactions({ reactions, quickReactionEmojis });
		const reactionButtons = await screen.findAllByTestId(RENDER_REACTION_TESTID);
		expect(reactionButtons.length).toEqual(reactions.length);

		const reactionEmojiIds = reactionButtons.map((button) => button.dataset.emojiId || '');
		const intersection = reactionEmojiIds.some((id) => quickReactionEmojis.emojiIds.includes(id));
		expect(intersection).toEqual(false);
	});

	it('should return empty reaction list when both pre-defined quickReactionEmojis.emojiIds list and reactions prop are empty', async () => {
		renderReactions({
			reactions: [],
			quickReactionEmojis: { ...quickReactionEmojis, emojiIds: [] },
		});
		const reactionButtons = screen.queryAllByTestId(RENDER_REACTION_TESTID);
		expect(reactionButtons.length).toEqual(0);
	});

	it('should return empty reaction list when reactions prop is empty and the hideDefaultReactions is true, even if there are pre-defined quickReactionEmojis ', async () => {
		renderReactions({ reactions: [], quickReactionEmojis, hideDefaultReactions: true });
		const reactionButtons = screen.queryAllByTestId(RENDER_REACTION_TESTID);
		expect(reactionButtons.length).toEqual(0);
	});

	it('should see clickable "and X others" dialog entrypoint if there is at least one emoji with 5 reactions', async () => {
		const onDialogOpenCallback = jest.fn();

		renderReactions({
			reactions: reactionsForDialog,
			allowUserDialog: true,
			onDialogOpenCallback,
		});

		const reactionButtons = screen.queryAllByTestId(RENDER_REACTION_TESTID);
		await userEvent.hover(reactionButtons[2]);

		// "and X others" entrypoint should be visible
		const labelRegex = /and \d+ others/i;
		const dialogEntrypoints = await screen.findAllByText(labelRegex);
		expect(dialogEntrypoints.length).toBeGreaterThan(0);

		await userEvent.click(dialogEntrypoints[0]);

		await waitFor(() => expect(onDialogOpenCallback).toHaveBeenCalled());
	});

	it('should see non-clickable "and X others" if allowUserDialog is disabled', async () => {
		const onDialogOpenCallback = jest.fn();

		renderReactions({
			reactions: reactionsForDialog,
			allowUserDialog: false,
			onDialogOpenCallback,
		});

		const reactionButtons = screen.queryAllByTestId(RENDER_REACTION_TESTID);
		await userEvent.hover(reactionButtons[2]);

		const labelRegex = /and \d+ others/i;
		const dialogEntrypoints = await screen.findAllByText(labelRegex);
		expect(dialogEntrypoints.length).toBeGreaterThan(0);

		await userEvent.click(dialogEntrypoints[0]);
		expect(onDialogOpenCallback).not.toHaveBeenCalled();
	});

	it('should not see "and X others" if no emoji has 5 or more reactions', async () => {
		const onDialogOpenCallback = jest.fn();

		renderReactions({
			reactions,
			allowUserDialog: true,
			onDialogOpenCallback,
		});

		const reactionButtons = screen.queryAllByTestId(RENDER_REACTION_TESTID);
		await userEvent.hover(reactionButtons[2]);

		const labelRegex = /and \d+ others/i;
		const dialogEntrypoints = screen.queryAllByText(labelRegex);
		expect(dialogEntrypoints.length).toEqual(0);
	});

	it('should open reactions users dialog if allowUserDialog is enabled and "And X others" button is clicked', async () => {
		const onDialogOpenCallback = jest.fn();
		const onDialogCloseCallback = jest.fn();
		const onDialogSelectReactionCallback = jest.fn();
		renderReactions({
			reactions: reactionsForDialog,
			allowUserDialog: true,
			onDialogOpenCallback,
			onDialogCloseCallback,
			onDialogSelectReactionCallback,
		});

		const reactionButtons = screen.queryAllByTestId(RENDER_REACTION_TESTID);
		await userEvent.hover(reactionButtons[2]);

		const labelRegex = /and \d+ others/i;
		const dialogEntrypoints = await screen.findAllByText(labelRegex);
		await userEvent.click(dialogEntrypoints[0]);

		await screen.findByTestId(RENDER_MODAL_TESTID);
		screen.getByTestId(reactionsForDialog[1].emojiId);

		const tabToClick = screen
			.getAllByRole('tab')
			.find((tab) => tab.getAttribute('id') === 'reactions-dialog-tabs-1');
		expect(tabToClick).toBeInTheDocument();

		// click a different reaction tab
		await userEvent.click(tabToClick!);

		const closeBtn = screen.getByText('Close');
		await userEvent.click(closeBtn);

		expect(onDialogOpenCallback).toBeCalledWith(
			reactionsForDialog[0].emojiId,
			'endOfPageReactions',
		);
		expect(onDialogCloseCallback).toBeCalled();
		expect(onDialogSelectReactionCallback).toBeCalledWith(reactionsForDialog[1].emojiId);

		expect(fakeOpenDialogUFOExperience.success).toBeCalledWith({
			metadata: {
				emojiId: reactionsForDialog[0].emojiId,
				source: 'Reactions',
				reason: 'Opening Reactions Dialog successfully',
			},
		});
		expect(fakeSelectedReactionChangeInsideDialogUFOExperience.success).toBeCalledWith({
			metadata: {
				emojiId: reactionsForDialog[1].emojiId,
				source: 'Reactions',
				reason: 'Selected Emoji changed',
			},
		});
	});

	describe('getTooltip', () => {
		it('status is set to loading', async () => {
			renderWithIntl(getTooltip(ReactionStatus.loading) as JSX.Element);
			const element = screen.queryByText(messages.loadingReactions.defaultMessage);
			expect(element).toBeDefined();
		});

		it('status is set to error', async () => {
			renderWithIntl(getTooltip(ReactionStatus.error) as JSX.Element);
			const element = screen.queryByText(messages.unexpectedError.defaultMessage);
			expect(element).toBeDefined();
		});

		it('status is set to ready', async () => {
			renderWithIntl(getTooltip(ReactionStatus.ready) as JSX.Element);
			const element = screen.queryByText(messages.addReaction.defaultMessage);
			expect(element).toBeDefined();
		});

		it('when status is ready, returns custom tooltip content if it is passed in', async () => {
			renderWithIntl(getTooltip(ReactionStatus.ready, '', 'Custom tooltip') as JSX.Element);
			const element = screen.queryByText('Custom tooltip');
			expect(element).toBeDefined();
		});

		it('status is set to notLoaded', async () => {
			renderWithIntl(getTooltip(ReactionStatus.notLoaded) as JSX.Element);
			const element = screen.queryByText(messages.loadingReactions.defaultMessage);
			expect(element).toBeDefined();
		});

		it('status is set to disabled', async () => {
			const tooltip = getTooltip(ReactionStatus.disabled);
			expect(tooltip).toBeNull();
		});
	});

	it('should render picker after reactions', async () => {
		const { container } = renderReactions({ allowAllEmojis: true });

		const wrapper = container.querySelector('div.miniMode');
		expect(wrapper).toBeDefined();
	});

	it('should not render picker after reactions if isViewOnly is true', async () => {
		renderReactions({ reactions, isViewOnly: true });

		expect(screen.queryByTestId(RENDER_REACTIONPICKER_TESTID)).not.toBeInTheDocument();
	});

	it('should still render picker after reactions if allowSelectFromSummaryView is true, given there is no summary view', async () => {
		renderReactions({ reactions, allowSelectFromSummaryView: true });

		await screen.findByTestId(RENDER_REACTIONS_TESTID);
		expect(screen.getByTestId(RENDER_REACTIONPICKER_TESTID)).toBeInTheDocument();
	});

	it('should only render the picker and nothing else if "onlyRenderPicker" is passed in as true', async () => {
		renderReactions({ reactions, onlyRenderPicker: true });

		await screen.findByTestId(RENDER_REACTIONS_TESTID);

		expect(screen.queryAllByTestId(RENDER_REACTION_TESTID).length).toEqual(0);
		expect(screen.queryByTestId(RENDER_VIEWALL_REACTED_USERS_DIALOG)).toBeNull();
	});

	describe('with analytics', () => {
		it('should trigger render', async () => {
			const mockOnEvent = jest.fn();
			renderReactions({}, mockOnEvent);

			expect(mockOnEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: expect.objectContaining({
						action: 'rendered',
						actionSubject: 'reactionView',
						eventType: 'operational',
						attributes: {
							duration: expect.any(Number),
							packageName: expect.any(String),
							packageVersion: expect.any(String),
						},
					}),
				}),
				'fabric-elements',
			);
		});

		describe('with ReactionPicker open', () => {
			it('should trigger clicked for Reaction Picker Button', async () => {
				const mockOnEvent = jest.fn();
				renderReactions({}, mockOnEvent);

				const picker = await screen.findByTestId(RENDER_REACTIONPICKER_TESTID);
				expect(picker).toBeInTheDocument();

				const pickerButton = within(picker).getByRole('button');
				expect(pickerButton).toBeInTheDocument();

				await userEvent.click(pickerButton);

				expect(mockOnEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						payload: expect.objectContaining({
							action: 'clicked',
							actionSubject: 'reactionPickerButton',
							eventType: 'ui',
							attributes: {
								reactionEmojiCount: 2,
								packageName: expect.any(String),
								packageVersion: expect.any(String),
							},
						}),
					}),
					'fabric-elements',
				);
			});

			it('should not trigger cancelled event for ReactionPicker on second trigger click', async () => {
				const mockOnEvent = jest.fn();
				renderReactions({}, mockOnEvent);

				// triggger the picker button to show
				const picker = await screen.findByTestId(RENDER_REACTIONPICKER_TESTID);
				expect(picker).toBeInTheDocument();
				const pickerButton = within(picker).getByRole('button');
				expect(pickerButton).toBeInTheDocument();

				// click to open the reaction picker
				await userEvent.click(pickerButton);

				// close the reaction picker by click it again
				await userEvent.click(pickerButton);

				expect(mockOnEvent).not.toHaveBeenCalledWith(
					expect.objectContaining({
						payload: expect.objectContaining({
							action: 'cancelled',
							actionSubject: 'reactionPicker',
							eventType: 'ui',
							attributes: {
								duration: expect.any(Number),
								packageName: '@atlaskit/reactions',
								packageVersion: expect.any(String),
							},
						}),
					}),
					'fabric-elements',
				);
			});

			it('should trigger clicked for new emoji', async () => {
				const mockOnEvent = jest.fn();
				renderReactions({}, mockOnEvent);

				// triggger the picker button to show
				const picker = await screen.findByTestId(RENDER_REACTIONPICKER_TESTID);
				expect(picker).toBeInTheDocument();

				const pickerButton = within(picker).getByRole('button');
				expect(pickerButton).toBeInTheDocument();
				await userEvent.click(pickerButton);

				const pickerPopup = await screen.findByTestId(RENDER_REACTIONPICKERPANEL_TESTID);

				// render the selectors list insider <ReactionPicker />
				const selectors = await within(pickerPopup).findAllByTestId(RENDER_SELECTOR_TESTID);
				expect(selectors.length).toBeGreaterThan(1);
				expect(selectors[1]).toBeInTheDocument();

				// pick the button inside the list of emojis to select
				const selectedButton = within(selectors[1]).getByRole('button');
				expect(selectedButton).toBeInTheDocument();

				await userEvent.click(selectedButton);

				act(() => {
					jest.runOnlyPendingTimers();
				});
				expect(mockOnEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						payload: expect.objectContaining({
							action: 'clicked',
							actionSubject: 'reactionPicker',
							eventType: 'ui',
							attributes: expect.objectContaining({
								duration: expect.any(Number),
								emojiId: DefaultReactions[1].id,
								previousState: 'new',
								source: 'quickSelector',
								packageName: expect.any(String),
								packageVersion: expect.any(String),
							}),
						}),
					}),
					'fabric-elements',
				);
			});

			it('should trigger clicked for existing emoji', async () => {
				const mockOnEvent = jest.fn();
				renderReactions({}, mockOnEvent);

				// triggger the picker button to show
				const picker = await screen.findByTestId(RENDER_REACTIONPICKER_TESTID);
				expect(picker).toBeInTheDocument();
				const pickerButton = within(picker).getByRole('button');
				expect(pickerButton).toBeInTheDocument();

				await userEvent.click(pickerButton);

				const pickerPopup = await screen.findByTestId(RENDER_REACTIONPICKERPANEL_TESTID);
				// render the selectors list insider <ReactionPicker />
				const selectors = await within(pickerPopup).findAllByTestId(RENDER_SELECTOR_TESTID);
				expect(selectors.length).toBeGreaterThan(1);
				expect(selectors[0]).toBeInTheDocument();

				// pick the button inside the list of emojis to select
				const selectedButton = within(selectors[0]).getByRole('button');
				expect(selectedButton).toBeInTheDocument();

				await userEvent.click(selectedButton);

				act(() => {
					jest.runOnlyPendingTimers();
				});

				expect(mockOnEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						payload: expect.objectContaining({
							action: 'clicked',
							actionSubject: 'reactionPicker',
							eventType: 'ui',
							attributes: expect.objectContaining({
								duration: expect.any(Number),
								emojiId: DefaultReactions[0].id,
								previousState: 'existingNotReacted',
								source: 'quickSelector',
								packageName: expect.any(String),
								packageVersion: expect.any(String),
							}),
						}),
					}),
					'fabric-elements',
				);
			});

			it('should trigger clicked from emojiPicker', async () => {
				const mockOnEvent = jest.fn();
				const { container } = renderReactions({ allowAllEmojis: true }, mockOnEvent);

				const wrapper = container.querySelector('div.miniMode');
				expect(wrapper).toBeDefined();

				// triggger the picker button to show
				const picker = await screen.findByTestId(RENDER_REACTIONPICKER_TESTID);
				expect(picker).toBeInTheDocument();
				const pickerButton = within(picker).getByRole('button');
				expect(pickerButton).toBeInTheDocument();
				await userEvent.click(pickerButton);

				const pickerPopup = await screen.findByTestId(RENDER_REACTIONPICKERPANEL_TESTID);

				// render the selectors list insider <ReactionPicker />
				const selectors = await within(pickerPopup).findAllByTestId(RENDER_SELECTOR_TESTID);
				expect(selectors.length).toBeGreaterThan(1);
				expect(selectors[0]).toBeInTheDocument();

				// pick the button inside the list of emojis to select
				const selectedButton = within(selectors[0]).getByRole('button');
				expect(selectedButton).toBeInTheDocument();

				const showMoreButton = await screen.findByTestId(RENDER_SHOWMORE_TESTID);
				expect(showMoreButton).toBeInTheDocument();

				await userEvent.click(showMoreButton);

				expect(mockOnEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						payload: expect.objectContaining({
							action: 'clicked',
							actionSubject: 'reactionPicker',
							actionSubjectId: 'more',
							eventType: 'ui',
							attributes: {
								duration: expect.any(Number),
								packageName: expect.any(String),
								packageVersion: expect.any(String),
							},
						}),
					}),
					'fabric-elements',
				);
			});
		});
	});

	describe('summary view', () => {
		const summaryReactions = [
			...reactions,
			// adding 2 more reactions since the default array only has 2 and the default threshold to show a summary is 3
			getReactionSummary(DefaultReactions[2].shortName, 9, false),
			getReactionSummary(DefaultReactions[3].shortName, 5, false),
		];

		const renderReactionsWithSummary = (
			extraProps: Partial<ReactionsProps> = {},
			onEvent: (event: UIAnalyticsEvent, channel?: string) => void = () => {},
		) => {
			return renderWithIntl(
				<AnalyticsListener channel="fabric-elements" onEvent={onEvent}>
					<Reactions
						emojiProvider={getTestEmojiResource() as Promise<EmojiProvider>}
						reactions={summaryReactions}
						status={ReactionStatus.ready}
						onReactionClick={mockOnReactionsClick}
						onSelection={mockOnSelection}
						loadReaction={mockLoadReaction}
						summaryViewEnabled={true}
						summaryViewThreshold={3}
						{...extraProps}
					/>
				</AnalyticsListener>,
			);
		};

		it('should enable summary view when the number of reactions meets the threshold', async () => {
			// threshold is 3 by default and there are 4 reactions
			renderReactionsWithSummary();
			const summaryView = await screen.findByTestId('reaction-summary-view');
			expect(summaryView).toBeInTheDocument();
		});

		it('should not enable summary view when the number of reactions is below the threshold', async () => {
			renderReactionsWithSummary({ summaryViewThreshold: 8 });
			const summaryView = screen.queryByTestId('reaction-summary-view');
			expect(summaryView).not.toBeInTheDocument();
		});

		it('should enable summary view when the number of reactions is the same as the threshold', async () => {
			renderReactionsWithSummary({ summaryViewThreshold: 4 });
			const summaryView = await screen.findByTestId('reaction-summary-view');
			expect(summaryView).toBeInTheDocument();
		});

		it('should not render picker if allowSelectFromSummaryView is true and there is a summary view', async () => {
			renderReactionsWithSummary({ allowSelectFromSummaryView: true });
			const summaryView = await screen.findByTestId('reaction-summary-view');
			expect(summaryView).toBeInTheDocument();
			expect(screen.queryByTestId(RENDER_REACTIONPICKER_TESTID)).not.toBeInTheDocument();
		});

		it('should open detailed reactions view on summary click', async () => {
			renderReactionsWithSummary();
			const reactionSummaryButton = await screen.findByTestId(RENDER_SUMMARY_BUTTON_TESTID);

			// click the summary button which opens it to see all the reactions
			await userEvent.click(reactionSummaryButton);

			const reactionButtons = await screen.findAllByTestId(RENDER_REACTION_TESTID);
			expect(reactionButtons.length).toEqual(summaryReactions.length);
			await userEvent.click(reactionButtons[0]);

			expect(mockOnReactionsClick).toHaveBeenCalled();
		});

		it('should not show summary view when shown quick reactions exceed threshold', async () => {
			const reactions: ReactionSummary[] = [];
			renderReactionsWithSummary({ quickReactionEmojis, reactions, summaryViewThreshold: 1 });
			const reactionButtons = await screen.findAllByTestId(RENDER_REACTION_TESTID);
			expect(reactionButtons.length).toEqual(quickReactionEmojis.emojiIds.length);
			const summaryView = screen.queryByTestId('reaction-summary-view');
			expect(summaryView).not.toBeInTheDocument();
		});
	});
});
