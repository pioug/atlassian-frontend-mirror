import LegacyIcon from '@atlaskit/icon-file-type/glyph/document/16';
import LegacyIconLarge from '@atlaskit/icon-file-type/glyph/document/24';
import PageIcon from '@atlaskit/icon/core/page';

import { renderIconPerSize, renderIconTile } from './utils';

const PageIconWithColor = renderIconTile(
	PageIcon,
	'blueBold',
	renderIconPerSize(LegacyIcon, LegacyIconLarge),
);
PageIconWithColor.displayName = 'PageIconWithColor';

export default PageIconWithColor;
