import type { FC } from 'react';

import FolderClosedIcon from '@atlaskit/icon/core/folder-closed';

import { renderIconTile } from './render-icon-tile';
import type { AtlaskitIconTileProps } from './types';

const FolderClosedIconWithColor: FC<AtlaskitIconTileProps> = renderIconTile(
	FolderClosedIcon,
	'blueBold',
);
FolderClosedIconWithColor.displayName = 'FolderClosedIconWithColor';

export default FolderClosedIconWithColor;
