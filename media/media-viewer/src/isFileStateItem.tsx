import { type FileState } from '@atlaskit/media-client';

import { isExternalImageItem } from './isExternalImageItem';
import type { FileItem } from './item-viewer';

export const isFileStateItem = (fileItem: FileItem): fileItem is FileState =>
	!isExternalImageItem(fileItem);
