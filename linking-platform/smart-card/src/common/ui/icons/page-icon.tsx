import LegacyIcon from '@atlaskit/icon-file-type/glyph/document/16';
import PageIcon from '@atlaskit/icon/core/page';

import { renderIconTile } from './utils';

const PageIconWithColor = renderIconTile(PageIcon, 'blueBold', LegacyIcon);
PageIconWithColor.displayName = 'PageIconWithColor';

export default PageIconWithColor;
