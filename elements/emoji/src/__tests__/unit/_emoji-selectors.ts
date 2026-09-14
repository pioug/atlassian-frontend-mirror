import { type RenderResult, waitFor } from '@testing-library/react';

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
	return await waitFor(() => container.querySelector('.emoji-typeahead-selected'));
}

export async function isEmojiTypeAheadItemSelected(
	container: RenderResult['container'],
	id?: string,
): Promise<void> {
	const selectedItem = await getSelectedEmojiTypeAheadItem(container);
	expect(selectedItem).toBeVisible();
	expect(selectedItem).toHaveAttribute('data-emoji-id', id);
}
