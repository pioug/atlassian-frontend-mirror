import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import { getTestEmojiResource } from '@atlaskit/util-data-test/get-test-emoji-resource';
import { getReactionSummary } from '../MockReactionsClient';
import { DefaultReactions } from '../shared/constants';
import { type ReactionSummary } from '../types';
import { RENDER_SUMMARY_VIEW_POPUP_TESTID, ReactionSummaryView } from './ReactionSummaryView';
import { type EmojiProvider } from '@atlaskit/emoji';
import { RENDER_SUMMARY_BUTTON_TESTID } from './ReactionSummaryButton';
import { RENDER_REACTION_TESTID } from './Reaction';

jest.mock('@atlaskit/emoji/picker', () => ({
	...jest.requireActual('@atlaskit/emoji/picker'),
	EmojiPicker: () => <div>EmojiPicker</div>,
}));

jest.mock('../hooks/useDelayedState', () => ({
	useDelayedState: (defaultState: any) => useState(defaultState),
}));

const reactions: ReactionSummary[] = [
	getReactionSummary(DefaultReactions[0].shortName, 5, false),
	getReactionSummary(DefaultReactions[1].shortName, 4, true),
	getReactionSummary(DefaultReactions[2].shortName, 3, false),
	getReactionSummary(DefaultReactions[3].shortName, 10, true),
];

describe('ReactionSummaryView', () => {
	const renderComponent = (extraProps = {}) =>
		render(
			<IntlProvider locale="en">
				<ReactionSummaryView
					emojiProvider={getTestEmojiResource() as Promise<EmojiProvider>}
					reactions={reactions}
					onReactionClick={jest.fn()}
					onSelection={jest.fn()}
					tooltipContent="hello"
					{...extraProps}
				/>
			</IntlProvider>,
		);

	it('should popup the list of reactions when the summary button is clicked', async () => {
		renderComponent();
		const reactionSummaryButton = await screen.findByTestId(RENDER_SUMMARY_BUTTON_TESTID);
		await userEvent.click(reactionSummaryButton);

		const summaryViewPopup = await screen.findByTestId(RENDER_SUMMARY_VIEW_POPUP_TESTID);
		expect(summaryViewPopup).toBeInTheDocument();
	});

	it('should open detailed reactions view on summary click', async () => {
		const onReactionClickMock = jest.fn();
		renderComponent({
			onReactionClick: onReactionClickMock,
		});
		const reactionSummaryButton = await screen.findByTestId(RENDER_SUMMARY_BUTTON_TESTID);
		await userEvent.click(reactionSummaryButton);

		// make sure the correct number of reactions show
		const reactionButtons = await screen.findAllByTestId(RENDER_REACTION_TESTID);
		expect(reactionButtons.length).toEqual(reactions.length);

		await userEvent.click(reactionButtons[0]);
		expect(onReactionClickMock).toHaveBeenCalled();
	});

	it('should handle mouse enter and focus events on reactions', async () => {
		const onReactionMouseEnterMock = jest.fn();
		const onReactionFocusedMock = jest.fn();
		renderComponent({
			onReactionMouseEnter: onReactionMouseEnterMock,
			onReactionFocused: onReactionFocusedMock,
		});

		const reactionSummaryButton = await screen.findByTestId(RENDER_SUMMARY_BUTTON_TESTID);
		await userEvent.click(reactionSummaryButton);

		const reactionButtons = await screen.findAllByTestId(RENDER_REACTION_TESTID);
		expect(reactionButtons.length).toEqual(reactions.length);

		await userEvent.hover(reactionButtons[0]);
		expect(onReactionMouseEnterMock).toHaveBeenCalled();

		reactionButtons[0].focus();
		expect(onReactionFocusedMock).toHaveBeenCalled();
	});

	it('should render Reactions Dialog entrypoint and invoke dialog open if user dialog is allowed', async () => {
		const mockHandleOpenReactionsDialog = jest.fn();
		renderComponent({
			reactions,
			allowUserDialog: true,
			handleOpenReactionsDialog: mockHandleOpenReactionsDialog,
		});

		const reactionSummaryButton = await screen.findByTestId(RENDER_SUMMARY_BUTTON_TESTID);
		await userEvent.click(reactionSummaryButton);

		const reactionButtons = await screen.findAllByTestId(RENDER_REACTION_TESTID);
		expect(reactionButtons.length).toEqual(reactions.length);
		await userEvent.hover(reactionButtons[3]);

		const labelRegex = /and \d+ others/i;
		const dialogEntrypoints = await screen.findAllByText(labelRegex);
		expect(dialogEntrypoints.length).toBeGreaterThan(0);
		await userEvent.click(dialogEntrypoints[0]);

		expect(mockHandleOpenReactionsDialog).toHaveBeenCalled();
	});

	it('should render emoji picker button if allowSelectFromSummaryView is true and the trigger is clicked', async () => {
		renderComponent({
			reactions,
			allowSelectFromSummaryView: true,
		});

		const reactionSummaryButton = await screen.findByTestId(RENDER_SUMMARY_BUTTON_TESTID);
		await userEvent.click(reactionSummaryButton);
		const pickerContainer = await screen.findByTestId(
			'reaction-summary-view-emoji-picker-container',
		);
		expect(pickerContainer).toBeInTheDocument();
		const trigger = await screen.findByTestId('render-trigger-button');
		await userEvent.click(trigger);
		const emojiPicker = await screen.findByText('EmojiPicker');
		expect(emojiPicker).toBeInTheDocument();
	});

	it('should not render emoji picker button if allowSelectFromSummaryView is false', async () => {
		renderComponent({
			reactions,
			allowSelectFromSummaryView: false,
		});

		const reactionSummaryButton = await screen.findByTestId(RENDER_SUMMARY_BUTTON_TESTID);
		await userEvent.click(reactionSummaryButton);

		const pickerContainer = screen.queryByTestId('reaction-summary-view-emoji-picker-container');
		expect(pickerContainer).not.toBeInTheDocument();
	});

	describe('hover functionality', () => {
		it('should open the emoji picker when the summary button is clicked with hoverableSummaryView', async () => {
			renderComponent({ hoverableSummaryView: true });
			const reactionSummaryButton = await screen.findByTestId(RENDER_SUMMARY_BUTTON_TESTID);
			await userEvent.click(reactionSummaryButton);

			const emojiPicker = await screen.findByText('EmojiPicker');
			expect(emojiPicker).toBeInTheDocument();
		});

		it('should close the emoji picker when the summary button is clicked for a second time', async () => {
			renderComponent({ hoverableSummaryView: true });
			const reactionSummaryButton = await screen.findByTestId(RENDER_SUMMARY_BUTTON_TESTID);
			await userEvent.click(reactionSummaryButton);
			const emojiPicker = await screen.findByText('EmojiPicker');
			expect(emojiPicker).toBeInTheDocument();

			await userEvent.click(reactionSummaryButton);
			expect(emojiPicker).not.toBeInTheDocument();
		});

		it('should open popup when hovering the summary button if hoverableSummaryView is true', async () => {
			renderComponent({ hoverableSummaryView: true });
			const reactionSummaryButton = await screen.findByTestId(RENDER_SUMMARY_BUTTON_TESTID);

			await userEvent.hover(reactionSummaryButton);
			const summaryViewPopup = await screen.findByTestId(RENDER_SUMMARY_VIEW_POPUP_TESTID);
			expect(summaryViewPopup).toBeInTheDocument();
		});

		it('should not open popup when hovering the summary button if hoverableSummaryView is false', async () => {
			renderComponent({ hoverableSummaryView: false });
			const reactionSummaryButton = await screen.findByTestId(RENDER_SUMMARY_BUTTON_TESTID);

			await userEvent.hover(reactionSummaryButton);
			const summaryViewPopup = screen.queryByTestId(RENDER_SUMMARY_VIEW_POPUP_TESTID);
			expect(summaryViewPopup).not.toBeInTheDocument();
		});

		it('should keep popup open when moving from button to summary view', async () => {
			renderComponent({ hoverableSummaryView: true });
			const reactionSummaryButton = await screen.findByTestId(RENDER_SUMMARY_BUTTON_TESTID);

			await userEvent.hover(reactionSummaryButton);
			const summaryViewPopup = await screen.findByTestId(RENDER_SUMMARY_VIEW_POPUP_TESTID);

			// Move from button to summary view
			await userEvent.hover(summaryViewPopup);
			// Summary view button is unhovered, but popup should still be open
			await userEvent.unhover(reactionSummaryButton);

			expect(summaryViewPopup).toBeInTheDocument();
		});

		it('should close popup when mouse leaves both button and summary view', async () => {
			renderComponent({ hoverableSummaryView: true });
			const reactionSummaryButton = await screen.findByTestId(RENDER_SUMMARY_BUTTON_TESTID);

			await userEvent.hover(reactionSummaryButton);
			const summaryViewPopup = await screen.findByTestId(RENDER_SUMMARY_VIEW_POPUP_TESTID);

			await userEvent.unhover(reactionSummaryButton);
			await userEvent.unhover(summaryViewPopup);

			const closedPopup = screen.queryByTestId(RENDER_SUMMARY_VIEW_POPUP_TESTID);
			expect(closedPopup).not.toBeInTheDocument();
		});

		it('should keep popup open when clicking summary button if hoverableSummaryView is false', async () => {
			renderComponent({ hoverableSummaryView: false });
			const reactionSummaryButton = await screen.findByTestId(RENDER_SUMMARY_BUTTON_TESTID);

			await userEvent.click(reactionSummaryButton);
			const summaryViewPopup = await screen.findByTestId(RENDER_SUMMARY_VIEW_POPUP_TESTID);
			expect(summaryViewPopup).toBeInTheDocument();

			await userEvent.unhover(reactionSummaryButton);
			expect(summaryViewPopup).toBeInTheDocument();
		});

		it('should close the summary view when the emoji picker is opened', async () => {
			renderComponent({ hoverableSummaryView: true, allowSelectFromSummaryView: true });
			const reactionSummaryButton = await screen.findByTestId(RENDER_SUMMARY_BUTTON_TESTID);
			await userEvent.hover(reactionSummaryButton);
			expect(await screen.findByTestId(RENDER_SUMMARY_VIEW_POPUP_TESTID)).toBeInTheDocument();

			const trigger = await screen.findByTestId('render-trigger-button');
			await userEvent.click(trigger);
			expect(await screen.findByText('EmojiPicker')).toBeInTheDocument();
			expect(screen.queryByTestId(RENDER_SUMMARY_VIEW_POPUP_TESTID)).not.toBeInTheDocument();
		});
	});
});
