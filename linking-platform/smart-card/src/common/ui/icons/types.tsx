import type { ComponentPropsWithoutRef } from 'react';

import { IconTile } from '@atlaskit/icon';

import { SmartLinkSize } from '../../../constants';

export type AtlaskitIconTileProps = Omit<
	ComponentPropsWithoutRef<typeof IconTile>,
	'appearance' | 'icon' | 'size'
> & {
	size?: SmartLinkSize;
};
