import type { FC } from 'react';

import PageIcon from '@atlaskit/icon/core/page';

import { renderIconTile } from './render-icon-tile';
import type { AtlaskitIconTileProps } from './types';

const PageIconWithColor: FC<AtlaskitIconTileProps> = renderIconTile(PageIcon, 'blueBold');
PageIconWithColor.displayName = 'PageIconWithColor';

export default PageIconWithColor;
