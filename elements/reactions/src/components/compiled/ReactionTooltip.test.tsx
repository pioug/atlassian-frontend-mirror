import React from 'react';
import { act, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TOOLTIP_USERS_LIMIT } from '../../shared/constants';
import { type ReactionSummary } from '../../types';
import { mockReactDomWarningGlobal, renderWithIntl } from '../../__tests__/_testing-library';

import { ReactionTooltip, RENDER_REACTIONTOOLTIP_TESTID } from './ReactionTooltip';

describe('@atlaskit/reactions/components/ReactionTooltip', () => {
	mockReactDomWarningGlobal();

	/**
	 * Demo reaction object with 7 users selecting it
	 */
	const demoReaction: ReactionSummary = {
		ari: 'reaction-id',
		containerAri: 'conteiner-id',
		emojiId: 'emoji-id',
		count: 10,
		reacted: false,
		users: [
			{
				id: 'user-1',
				displayName: 'User 1',
			},
			{
				id: 'user-2',
				displayName: 'User 2',
			},
			{
				id: 'user-3',
				displayName: 'User 3',
			},
			{
				id: 'user-4',
				displayName: 'User 4',
			},
			{
				id: 'user-5',
				displayName: 'User 5',
			},
			{
				id: 'user-6',
				displayName: 'User 6',
			},
			{
				id: 'user-7',
				displayName: 'User 7',
			},
		],
	};

	const RENDER_CONTENT_TESTID = 'test';

	const renderReactionTooltip = ({
		reactionSummary = demoReaction,
		emojiName = 'emoji name',
		maxReactions = 5,
		dismissTooltip = () => {},
		handleOpenReactionsDialog = () => {},
		allowUserDialog = false,
	}) =>
		renderWithIntl(
			<ReactionTooltip
				reaction={reactionSummary}
				emojiName={emojiName}
				maxReactions={maxReactions}
				handleOpenReactionsDialog={handleOpenReactionsDialog}
				dismissTooltip={dismissTooltip}
				allowUserDialog={allowUserDialog}
			>
				<div id="content" data-testid={RENDER_CONTENT_TESTID}>
					content
				</div>
			</ReactionTooltip>,
		);

	it('should render tooltip', async () => {
		renderReactionTooltip({});

		const item = await screen.findByTestId(RENDER_CONTENT_TESTID);

		// launch the hover over the tooltip to retrieve its content
		const tooltipContainer = await screen.findByTestId(
			`${RENDER_REACTIONTOOLTIP_TESTID}--container`,
		);
		expect(tooltipContainer).toBeInTheDocument();
		// hover over the tooltip
		act(() => {
			fireEvent.mouseOver(item);
			jest.runAllTimers();
		});

		const usersListWrapper = await screen.findByRole('tooltip');
		expect(usersListWrapper).toBeInTheDocument();
		expect(usersListWrapper).toHaveAttribute('data-placement', 'bottom');

		const items = usersListWrapper.querySelectorAll('li');
		expect(items.length).toEqual(TOOLTIP_USERS_LIMIT + 2);
		expect(items[0].textContent).toEqual('emoji name');
		expect(items[1].textContent).toEqual('User 1');
		expect(items[2].textContent).toEqual('User 2');
		expect(items[3].textContent).toEqual('User 3');
		expect(items[4].textContent).toEqual('User 4');
		expect(items[5].textContent).toEqual('User 5');
		expect(items[6].textContent).toEqual('and 2 others');
	});

	it('should not render footer with fewer users than the limit', async () => {
		renderReactionTooltip({
			reactionSummary: {
				...demoReaction,
				users: demoReaction.users!.slice(0, 2),
			},
		});

		const item = await screen.findByTestId(RENDER_CONTENT_TESTID);

		const tooltipContainer = await screen.findByTestId(
			`${RENDER_REACTIONTOOLTIP_TESTID}--container`,
		);
		expect(tooltipContainer).toBeInTheDocument();
		await userEvent.hover(item);

		const usersListWrapper = await screen.findByRole('tooltip');
		expect(usersListWrapper).toBeInTheDocument();
		const items = usersListWrapper.querySelectorAll('li');
		expect(items[0].textContent).toEqual('emoji name');
		expect(items[1].textContent).toEqual('User 1');
		expect(items[2].textContent).toEqual('User 2');
	});

	it('test maximum reacted users list', async () => {
		renderReactionTooltip({ emojiName: 'emoji name', maxReactions: 2 });

		const item = await screen.findByTestId(RENDER_CONTENT_TESTID);

		const tooltipContainer = await screen.findByTestId(
			`${RENDER_REACTIONTOOLTIP_TESTID}--container`,
		);
		expect(tooltipContainer).toBeInTheDocument();
		await userEvent.hover(item);

		const usersListWrapper = await screen.findByRole('tooltip');
		expect(usersListWrapper).toBeInTheDocument();
		const items = usersListWrapper.querySelectorAll('li');
		expect(items.length).toEqual(4);
		expect(items[0].textContent).toEqual('emoji name');
		expect(items[1].textContent).toEqual('User 1');
		expect(items[2].textContent).toEqual('User 2');
		expect(items[3].textContent).toEqual('and 5 others');
	});

	it('should not render emoji name', async () => {
		renderReactionTooltip({ emojiName: '' });

		const item = await screen.findByTestId(RENDER_CONTENT_TESTID);

		const tooltipContainer = await screen.findByTestId(
			`${RENDER_REACTIONTOOLTIP_TESTID}--container`,
		);
		expect(tooltipContainer).toBeInTheDocument();
		await userEvent.hover(item);

		const usersListWrapper = await screen.findByRole('tooltip');
		expect(usersListWrapper).toBeInTheDocument();
		const items = usersListWrapper.querySelectorAll('li');
		expect(items.length).toEqual(TOOLTIP_USERS_LIMIT + 1);
		expect(items[0].textContent).toEqual('User 1');
		expect(items[5].textContent).toEqual('and 2 others');
	});

	it('should open Reactions Dialog and dismiss tooltip when entrypoint is clicked in tooltip', async () => {
		const mockHandleOpenReactionsDialog = jest.fn();
		const mockDismissTooltip = jest.fn();

		renderReactionTooltip({
			dismissTooltip: mockDismissTooltip,
			handleOpenReactionsDialog: mockHandleOpenReactionsDialog,
			allowUserDialog: true,
		});

		const item = await screen.findByTestId(RENDER_CONTENT_TESTID);

		const tooltipContainer = await screen.findByTestId(
			`${RENDER_REACTIONTOOLTIP_TESTID}--container`,
		);
		expect(tooltipContainer).toBeInTheDocument();
		await userEvent.hover(item);

		const usersListWrapper = await screen.findByRole('tooltip');
		expect(usersListWrapper).toBeInTheDocument();

		const dialogEntrypoints = screen.getAllByText('and 2 others');
		const dialogEntrypoint = dialogEntrypoints[0];

		await userEvent.click(dialogEntrypoint);

		expect(mockDismissTooltip).toHaveBeenCalled();
		expect(mockHandleOpenReactionsDialog).toHaveBeenCalled();
	});
});
