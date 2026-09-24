import type { FC } from 'react';

import ListBulletedIcon from '@atlaskit/icon/core/list-bulleted';

import { renderIconTile } from './render-icon-tile';
import type { AtlaskitIconTileProps } from './types';

// `greenBold` is used while `platform_lp_non_bold_large_sl_icon` is off.
// Clean up in NAVX-5752: https://hello.jira.atlassian.cloud/browse/NAVX-5752
// When that gate is cleaned up, replace `greenBold` directly with `green`.
const ListBulletedIconWithColor: FC<AtlaskitIconTileProps> = renderIconTile(
	ListBulletedIcon,
	'greenBold',
);
ListBulletedIconWithColor.displayName = 'ListBulletedIconWithColor';

export default ListBulletedIconWithColor;
