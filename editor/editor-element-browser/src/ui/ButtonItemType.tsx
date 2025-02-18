import { Keymap } from '@atlaskit/editor-common/keymaps';

export interface ButtonItemProps {
	index: number;
	title?: string;
	description?: string;
	keyshortcut?: Keymap;
	isSelected?: boolean;
	attributes?: { new?: boolean };
	renderIcon?: () => React.ReactNode;
	onItemSelected?: (index: number) => void;
}
