import LegacyIcon from '@atlaskit/icon-file-type/glyph/folder/16';
import FolderClosedIcon from '@atlaskit/icon/core/folder-closed';

import { renderIconTile } from './utils';

const FolderClosedIconWithColor = renderIconTile(FolderClosedIcon, 'blueBold', LegacyIcon);
FolderClosedIconWithColor.displayName = 'FolderClosedIconWithColor';

export default FolderClosedIconWithColor;
