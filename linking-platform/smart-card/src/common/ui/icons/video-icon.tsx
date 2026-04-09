import type { FC } from 'react';

import VideoIcon from '@atlaskit/icon/core/video';

import type { AtlaskitIconTileProps } from './types';
import { renderIconTile } from './utils';

const VideoIconWithColor: FC<AtlaskitIconTileProps> = renderIconTile(VideoIcon, 'redBold');
VideoIconWithColor.displayName = 'VideoIconWithColor';

export default VideoIconWithColor;
