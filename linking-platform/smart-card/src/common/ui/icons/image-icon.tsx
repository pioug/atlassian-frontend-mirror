import type { FC } from 'react';

import ImageIcon from '@atlaskit/icon/core/image';

import { renderIconTile } from './render-icon-tile';
import type { AtlaskitIconTileProps } from './types';

// `yellowBold` is used while `platform_lp_non_bold_large_sl_icon` is off.
// Clean up in NAVX-5752: https://hello.jira.atlassian.cloud/browse/NAVX-5752
// When that gate is cleaned up, replace `yellowBold` directly with `yellow`.
const ImageIconWithColor: FC<AtlaskitIconTileProps> = renderIconTile(ImageIcon, 'yellowBold');
ImageIconWithColor.displayName = 'ImageIconWithColor';

export default ImageIconWithColor;
