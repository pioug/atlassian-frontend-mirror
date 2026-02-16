import ImageIcon from '@atlaskit/icon/core/image';

import { renderIconTile } from './utils';

const ImageIconWithColor = renderIconTile(ImageIcon, 'yellowBold');
ImageIconWithColor.displayName = 'ImageIconWithColor';

export default ImageIconWithColor;
