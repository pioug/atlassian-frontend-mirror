import { type ThemeAppearance } from '@atlaskit/lozenge';

import { type LozengeItem } from '../types';

export type LozengeActionItemsGroupProps = {
	items: LozengeItem[];
	testId?: string;
	onClick?: (id: string, text: string, appearance?: ThemeAppearance) => Promise<void>;
};
