import PageIcon from '@atlaskit/icon/core/page';

import { renderIconTile } from './utils';

const PageIconWithColor = renderIconTile(PageIcon, 'blueBold');
PageIconWithColor.displayName = 'PageIconWithColor';

export default PageIconWithColor;
