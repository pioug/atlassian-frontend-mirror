import { IconType } from '../../../constants';

import { type IconDescriptor } from './types';

const extractFileFormatIcon = (
	fileFormat?: string,
): IconDescriptor | undefined => {
	switch (fileFormat) {
		// Generic documents
		case 'folder':
			return {
						icon: IconType.Folder,
					};
		case 'text/plain':
		case 'application/vnd.oasis.opendocument.text':
		case 'application/vnd.apple.pages':
			return {
						icon: IconType.Document,
					};
		case 'application/pdf':
			return {
						icon: IconType.PDF,
					};
		case 'application/vnd.oasis.opendocument.presentation':
		case 'application/vnd.apple.keynote':
			return {
						icon: IconType.Presentation,
					};
		case 'application/vnd.oasis.opendocument.spreadsheet':
		case 'application/vnd.apple.numbers':
			return {
						icon: IconType.Spreadsheet,
					};
		// Google Drive
		case 'application/vnd.google-apps.document':
			return {
						icon: IconType.GoogleDocs,
					};
		case 'application/vnd.google-apps.form':
			return {
						icon: IconType.GoogleForms,
					};
		case 'application/vnd.google-apps.spreadsheet':
			return {
						icon: IconType.GoogleSheets,
					};
		case 'application/vnd.google-apps.presentation':
			return {
						icon: IconType.GoogleSlides,
					};
		// Microsoft
		case 'application/vnd.ms-excel':
		case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
			return {
						icon: IconType.MSExcel,
					};
		case 'application/vnd.ms-powerpoint':
		case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
			return {
						icon: IconType.MSPowerpoint,
					};
		case 'application/msword':
		case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
			return {
						icon: IconType.MSWord,
					};
		case 'image/png':
		case 'image/jpeg':
		case 'image/bmp':
		case 'image/webp':
		case 'image/svg+xml':
			return {
						icon: IconType.Image,
					};
		case 'image/gif':
			return {
						icon: IconType.GIF,
					};
		case 'audio/midi':
		case 'audio/mpeg':
		case 'audio/webm':
		case 'audio/ogg':
		case 'audio/wav':
			return {
						icon: IconType.Audio,
					};
		case 'video/mp4':
		case 'video/quicktime':
		case 'video/mov':
		case 'video/webm':
		case 'video/ogg':
		case 'video/x-ms-wmv':
		case 'video/x-msvideo':
			return {
						icon: IconType.Video,
					};
		// Others
		case 'text/css':
		case 'text/html':
		case 'application/javascript':
			return {
						icon: IconType.Code,
					};
		case 'application/zip':
		case 'application/x-tar':
		case 'application/x-gtar':
		case 'application/x-7z-compressed':
		case 'application/x-apple-diskimage':
		case 'application/vnd.rar':
			return {
						icon: IconType.Archive,
					};
		case 'application/dmg':
			return {
						icon: IconType.Executable,
					};
		case 'application/sketch':
			return {
						icon: IconType.Sketch,
					};
		case 'application/octet-stream':
			return {
						icon: IconType.Generic,
					};
		case 'application/invision.prototype':
			return {
						icon: IconType.Generic,
					};
		default:
			return undefined;
	}
};

export default extractFileFormatIcon;
