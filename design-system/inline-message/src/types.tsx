import { type ComponentType } from 'react';

import type { NewCoreIconProps } from '@atlaskit/icon';

export interface Icon {
	defaultLabel: string;
	icon: ComponentType<NewCoreIconProps>;
}

export type IconAppearanceMap = Record<IconAppearance, Icon>;

export type IconAppearance = 'connectivity' | 'confirmation' | 'info' | 'warning' | 'error';

export type IconSpacing = 'spacious' | 'compact';

// Using Popup's placement type after InlineDialog conversion
export type { Placement as PopupPlacement } from '@atlaskit/popper';
