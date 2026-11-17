import type { FC } from 'react';

import AudioIcon from '@atlaskit/icon/core/audio';

import { renderIconTile } from './render-icon-tile';
import type { AtlaskitIconTileProps } from './types';

const AudioIconWithColor: FC<AtlaskitIconTileProps> = renderIconTile(AudioIcon, 'red');
AudioIconWithColor.displayName = 'AudioIconWithColor';

export default AudioIconWithColor;
