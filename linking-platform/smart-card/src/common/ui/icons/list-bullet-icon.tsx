import LegacyIcon from '@atlaskit/icon-file-type/glyph/spreadsheet/16';
import ListBulletedIcon from '@atlaskit/icon/core/list-bulleted';

import { renderIconTile } from './utils';

const ListBulletedIconWithColor = renderIconTile(ListBulletedIcon, 'greenBold', LegacyIcon);
ListBulletedIconWithColor.displayName = 'ListBulletedIconWithColor';

export default ListBulletedIconWithColor;
