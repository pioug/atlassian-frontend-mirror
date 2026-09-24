import type { FC } from 'react';

import PageIcon from '@atlaskit/icon/core/page';

import { renderIconTile } from './render-icon-tile';
import type { AtlaskitIconTileProps } from './types';

// `blueBold` is used while `platform_lp_non_bold_large_sl_icon` is off.
// Clean up in NAVX-5752: https://hello.jira.atlassian.cloud/browse/NAVX-5752
// When that gate is cleaned up, replace `blueBold` directly with `blue`.
const PageIconWithColor: FC<AtlaskitIconTileProps> = renderIconTile(PageIcon, 'blueBold');
PageIconWithColor.displayName = 'PageIconWithColor';

export default PageIconWithColor;
