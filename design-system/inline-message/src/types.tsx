import { type ComponentType } from 'react';

import type { NewCoreIconProps } from '@atlaskit/icon';

export interface Icon {
	defaultLabel: string;
	icon: ComponentType<NewCoreIconProps>;
}

export type IconAppearanceMap = Record<IconAppearance, Icon>;

export type IconAppearance = 'connectivity' | 'confirmation' | 'info' | 'warning' | 'error';

// cannot import from flow types, should be removed after InlineDialog conversion
export type InlineDialogPlacement =
	| 'auto-start'
	| 'auto'
	| 'auto-end'
	| 'top-start'
	| 'top'
	| 'top-end'
	| 'right-start'
	| 'right'
	| 'right-end'
	| 'bottom-end'
	| 'bottom'
	| 'bottom-start'
	| 'left-end'
	| 'left'
	| 'left-start';
