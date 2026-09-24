import type { FC } from 'react';

import FileIcon from '@atlaskit/icon/core/file';

import { renderIconTile } from './render-icon-tile';
import type { AtlaskitIconTileProps } from './types';

// `grayBold` is used while `platform_lp_non_bold_large_sl_icon` is off.
// Clean up in NAVX-5752: https://hello.jira.atlassian.cloud/browse/NAVX-5752
// When that gate is cleaned up, replace `grayBold` directly with `gray`.
const FileIconWithColor: FC<AtlaskitIconTileProps> = renderIconTile(FileIcon, 'grayBold');
FileIconWithColor.displayName = 'FileIconWithColor';

export default FileIconWithColor;
