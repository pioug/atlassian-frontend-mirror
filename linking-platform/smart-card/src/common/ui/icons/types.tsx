import type { ComponentPropsWithoutRef } from 'react';

import { type IconTile } from '@atlaskit/icon';

import { type SmartLinkSize } from '../../../constants';

export type AtlaskitIconTileProps = Omit<
	ComponentPropsWithoutRef<typeof IconTile>,
	'appearance' | 'icon' | 'size'
> & {
	size?: SmartLinkSize;
};
