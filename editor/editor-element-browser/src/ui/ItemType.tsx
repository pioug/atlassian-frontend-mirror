import type { Keymap } from '@atlaskit/editor-common/keymaps';

export interface ItemData {
	index: number;
	title?: string;
	description?: string;
	showDescription?: boolean;
	keyshortcut?: Keymap;
	attributes?: { new?: boolean };
	renderIcon?: () => React.ReactNode;
}

export interface GroupData {
	id: string;
	label: string;
	items: ItemData[];
	attributes?: { new?: boolean };
}
