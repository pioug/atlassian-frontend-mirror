import type { FileState } from '@atlaskit/media-state/file-state';

import { isExternalImageItem } from './isExternalImageItem';
import type { FileItem } from './item-viewer';

export const isFileStateItem = (fileItem: FileItem): fileItem is FileState =>
	!isExternalImageItem(fileItem);
