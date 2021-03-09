import { CommencedEventPayload } from './operational/commenced';
import { LoadFailedEventPayload } from './operational/loadFailed';
import { LoadSucceededEventPayload } from './operational/loadSucceeded';
import { PreviewUnsupportedEventPayload } from './operational/previewUnsupported';
import { ZipEntryLoadFailedEventPayload } from './operational/zipEntryLoadFailed';
import { ZipEntryLoadSucceededEventPayload } from './operational/zipEntryLoadSucceeded';
import { ModalEventPayload } from './screen/modal';
import { ClosedEventPayload } from './ui/closed';
import { DownloadButtonClickedEventPayload } from './ui/downloadButtonClicked';
import { FailedPreviewDownloadButtonClickedEventPayload } from './ui/failedPreviewDownloadButtonClicked';
import { NavigatedEventPayload } from './ui/navigated';
import { ZoomInButtonClickEventPayload } from './ui/zoomInButtonClicked';
import { ZoomOutButtonClickEventPayload } from './ui/zoomOutButtonClicked';

export type MediaViewerEventPayload =
  | CommencedEventPayload
  | LoadFailedEventPayload
  | LoadSucceededEventPayload
  | PreviewUnsupportedEventPayload
  | ZipEntryLoadFailedEventPayload
  | ZipEntryLoadSucceededEventPayload
  | ModalEventPayload
  | ClosedEventPayload
  | DownloadButtonClickedEventPayload
  | FailedPreviewDownloadButtonClickedEventPayload
  | NavigatedEventPayload
  | ZoomInButtonClickEventPayload
  | ZoomOutButtonClickEventPayload;
