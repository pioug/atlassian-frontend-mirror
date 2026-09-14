import type { FC } from 'react';

import VideoIcon from '@atlaskit/icon/core/video';

import { renderIconTile } from './render-icon-tile';
import type { AtlaskitIconTileProps } from './types';

const VideoIconWithColor: FC<AtlaskitIconTileProps> = renderIconTile(VideoIcon, 'redBold');
VideoIconWithColor.displayName = 'VideoIconWithColor';

export default VideoIconWithColor;
