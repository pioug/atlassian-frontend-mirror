import type { ComponentType } from 'react';

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
import '../utils/vr-preload-link-type-icons';

const generateBlockCardLazyIcons = (Component: React.ComponentType<any>, totalItems: number) =>
	withWaitForItem(Component, () => {
		const item = document.body.querySelectorAll('[data-testid="smart-block-title-resolved-view"]');

		const existingItem = item[totalItems];

		if (!existingItem && item.length) {
			item[item.length - 1].scrollIntoView();
		}

		return existingItem;
	});

export const BlockCardLazyIcon1: ComponentType<any> = generateBlockCardLazyIcons(
	BlockCardLazyIconsExample1,
	4,
);
export const BlockCardLazyIcon2: ComponentType<any> = generateBlockCardLazyIcons(
	BlockCardLazyIconsExample2,
	4,
);
export const BlockCardLazyIcon3: ComponentType<any> = generateBlockCardLazyIcons(
	BlockCardLazyIconsExample3,
	4,
);
export const BlockCardLazyIcon4: ComponentType<any> = generateBlockCardLazyIcons(
	BlockCardLazyIconsExample4,
	4,
);
export const BlockCardLazyIcon5: ComponentType<any> = generateBlockCardLazyIcons(
	BlockCardLazyIconsExample5,
	4,
);
export const BlockCardLazyIcon6: ComponentType<any> = generateBlockCardLazyIcons(
	BlockCardLazyIconsExample6,
	2,
);
export const BlockCardLazyIconsFileType1: ComponentType<any> = generateBlockCardLazyIcons(
	BlockCardLazyIconsFileTypeExample1,
	4,
);
export const BlockCardLazyIconsFileType2: ComponentType<any> = generateBlockCardLazyIcons(
	BlockCardLazyIconsFileTypeExample2,
	4,
);
export const BlockCardLazyIconsFileType3: ComponentType<any> = generateBlockCardLazyIcons(
	BlockCardLazyIconsFileTypeExample3,
	4,
);
export const BlockCardLazyIconsFileType4: ComponentType<any> = generateBlockCardLazyIcons(
	BlockCardLazyIconsFileTypeExample4,
	4,
);
