import LegacyIcon from '@atlaskit/icon-file-type/glyph/presentation/16';
import ChartBarIcon from '@atlaskit/icon/core/chart-bar';

import { renderIconTile } from './utils';

const ChartBarIconWithColor = renderIconTile(ChartBarIcon, 'purpleBold', LegacyIcon);
ChartBarIconWithColor.displayName = 'ChartBarIconWithColor';

export default ChartBarIconWithColor;
