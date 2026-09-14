import type { ComponentPropsWithoutRef } from 'react';

import type IconTile from '@atlaskit/icon/icon-tile';

import { type SmartLinkSize } from '../../../constants';

export type AtlaskitIconTileProps = Omit<
	ComponentPropsWithoutRef<typeof IconTile>,
	'appearance' | 'icon' | 'size'
> & {
	isTiledIcon?: boolean;
	size?: SmartLinkSize;
};
