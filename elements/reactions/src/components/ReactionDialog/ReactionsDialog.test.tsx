import React from 'react';
import { fireEvent, screen, within, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { type EmojiProvider } from '@atlaskit/emoji/resource';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';
import { flushPromises } from '@atlaskit/editor-test-helpers/e2e-helpers';

import { renderWithIntl } from '../../__tests__/_testing-library';

import { ReactionsDialog, type ReactionsDialogProps } from './ReactionsDialog';

// non default emojis can cause test failures
const emojiIds = [
	'1f6bf', //:shower:
	'1f6c1', //:bathtub:
	'1f44d', //:thumbsup:
	'2764',
	'1f9fd', //:sponge:
	'1f9fa',
	'1f9fb',
	'1f9fc',
	'1f525', //:fire
	'1f9f4',
];

const reactionsData = emojiIds.map((item, index) => {
	return {
		ari: `ari:cloud:owner:demo-cloud-id:item/${index + 1}`,
		containerAri: `ari:cloud:owner:demo-cloud-id:container/${index + 1}`,
		emojiId: item,
		count: 10,
		reacted: false,
		users: [
			{ id: 'test-0', displayName: 'Bette Davis-test' },
			{ id: 'test-3', displayName: 'Harper Lee-test' },
			{ id: 'test-1', displayName: 'Ada Lovelace-test' },
			{ id: 'test-2', displayName: 'Lucy Liu-test' },
		],
	};
});

const mockHandleCloseReactionsDialog = jest.fn();
const mockHandlePaginationChange = jest.fn();

const { findByText, findByRole, queryAllByText, queryAllByRole } = screen;

const renderReactionsDialog = async (extraProps: Partial<ReactionsDialogProps> = {}) => {
	renderWithIntl(
		<ReactionsDialog
			reactions={reactionsData.slice(0, 4)}
			emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
			handleCloseReactionsDialog={mockHandleCloseReactionsDialog}
			handlePaginationChange={mockHandlePaginationChange}
			selectedEmojiId="1f44d"
			{...extraProps}
		/>,
	);
	return await act(async () => {
		await flushPromises();
	});
};

it('should display reactions count', async () => {
	await renderReactionsDialog();

	const totalCommentCount = await findByText('40 reactions');
	expect(totalCommentCount).toBeTruthy();
});

it('should display a list of reaction tabs', async () => {
	await renderReactionsDialog();

	const reactionsList = await findByRole('tablist');
	expect(reactionsList).toBeDefined();

	const elements = queryAllByRole('tab');
	expect(elements).toHaveLength(4);

	expect(elements[0].id).toBe('reactions-dialog-tabs-0');
	expect(elements[1].id).toBe('reactions-dialog-tabs-1');
	expect(elements[2].id).toBe('reactions-dialog-tabs-2');
	expect(elements[3].id).toBe('reactions-dialog-tabs-3');
});

it('should display an emoji and count for each tab in the reaction list', async () => {
	await renderReactionsDialog();

	const reactionsList = await findByRole('tablist');
	expect(reactionsList).toBeDefined();

	const elements = queryAllByRole('tab');

	// check two elements
	expect(within(elements[0]).getByLabelText(':shower:')).toBeDefined();
	expect(within(elements[0]).getByText('10')).toBeDefined();

	expect(within(elements[1]).getByLabelText(':bathtub:')).toBeDefined();
	expect(within(elements[1]).getByText('10')).toBeDefined();
});

it('should display the emoji and emoji name for the selected reaction', async () => {
	await renderReactionsDialog();

	const reactionView = await findByRole('tabpanel');
	expect(reactionView).toBeDefined();

	// selected reaction is thumbsup
	expect(within(reactionView).getByLabelText(':thumbsup:')).toBeDefined();
	expect(within(reactionView).getByText(/people who reacted with :thumbsup:/i)).toBeDefined();
});

it('should alphabetically sort users for the selected reaction', async () => {
	await renderReactionsDialog();

	const names = queryAllByText(/\w*\s\w*-test/);

	expect(names).toHaveLength(4);
	expect(names[0].textContent).toBe('Ada Lovelace-test');
	expect(names[1].textContent).toBe('Bette Davis-test');
	expect(names[2].textContent).toBe('Harper Lee-test');
	expect(names[3].textContent).toBe('Lucy Liu-test');
});

it('should fire handleSelectReaction when a reaction is selected', async () => {
	const spy = jest.fn();
	await renderReactionsDialog({ handleSelectReaction: spy });

	const reactionsList = await findByRole('tablist');
	expect(reactionsList).toBeDefined();

	const elements = queryAllByRole('tab');

	await act(async () => {
		await fireEvent.click(elements[0]);
	});

	expect(spy).toHaveBeenCalled();
});

it('should display a maximum of eight emojis per page', async () => {
	await renderReactionsDialog({ reactions: reactionsData });

	const reactionsList = await findByRole('tablist');
	expect(reactionsList).toBeDefined();

	const tabs = queryAllByRole('tab');
	expect(tabs).toHaveLength(8);
});

it('should render the correct number of pages for emojis', async () => {
	await renderReactionsDialog({ reactions: reactionsData });

	const reactionsList = await findByRole('tablist');
	expect(reactionsList).toBeDefined();

	const rightNavigateButton = screen.getByRole('button', { name: /right navigate/i });

	await userEvent.click(rightNavigateButton);

	const tabs = queryAllByRole('tab');
	// 10 items in reactionsData minus 8 from the first page
	expect(tabs).toHaveLength(2);
});

it('should disable navigation buttons on the first and last page', async () => {
	await renderReactionsDialog({ reactions: reactionsData });

	const reactionsList = await findByRole('tablist');
	expect(reactionsList).toBeDefined();

	const leftNavigateButton = screen.getByRole('button', { name: /left navigate/i });
	expect(leftNavigateButton).toBeDisabled();

	const rightNavigateButton = screen.getByRole('button', { name: /right navigate/i });

	await userEvent.click(rightNavigateButton);

	expect(rightNavigateButton).toBeDisabled();
});

it('should render the first emoji after navigating to a new page', async () => {
	const spy = jest.fn();
	await renderReactionsDialog({
		handlePaginationChange: spy,
		reactions: reactionsData,
		// 9th emoji in reactionsData - :fire:
		// handlePaginationChange updates selectedEmojiId but we have to pass it as a prop for the test
		selectedEmojiId: '1f525',
	});

	const reactionsList = await findByRole('tablist');
	expect(reactionsList).toBeDefined();

	const rightNavigateButton = screen.getByRole('button', { name: /right navigate/i });
	await userEvent.click(rightNavigateButton);

	expect(spy).toHaveBeenCalledWith('1f525');

	expect(screen.getByText(/people who reacted with :fire:/i)).toBeInTheDocument();
});
