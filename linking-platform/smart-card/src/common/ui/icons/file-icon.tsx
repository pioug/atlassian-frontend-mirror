import type { FC } from 'react';

import FileIcon from '@atlaskit/icon/core/file';

import { renderIconTile } from './render-icon-tile';
import type { AtlaskitIconTileProps } from './types';

const FileIconWithColor: FC<AtlaskitIconTileProps> = renderIconTile(FileIcon, 'grayBold');
FileIconWithColor.displayName = 'FileIconWithColor';

export default FileIconWithColor;
