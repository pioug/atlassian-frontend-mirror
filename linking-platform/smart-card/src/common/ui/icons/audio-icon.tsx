import type { FC } from 'react';

import AudioIcon from '@atlaskit/icon/core/audio';

import { renderIconTile } from './render-icon-tile';
import type { AtlaskitIconTileProps } from './types';

// `redBold` is used while `platform_lp_non_bold_large_sl_icon` is off.
// Clean up in NAVX-5752: https://hello.jira.atlassian.cloud/browse/NAVX-5752
// When that gate is cleaned up, replace `redBold` directly with `red`.
const AudioIconWithColor: FC<AtlaskitIconTileProps> = renderIconTile(AudioIcon, 'redBold');
AudioIconWithColor.displayName = 'AudioIconWithColor';

export default AudioIconWithColor;
