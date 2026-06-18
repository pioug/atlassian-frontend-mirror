import type { FC } from 'react';

import PageIcon from '@atlaskit/icon/core/page';

import type { AtlaskitIconTileProps } from './types';
import { renderIconTile } from './utils';

const PageIconWithColor: FC<AtlaskitIconTileProps> = renderIconTile(PageIcon, 'blueBold');
PageIconWithColor.displayName = 'PageIconWithColor';

export default PageIconWithColor;
