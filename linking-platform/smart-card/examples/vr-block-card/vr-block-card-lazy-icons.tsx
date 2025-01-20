import {
	BlockCardLazyIcons as BlockCardLazyIconsExample,
	BlockCardLazyIconsFileType as BlockCardLazyIconsFileTypeExample,
} from '../utils/block-card-lazy-icons';
import { withWaitForItem } from '../utils/with-wait-for-item';

const generateBlockCardLazyIcons = (Component: React.ComponentType<unknown>, totalItems: number) =>
	withWaitForItem(Component, () => {
		const item = document.body.querySelectorAll('[data-testid="smart-block-title-resolved-view"]');

		const existingItem = item[totalItems];

		if (!existingItem && item.length) {
			item[item.length - 1].scrollIntoView();
		}

		return existingItem;
	});

export const BlockCardLazyIcons = generateBlockCardLazyIcons(BlockCardLazyIconsExample, 24);
export const BlockCardLazyIconsFileType = generateBlockCardLazyIcons(
	BlockCardLazyIconsFileTypeExample,
	20,
);
