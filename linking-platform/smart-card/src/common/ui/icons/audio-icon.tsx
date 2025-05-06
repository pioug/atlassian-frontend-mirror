import LegacyIcon from '@atlaskit/icon-file-type/glyph/audio/16';
import LegacyIconLarge from '@atlaskit/icon-file-type/glyph/audio/24';
import AudioIcon from '@atlaskit/icon/core/audio';

import { renderIconPerSize, renderIconTile } from './utils';

const AudioIconWithColor = renderIconTile(
	AudioIcon,
	'redBold',
	renderIconPerSize(LegacyIcon, LegacyIconLarge),
);
AudioIconWithColor.displayName = 'AudioIconWithColor';

export default AudioIconWithColor;
