import { BlockCardLazyIcons as BlockCardLazyIconsExample } from '../utils/block-card-lazy-icons';
import { withWaitForItem } from '../utils/with-wait-for-item';

export const BlockCardLazyIcons = withWaitForItem(BlockCardLazyIconsExample, () => {
	const item = document.body.querySelectorAll('[data-testid="smart-block-title-resolved-view"]');

	const existingItem = item[24];

	if (!existingItem && item.length) {
		item[item.length - 1].scrollIntoView();
	}

	return existingItem;
});
