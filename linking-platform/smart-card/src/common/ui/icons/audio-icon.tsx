import LegacyIcon from '@atlaskit/icon-file-type/glyph/audio/16';
import AudioIcon from '@atlaskit/icon/core/audio';

import { renderIconTile } from './utils';

const AudioIconWithColor = renderIconTile(AudioIcon, 'redBold', LegacyIcon);
AudioIconWithColor.displayName = 'AudioIconWithColor';

export default AudioIconWithColor;
