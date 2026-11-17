import type { FC } from 'react';

import ChartBarIcon from '@atlaskit/icon/core/chart-bar';

import { renderIconTile } from './render-icon-tile';
import type { AtlaskitIconTileProps } from './types';

const ChartBarIconWithColor: FC<AtlaskitIconTileProps> = renderIconTile(ChartBarIcon, 'purple');
ChartBarIconWithColor.displayName = 'ChartBarIconWithColor';

export default ChartBarIconWithColor;
