import FileIcon from '@atlaskit/icon/core/file';

import { renderIconTile } from './utils';

const FileIconWithColor = renderIconTile(FileIcon, 'grayBold');
FileIconWithColor.displayName = 'FileIconWithColor';

export default FileIconWithColor;
