import type { FC } from 'react';

import FileIcon from '@atlaskit/icon/core/file';

import type { AtlaskitIconTileProps } from './types';
import { renderIconTile } from './utils';

const FileIconWithColor: FC<AtlaskitIconTileProps> = renderIconTile(FileIcon, 'grayBold');
FileIconWithColor.displayName = 'FileIconWithColor';

export default FileIconWithColor;
