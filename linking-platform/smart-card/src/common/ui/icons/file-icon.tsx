import LegacyIcon from '@atlaskit/icon-file-type/glyph/generic/16';
import FileIcon from '@atlaskit/icon/core/file';

import { renderIconTile } from './utils';

const FileIconWithColor = renderIconTile(FileIcon, 'grayBold', LegacyIcon);
FileIconWithColor.displayName = 'FileIconWithColor';

export default FileIconWithColor;
