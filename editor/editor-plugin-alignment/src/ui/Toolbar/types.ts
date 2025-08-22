import type { MessageDescriptor } from 'react-intl-next';

import type { Keymap } from '@atlaskit/editor-common/keymaps';
import type { IconComponent } from '@atlaskit/editor-toolbar';

export type OptionInfo = {
	icon: IconComponent;
	key: string;
	keymap: Keymap;
	label: MessageDescriptor;
	rank: number;
	type: 'menu-item';
};
