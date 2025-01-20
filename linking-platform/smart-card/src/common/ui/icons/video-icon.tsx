import LegacyIcon from '@atlaskit/icon-file-type/glyph/video/16';
import VideoIcon from '@atlaskit/icon/core/video';

import { renderIconTile } from './utils';

const VideoIconWithColor = renderIconTile(VideoIcon, 'redBold', LegacyIcon);
VideoIconWithColor.displayName = 'VideoIconWithColor';

export default VideoIconWithColor;
