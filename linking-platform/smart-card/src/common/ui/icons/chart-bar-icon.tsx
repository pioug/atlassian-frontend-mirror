import type { FC } from 'react';

import ChartBarIcon from '@atlaskit/icon/core/chart-bar';

import { renderIconTile } from './render-icon-tile';
import type { AtlaskitIconTileProps } from './types';

// `purpleBold` is used while `platform_lp_non_bold_large_sl_icon` is off.
// Clean up in NAVX-5752: https://hello.jira.atlassian.cloud/browse/NAVX-5752
// When that gate is cleaned up, replace `purpleBold` directly with `purple`.
const ChartBarIconWithColor: FC<AtlaskitIconTileProps> = renderIconTile(ChartBarIcon, 'purpleBold');
ChartBarIconWithColor.displayName = 'ChartBarIconWithColor';

export default ChartBarIconWithColor;
