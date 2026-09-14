import type { FC } from 'react';

import ImageIcon from '@atlaskit/icon/core/image';

import { renderIconTile } from './render-icon-tile';
import type { AtlaskitIconTileProps } from './types';

const ImageIconWithColor: FC<AtlaskitIconTileProps> = renderIconTile(ImageIcon, 'yellowBold');
ImageIconWithColor.displayName = 'ImageIconWithColor';

export default ImageIconWithColor;
