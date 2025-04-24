import { withWaitForItem } from '@atlaskit/link-test-helpers';

import {
	BlockCardLazyIconsExample1,
	BlockCardLazyIconsExample2,
	BlockCardLazyIconsExample3,
	BlockCardLazyIconsExample4,
	BlockCardLazyIconsExample5,
	BlockCardLazyIconsExample6,
	BlockCardLazyIconsFileTypeExample1,
	BlockCardLazyIconsFileTypeExample2,
	BlockCardLazyIconsFileTypeExample3,
	BlockCardLazyIconsFileTypeExample4,
} from '../utils/block-card-lazy-icons';

const generateBlockCardLazyIcons = (Component: React.ComponentType<any>, totalItems: number) =>
	withWaitForItem(Component, () => {
		const item = document.body.querySelectorAll('[data-testid="smart-block-title-resolved-view"]');

		const existingItem = item[totalItems];

		if (!existingItem && item.length) {
			item[item.length - 1].scrollIntoView();
		}

		return existingItem;
	});

export const BlockCardLazyIcon1 = generateBlockCardLazyIcons(BlockCardLazyIconsExample1, 4);
export const BlockCardLazyIcon2 = generateBlockCardLazyIcons(BlockCardLazyIconsExample2, 4);
export const BlockCardLazyIcon3 = generateBlockCardLazyIcons(BlockCardLazyIconsExample3, 4);
export const BlockCardLazyIcon4 = generateBlockCardLazyIcons(BlockCardLazyIconsExample4, 4);
export const BlockCardLazyIcon5 = generateBlockCardLazyIcons(BlockCardLazyIconsExample5, 4);
export const BlockCardLazyIcon6 = generateBlockCardLazyIcons(BlockCardLazyIconsExample6, 2);
export const BlockCardLazyIconsFileType1 = generateBlockCardLazyIcons(
	BlockCardLazyIconsFileTypeExample1,
	4,
);
export const BlockCardLazyIconsFileType2 = generateBlockCardLazyIcons(
	BlockCardLazyIconsFileTypeExample2,
	4,
);
export const BlockCardLazyIconsFileType3 = generateBlockCardLazyIcons(
	BlockCardLazyIconsFileTypeExample3,
	4,
);
export const BlockCardLazyIconsFileType4 = generateBlockCardLazyIcons(
	BlockCardLazyIconsFileTypeExample4,
	4,
);
