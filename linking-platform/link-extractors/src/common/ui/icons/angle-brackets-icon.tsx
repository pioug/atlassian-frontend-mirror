import type { FC } from 'react';

import AngleBracketsIcon from '@atlaskit/icon/core/angle-brackets';

import type { AtlaskitIconTileProps } from './types';
import { renderIconTile } from './utils';

const AngleBracketsIconWithColor: FC<AtlaskitIconTileProps> = renderIconTile(
	AngleBracketsIcon,
	'blueBold',
);
AngleBracketsIconWithColor.displayName = 'AngleBracketsIconWithColor';

export default AngleBracketsIconWithColor;
