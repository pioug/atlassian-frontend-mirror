import type { FC } from 'react';

import VideoIcon from '@atlaskit/icon/core/video';

import { renderIconTile } from './render-icon-tile';
import type { AtlaskitIconTileProps } from './types';

// `redBold` is used while `platform_lp_non_bold_large_sl_icon` is off.
// Clean up in NAVX-5752: https://hello.jira.atlassian.cloud/browse/NAVX-5752
// When that gate is cleaned up, replace `redBold` directly with `red`.
const VideoIconWithColor: FC<AtlaskitIconTileProps> = renderIconTile(VideoIcon, 'redBold');
VideoIconWithColor.displayName = 'VideoIconWithColor';

export default VideoIconWithColor;
