import type { FC } from 'react';

import AudioIcon from '@atlaskit/icon/core/audio';

import type { AtlaskitIconTileProps } from './types';
import { renderIconTile } from './utils';

const AudioIconWithColor: FC<AtlaskitIconTileProps> = renderIconTile(AudioIcon, 'redBold');
AudioIconWithColor.displayName = 'AudioIconWithColor';

export default AudioIconWithColor;
