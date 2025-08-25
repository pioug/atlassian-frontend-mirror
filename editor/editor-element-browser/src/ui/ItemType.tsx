import type { Keymap } from '@atlaskit/editor-common/keymaps';

export interface ItemData {
	attributes?: { new?: boolean };
	description?: string;
	index: number;
	keyshortcut?: Keymap;
	renderIcon?: () => React.ReactNode;
	showDescription?: boolean;
	title?: string;
}

export interface GroupData {
	attributes?: { new?: boolean };
	id: string;
	items: ItemData[];
	label: string;
}
