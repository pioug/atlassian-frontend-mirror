import type { FC } from 'react';

import ListBulletedIcon from '@atlaskit/icon/core/list-bulleted';

import { renderIconTile } from './render-icon-tile';
import type { AtlaskitIconTileProps } from './types';

const ListBulletedIconWithColor: FC<AtlaskitIconTileProps> = renderIconTile(
	ListBulletedIcon,
	'greenBold',
);
ListBulletedIconWithColor.displayName = 'ListBulletedIconWithColor';

export default ListBulletedIconWithColor;
