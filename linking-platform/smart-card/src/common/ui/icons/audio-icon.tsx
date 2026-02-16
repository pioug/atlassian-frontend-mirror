import AudioIcon from '@atlaskit/icon/core/audio';

import { renderIconTile } from './utils';

const AudioIconWithColor = renderIconTile(AudioIcon, 'redBold');
AudioIconWithColor.displayName = 'AudioIconWithColor';

export default AudioIconWithColor;
