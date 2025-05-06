import LegacyIcon from '@atlaskit/icon-file-type/glyph/source-code/16';
import LegacyIconLarge from '@atlaskit/icon-file-type/glyph/source-code/24';
import AngleBracketsIcon from '@atlaskit/icon/core/angle-brackets';

import { renderIconPerSize, renderIconTile } from './utils';

const AngleBracketsIconWithColor = renderIconTile(
	AngleBracketsIcon,
	'blueBold',
	renderIconPerSize(LegacyIcon, LegacyIconLarge),
);
AngleBracketsIconWithColor.displayName = 'AngleBracketsIconWithColor';

export default AngleBracketsIconWithColor;
