import React from 'react';
import { fireEvent, screen, within, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { type EmojiProvider } from '@atlaskit/emoji/resource';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';
import { flushPromises } from '@atlaskit/editor-test-helpers/e2e-helpers';

import { renderWithIntl } from '../__tests__/_testing-library';

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
			{
				id: 'test-0',
				displayName: 'Bette Davis-test',
				accountId: 'test0',
				profilePicture: { path: 'path0' },
			},
			{
				id: 'test-1',
				displayName: 'Harper Lee-test',
				accountId: 'test1',
				profilePicture: { path: 'path1' },
			},
			// out of order to assert alphabetical ordering
			{
				id: 'test-4',
				displayName: 'Zebra Zebra-test',
				accountId: 'test4',
				profilePicture: { path: 'path4' },
			},
			{
				id: 'test-2',
				displayName: 'Ada Lovelace-test',
				accountId: 'test2',
				profilePicture: { path: 'path2' },
			},
			{
				id: 'test-3',
				displayName: 'Lucy Liu-test',
				accountId: 'test3',
				profilePicture: { path: 'path3' },
			},
		],
	};
});

const truncatedReactionsData = emojiIds.slice(0, 8).map((item, index) => {
	return {
		ari: `ari:cloud:owner:demo-cloud-id:item/${index + 1}`,
		containerAri: `ari:cloud:owner:demo-cloud-id:container/${index + 1}`,
		emojiId: item,
		count: 10,
		reacted: false,
		users: [
			{
				id: 'test-0',
				displayName: 'Bette Davis-test',
				accountId: 'test0',
				profilePicture: { path: 'path0' },
			},
			{
				id: 'test-1',
				displayName: 'Harper Lee-test',
				profilePicture: { path: 'path1' },
			},
		],
	};
});

const mockHandleCloseReactionsDialog = jest.fn();
const mockHandlePaginationChange = jest.fn();

const { findByText, findByRole, queryAllByText, queryAllByRole } = screen;

const renderReactionsDialog = async (extraProps: Partial<ReactionsDialogProps> = {}) => {
	renderWithIntl(
		<ReactionsDialog
			reactions={reactionsData}
			emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
			handleCloseReactionsDialog={mockHandleCloseReactionsDialog}
			handlePaginationChange={mockHandlePaginationChange}
			selectedEmojiId="1f6bf"
			{...extraProps}
		/>,
	);
	return await act(async () => {
		await flushPromises();
	});
};

it('should display reactions count', async () => {
	await renderReactionsDialog({ reactions: reactionsData.slice(0, 5) });

	const totalCommentCount = await findByText('50 total reactions');
	expect(totalCommentCount).toBeTruthy();
});

it('should display a list of reaction tabs', async () => {
	await renderReactionsDialog({ reactions: reactionsData.slice(0, 5) });

	const reactionsList = await findByRole('tablist');
	expect(reactionsList).toBeDefined();

	const elements = queryAllByRole('tab');
	expect(elements).toHaveLength(5);

	expect(elements[0].id).toBe('reactions-dialog-tabs-0');
	expect(elements[1].id).toBe('reactions-dialog-tabs-1');
	expect(elements[2].id).toBe('reactions-dialog-tabs-2');
	expect(elements[3].id).toBe('reactions-dialog-tabs-3');
	expect(elements[4].id).toBe('reactions-dialog-tabs-4');
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

it('should alphabetically sort users for the selected reaction', async () => {
	await renderReactionsDialog();

	const names = queryAllByText(/\w*\s\w*-test/);

	expect(names).toHaveLength(5);
	expect(names[0].textContent).toBe('Ada Lovelace-test');
	expect(names[1].textContent).toBe('Bette Davis-test');
	expect(names[2].textContent).toBe('Harper Lee-test');
	expect(names[3].textContent).toBe('Lucy Liu-test');
	expect(names[4].textContent).toBe('Zebra Zebra-test');
});

it('should fire handleSelectReaction when a reaction is selected', async () => {
	const spy = jest.fn();
	await renderReactionsDialog({
		selectedEmojiId: '1f6bf',
		handleSelectReaction: spy,
	});

	const reactionsList = await findByRole('tablist');
	expect(reactionsList).toBeDefined();

	const elements = queryAllByRole('tab');

	await act(async () => {
		await fireEvent.click(elements[1]);
	});

	expect(spy).toHaveBeenCalled();
});

it('should display a maximum of eight emojis per page', async () => {
	await renderReactionsDialog({});

	const reactionsList = await findByRole('tablist');
	expect(reactionsList).toBeDefined();

	const tabs = queryAllByRole('tab');
	expect(tabs).toHaveLength(8);
});

it('should render the correct number of pages for emojis', async () => {
	await renderReactionsDialog({});

	const reactionsList = await findByRole('tablist');
	expect(reactionsList).toBeDefined();

	const rightNavigateButton = screen.getByRole('button', { name: /right navigate/i });

	await userEvent.click(rightNavigateButton);

	const tabs = queryAllByRole('tab');
	// 10 items in reactionsData minus 8 from the first page
	expect(tabs).toHaveLength(2);
});

it('should not show left navigation button on the first page', async () => {
	await renderReactionsDialog({});

	const reactionsList = await findByRole('tablist');
	expect(reactionsList).toBeDefined();

	expect(screen.queryByRole('button', { name: /left navigate/i })).not.toBeInTheDocument();

	const rightNavigateButton = screen.getByRole('button', { name: /right navigate/i });
	expect(rightNavigateButton).toBeInTheDocument();
});

it('should not show right navigation button on the last page', async () => {
	await renderReactionsDialog({});

	const reactionsList = await findByRole('tablist');
	expect(reactionsList).toBeDefined();

	const rightNavigateButton = screen.getByRole('button', { name: /right navigate/i });
	expect(rightNavigateButton).toBeInTheDocument();

	await userEvent.click(rightNavigateButton);

	const leftNavigateButton = screen.getByRole('button', { name: /left navigate/i });
	expect(leftNavigateButton).toBeInTheDocument();

	expect(screen.queryByRole('button', { name: /right navigate/i })).not.toBeInTheDocument();
});

it('should not render nagivation buttons if there is only one page', async () => {
	await renderReactionsDialog({ reactions: truncatedReactionsData });

	const reactionsList = await findByRole('tablist');
	expect(reactionsList).toBeDefined();

	expect(screen.queryByRole('button', { name: /left navigate/i })).not.toBeInTheDocument();
	expect(screen.queryByRole('button', { name: /right navigate/i })).not.toBeInTheDocument();
});

it('should render the first emoji after navigating to a new page', async () => {
	const spy = jest.fn();
	await renderReactionsDialog({
		handlePaginationChange: spy,
		// 9th emoji in reactionsData - :fire:
		// handlePaginationChange updates selectedEmojiId but we have to pass it as a prop for the test
		selectedEmojiId: '1f525',
	});

	const reactionsList = await findByRole('tablist');
	expect(reactionsList).toBeDefined();

	const rightNavigateButton = screen.getByRole('button', { name: /right navigate/i });
	await userEvent.click(rightNavigateButton);

	// currently on second page, with a max of 2 pages
	expect(spy).toHaveBeenCalledWith('1f525', 2, 2);
});

it('should render user profile card', async () => {
	await renderReactionsDialog({
		// the actual component handles the over hover interaction
		ProfileCardWrapper: () => <div>ProfileCard</div>,
		selectedEmojiId: '1f6bf',
	});

	const reactionsList = await findByRole('tablist');
	expect(reactionsList).toBeDefined();

	const profileCards = await screen.findAllByText('ProfileCard');
	expect(profileCards).toHaveLength(5);
});

it('should not render profile card there is no profile card wrapper', async () => {
	await renderReactionsDialog({});

	const reactionsList = await findByRole('tablist');
	expect(reactionsList).toBeDefined();

	const profileCards = screen.queryByText('ProfileCard');
	expect(profileCards).not.toBeInTheDocument();
});

it('should not render profile card for users that are missing an account id', async () => {
	await renderReactionsDialog({
		reactions: truncatedReactionsData,
		ProfileCardWrapper: () => <div>ProfileCard</div>,
		selectedEmojiId: '1f6bf',
	});

	const reactionsList = await findByRole('tablist');
	expect(reactionsList).toBeDefined();

	const profileCards = screen.queryAllByText('ProfileCard');
	expect(profileCards).toHaveLength(1);
});
