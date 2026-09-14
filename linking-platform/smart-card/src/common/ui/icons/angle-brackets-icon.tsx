import type { FC } from 'react';

import AngleBracketsIcon from '@atlaskit/icon/core/angle-brackets';

import { renderIconTile } from './render-icon-tile';
import type { AtlaskitIconTileProps } from './types';

const AngleBracketsIconWithColor: FC<AtlaskitIconTileProps> = renderIconTile(
	AngleBracketsIcon,
	'blueBold',
);
AngleBracketsIconWithColor.displayName = 'AngleBracketsIconWithColor';

export default AngleBracketsIconWithColor;
