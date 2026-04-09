import type { FC } from 'react';

import ImageIcon from '@atlaskit/icon/core/image';

import type { AtlaskitIconTileProps } from './types';
import { renderIconTile } from './utils';

const ImageIconWithColor: FC<AtlaskitIconTileProps> = renderIconTile(ImageIcon, 'yellowBold');
ImageIconWithColor.displayName = 'ImageIconWithColor';

export default ImageIconWithColor;
