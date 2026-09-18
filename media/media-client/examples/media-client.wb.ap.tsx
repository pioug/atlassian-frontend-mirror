import { wb, type WorkbenchExample } from '@atlassian/workbench';

import GetFileExample from './1-get-file';
import UploaderExample from './1-uploader';
import GetItemsExample from './2-get-items';
import ImageMetadataExample from './2-image-metadata';
import UploadFileExample from './2-upload-file';
import UploadTouchExample from './3-upload-touch';
import ItemsBatchingExample from './4-items-batching';

export const GetFile: WorkbenchExample = wb(GetFileExample);
export const Uploader: WorkbenchExample = wb(UploaderExample);
export const GetItems: WorkbenchExample = wb(GetItemsExample);
export const ImageMetadata: WorkbenchExample = wb(ImageMetadataExample);
export const UploadFile: WorkbenchExample = wb(UploadFileExample);
export const UploadTouch: WorkbenchExample = wb(UploadTouchExample);
export const ItemsBatching: WorkbenchExample = wb(ItemsBatchingExample);
