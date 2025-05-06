import LegacyIcon from '@atlaskit/icon-file-type/glyph/presentation/16';
import LegacyIconLarge from '@atlaskit/icon-file-type/glyph/presentation/24';
import ChartBarIcon from '@atlaskit/icon/core/chart-bar';

import { renderIconPerSize, renderIconTile } from './utils';

const ChartBarIconWithColor = renderIconTile(
	ChartBarIcon,
	'purpleBold',
	renderIconPerSize(LegacyIcon, LegacyIconLarge),
);
ChartBarIconWithColor.displayName = 'ChartBarIconWithColor';

export default ChartBarIconWithColor;
