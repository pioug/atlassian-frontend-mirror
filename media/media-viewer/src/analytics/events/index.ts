import { type CommencedEventPayload } from './operational/commenced';
import { type LoadFailedEventPayload } from './operational/loadFailed';
import {
	type DownloadFailedEventPayload,
	type DownloadSucceededEventPayload,
} from './operational/download';
import { type LoadSucceededEventPayload } from './operational/loadSucceeded';
import { type PreviewUnsupportedEventPayload } from './operational/previewUnsupported';
import { type ZipEntryLoadFailedEventPayload } from './operational/zipEntryLoadFailed';
import { type ZipEntryLoadSucceededEventPayload } from './operational/zipEntryLoadSucceeded';
import { type ModalEventPayload } from './screen/modal';
import { type PdfPasswordInputScreenEventPayload } from './screen/pdfPasswordInput';
import { type PasswordPdfScreenEventPayload } from './screen/passwordPdf';
import { type ClosedEventPayload } from './ui/closed';
import { type DownloadButtonClickedEventPayload } from './ui/downloadButtonClicked';
import { type FailedPreviewDownloadButtonClickedEventPayload } from './ui/failedPreviewDownloadButtonClicked';
import { type NavigatedEventPayload } from './ui/navigated';
import { type ZoomInButtonClickEventPayload } from './ui/zoomInButtonClicked';
import { type ZoomOutButtonClickEventPayload } from './ui/zoomOutButtonClicked';

export type MediaViewerEventPayload =
	| CommencedEventPayload
	| LoadFailedEventPayload
	| LoadSucceededEventPayload
	| PreviewUnsupportedEventPayload
	| ZipEntryLoadFailedEventPayload
	| ZipEntryLoadSucceededEventPayload
	| ModalEventPayload
	| PdfPasswordInputScreenEventPayload
	| PasswordPdfScreenEventPayload
	| ClosedEventPayload
	| DownloadButtonClickedEventPayload
	| FailedPreviewDownloadButtonClickedEventPayload
	| NavigatedEventPayload
	| ZoomInButtonClickEventPayload
	| ZoomOutButtonClickEventPayload
	| DownloadFailedEventPayload
	| DownloadSucceededEventPayload;
