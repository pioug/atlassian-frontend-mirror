import type { FC } from 'react';

import ListBulletedIcon from '@atlaskit/icon/core/list-bulleted';

import type { AtlaskitIconTileProps } from './types';
import { renderIconTile } from './utils';

const ListBulletedIconWithColor: FC<AtlaskitIconTileProps> = renderIconTile(
	ListBulletedIcon,
	'greenBold',
);
ListBulletedIconWithColor.displayName = 'ListBulletedIconWithColor';

export default ListBulletedIconWithColor;
