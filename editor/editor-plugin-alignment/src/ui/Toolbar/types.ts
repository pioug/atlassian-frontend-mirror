import type { MessageDescriptor } from 'react-intl-next';

import type { Keymap } from '@atlaskit/editor-common/keymaps';
import type { IconComponent } from '@atlaskit/editor-toolbar';

export type OptionInfo = {
	key: string;
	type: 'menu-item';
	label: MessageDescriptor;
	icon: IconComponent;
	keymap: Keymap;
	rank: number;
};
