import LegacyIcon from '@atlaskit/icon-file-type/glyph/source-code/16';
import AngleBracketsIcon from '@atlaskit/icon/core/angle-brackets';

import { renderIconTile } from './utils';

const AngleBracketsIconWithColor = renderIconTile(AngleBracketsIcon, 'blueBold', LegacyIcon);
AngleBracketsIconWithColor.displayName = 'AngleBracketsIconWithColor';

export default AngleBracketsIconWithColor;
