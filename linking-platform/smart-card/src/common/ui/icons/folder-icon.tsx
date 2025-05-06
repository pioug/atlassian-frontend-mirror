import LegacyIcon from '@atlaskit/icon-file-type/glyph/folder/16';
import LegacyIconLarge from '@atlaskit/icon-file-type/glyph/folder/24';
import FolderClosedIcon from '@atlaskit/icon/core/folder-closed';

import { renderIconPerSize, renderIconTile } from './utils';

const FolderClosedIconWithColor = renderIconTile(
	FolderClosedIcon,
	'blueBold',
	renderIconPerSize(LegacyIcon, LegacyIconLarge),
);
FolderClosedIconWithColor.displayName = 'FolderClosedIconWithColor';

export default FolderClosedIconWithColor;
