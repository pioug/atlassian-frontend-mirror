import type { FC } from 'react';

import FolderClosedIcon from '@atlaskit/icon/core/folder-closed';

import type { AtlaskitIconTileProps } from './types';
import { renderIconTile } from './utils';

const FolderClosedIconWithColor: FC<AtlaskitIconTileProps> = renderIconTile(
	FolderClosedIcon,
	'blueBold',
);
FolderClosedIconWithColor.displayName = 'FolderClosedIconWithColor';

export default FolderClosedIconWithColor;
