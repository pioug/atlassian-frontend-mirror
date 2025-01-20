import LegacyIcon from '@atlaskit/icon-file-type/glyph/image/16';
import ImageIcon from '@atlaskit/icon/core/image';

import { renderIconTile } from './utils';

const ImageIconWithColor = renderIconTile(ImageIcon, 'yellowBold', LegacyIcon);
ImageIconWithColor.displayName = 'ImageIconWithColor';

export default ImageIconWithColor;
