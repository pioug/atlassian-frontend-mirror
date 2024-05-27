import { type RenderResult, waitFor } from '@testing-library/react';
import type { EnzymePropSelector, ReactWrapper } from 'enzyme';

export async function getEmojiTypeAheadItemById(
  container: RenderResult['container'],
  id?: string,
): Promise<Element> {
  const emojiTypeAhead = await waitFor(() =>
    container.querySelector(`.ak-emoji-typeahead-item[data-emoji-id="${id}"]`),
  );
  expect(emojiTypeAhead).not.toBeNull();
  return emojiTypeAhead!;
}

export async function getSelectedEmojiTypeAheadItem(
  container: RenderResult['container'],
): Promise<Element | null> {
  return await waitFor(() =>
    container.querySelector('.emoji-typeahead-selected'),
  );
}

export async function isEmojiTypeAheadItemSelected(
  container: RenderResult['container'],
  id?: string,
): Promise<void> {
  const selectedItem = await getSelectedEmojiTypeAheadItem(container);
  expect(selectedItem).toBeVisible();
  expect(selectedItem).toHaveAttribute('data-emoji-id', id);
}

/**
 * Helper function for tests where explicit calls to update() are needed
 * for Enzyme 3 when React components' internal state has changed
 *
 * Only the root node can be updated but find() can be called on child nodes
 * If no child is passed in, find is called on the root node
 *
 * @param root ReactWrapper to update
 * @param prop Child component to find
 * @param child Optional child of root that find should be called on
 */
export function hasSelector(
  root: ReactWrapper<any, any>,
  prop: EnzymePropSelector,
  child?: ReactWrapper<any, any>,
): boolean {
  const component = child || root;
  root.update();
  return component.find(prop).length > 0;
}
