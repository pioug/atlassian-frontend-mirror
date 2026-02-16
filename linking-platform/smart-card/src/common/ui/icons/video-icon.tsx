import VideoIcon from '@atlaskit/icon/core/video';

import { renderIconTile } from './utils';

const VideoIconWithColor = renderIconTile(VideoIcon, 'redBold');
VideoIconWithColor.displayName = 'VideoIconWithColor';

export default VideoIconWithColor;
