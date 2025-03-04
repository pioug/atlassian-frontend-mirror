import type { OnSelectItem } from '../types';

import type { ItemData } from './ItemType';

export interface ButtonItemProps extends ItemData {
	isSelected?: boolean;
	isDisabled?: boolean;
	isViewAll?: boolean;
	onItemSelected?: (index: number) => void;
	setSelectedItem?: OnSelectItem;
}
