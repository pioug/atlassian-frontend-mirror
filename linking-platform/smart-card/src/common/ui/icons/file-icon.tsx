import LegacyIcon from '@atlaskit/icon-file-type/glyph/generic/16';
import LegacyIconLarge from '@atlaskit/icon-file-type/glyph/generic/24';
import FileIcon from '@atlaskit/icon/core/file';

import { renderIconPerSize, renderIconTile } from './utils';

const FileIconWithColor = renderIconTile(
	FileIcon,
	'grayBold',
	renderIconPerSize(LegacyIcon, LegacyIconLarge),
);
FileIconWithColor.displayName = 'FileIconWithColor';

export default FileIconWithColor;
