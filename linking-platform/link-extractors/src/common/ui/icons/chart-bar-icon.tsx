import type { FC } from 'react';

import ChartBarIcon from '@atlaskit/icon/core/chart-bar';

import type { AtlaskitIconTileProps } from './types';
import { renderIconTile } from './utils';

const ChartBarIconWithColor: FC<AtlaskitIconTileProps> = renderIconTile(ChartBarIcon, 'purpleBold');
ChartBarIconWithColor.displayName = 'ChartBarIconWithColor';

export default ChartBarIconWithColor;
