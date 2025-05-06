import LegacyIcon from '@atlaskit/icon-file-type/glyph/spreadsheet/16';
import LegacyIconLarge from '@atlaskit/icon-file-type/glyph/spreadsheet/24';
import ListBulletedIcon from '@atlaskit/icon/core/list-bulleted';

import { renderIconPerSize, renderIconTile } from './utils';

const ListBulletedIconWithColor = renderIconTile(
	ListBulletedIcon,
	'greenBold',
	renderIconPerSize(LegacyIcon, LegacyIconLarge),
);
ListBulletedIconWithColor.displayName = 'ListBulletedIconWithColor';

export default ListBulletedIconWithColor;
