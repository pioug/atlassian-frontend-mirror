import LegacyIcon from '@atlaskit/icon-file-type/glyph/video/16';
import LegacyIconLarge from '@atlaskit/icon-file-type/glyph/video/24';
import VideoIcon from '@atlaskit/icon/core/video';

import { renderIconPerSize, renderIconTile } from './utils';

const VideoIconWithColor = renderIconTile(
	VideoIcon,
	'redBold',
	renderIconPerSize(LegacyIcon, LegacyIconLarge),
);
VideoIconWithColor.displayName = 'VideoIconWithColor';

export default VideoIconWithColor;
