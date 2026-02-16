import ListBulletedIcon from '@atlaskit/icon/core/list-bulleted';

import { renderIconTile } from './utils';

const ListBulletedIconWithColor = renderIconTile(ListBulletedIcon, 'greenBold');
ListBulletedIconWithColor.displayName = 'ListBulletedIconWithColor';

export default ListBulletedIconWithColor;
