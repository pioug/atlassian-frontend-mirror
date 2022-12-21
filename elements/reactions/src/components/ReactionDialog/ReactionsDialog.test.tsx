import React from 'react';

import { fireEvent, screen, within } from '@testing-library/dom';

import { EmojiProvider } from '@atlaskit/emoji/resource';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';

import { renderWithIntl } from '../../__tests__/_testing-library';

import { ReactionsDialog, ReactionsDialogProps } from './ReactionsDialog';

const emojiIds = [
  '1f6bf', //:shower:
  '1f6c1', //:bathtub:
  '1f44d', //:thumbsup:
  '2764',
  '1f525',
  '1f9fa',
  '1f9fb',
  '1f9fc',
  '1f9fd',
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

const { findByText, findByRole, queryAllByText, queryAllByRole } = screen;

const renderReactionsDialog = (
  extraProps: Partial<ReactionsDialogProps> = {},
) => {
  return renderWithIntl(
    <ReactionsDialog
      reactions={reactionsData.slice(0, 4)}
      emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
      handleCloseReactionsDialog={mockHandleCloseReactionsDialog}
      selectedEmojiId="1f44d"
      {...extraProps}
    />,
  );
};

it('should display reactions count', async () => {
  renderReactionsDialog();

  const totalCommentCount = await findByText('40 reactions');
  expect(totalCommentCount).toBeTruthy();
});

it('should display a list of reaction tabs', async () => {
  renderReactionsDialog();

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
  renderReactionsDialog();

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
  renderReactionsDialog();

  const reactionView = await findByRole('tabpanel');
  expect(reactionView).toBeDefined();

  // selected reaction is thumbsup
  expect(within(reactionView).getByLabelText(':thumbsup:')).toBeDefined();
  expect(within(reactionView).getByText('thumbs up')).toBeDefined();
});

it('should alphabetically sort users for the selected reaction', async () => {
  renderReactionsDialog();

  const names = queryAllByText(/\w*\s\w*-test/);

  expect(names).toHaveLength(4);
  expect(names[0].textContent).toBe('Ada Lovelace-test');
  expect(names[1].textContent).toBe('Bette Davis-test');
  expect(names[2].textContent).toBe('Harper Lee-test');
  expect(names[3].textContent).toBe('Lucy Liu-test');
});

it('should fire handleSelectReaction when a reaction is selected', async () => {
  const spy = jest.fn();
  renderReactionsDialog({ handleSelectReaction: spy });

  const reactionsList = await findByRole('tablist');
  expect(reactionsList).toBeDefined();

  const elements = queryAllByRole('tab');

  fireEvent.click(elements[0]);

  expect(spy).toHaveBeenCalled();
});
