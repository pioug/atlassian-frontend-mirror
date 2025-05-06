import LegacyIcon from '@atlaskit/icon-file-type/glyph/image/16';
import LegacyIconLarge from '@atlaskit/icon-file-type/glyph/image/24';
import ImageIcon from '@atlaskit/icon/core/image';

import { renderIconPerSize, renderIconTile } from './utils';

const ImageIconWithColor = renderIconTile(
	ImageIcon,
	'yellowBold',
	renderIconPerSize(LegacyIcon, LegacyIconLarge),
);
ImageIconWithColor.displayName = 'ImageIconWithColor';

export default ImageIconWithColor;
