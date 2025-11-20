/* eslint-disable @atlassian/i18n/no-literal-string-in-object */
import { IconType } from '../../../constants';

import { type IconDescriptor } from './types';

const extractFileFormatIcon = (fileFormat?: string): IconDescriptor | undefined => {
	switch (fileFormat) {
		// Generic documents
		case 'folder':
			// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
			return { icon: IconType.Folder, label: 'Folder' };
		case 'text/plain':
		case 'application/vnd.oasis.opendocument.text':
		case 'application/vnd.apple.pages':
			// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
			return { icon: IconType.Document, label: 'Document' };
		case 'application/pdf':
			// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
			return { icon: IconType.PDF, label: 'PDF document' };
		case 'application/vnd.oasis.opendocument.presentation':
		case 'application/vnd.apple.keynote':
			// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
			return { icon: IconType.Presentation, label: 'Presentation' };
		case 'application/vnd.oasis.opendocument.spreadsheet':
		case 'application/vnd.apple.numbers':
			// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
			return { icon: IconType.Spreadsheet, label: 'Spreadsheet' };
		// Google Drive
		case 'application/vnd.google-apps.document':
			// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
			return { icon: IconType.GoogleDocs, label: 'Google Docs' };
		case 'application/vnd.google-apps.form':
			// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
			return { icon: IconType.GoogleForms, label: 'Google Form' };
		case 'application/vnd.google-apps.spreadsheet':
			// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
			return { icon: IconType.GoogleSheets, label: 'Google Sheets' };
		case 'application/vnd.google-apps.presentation':
			// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
			return { icon: IconType.GoogleSlides, label: 'Google Slides' };
		// Microsoft
		case 'application/vnd.ms-excel':
		case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
			// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
			return { icon: IconType.MSExcel, label: 'Excel spreadsheet' };
		case 'application/vnd.ms-powerpoint':
		case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
			// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
			return { icon: IconType.MSPowerpoint, label: 'PowerPoint presentation' };
		case 'application/msword':
		case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
			// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
			return { icon: IconType.MSWord, label: 'Word document' };
		case 'image/png':
		case 'image/jpeg':
		case 'image/bmp':
		case 'image/webp':
		case 'image/svg+xml':
			// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
			return { icon: IconType.Image, label: 'Image' };
		case 'image/gif':
			// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
			return { icon: IconType.GIF, label: 'GIF' };
		case 'audio/midi':
		case 'audio/mpeg':
		case 'audio/webm':
		case 'audio/ogg':
		case 'audio/wav':
			// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
			return { icon: IconType.Audio, label: 'Audio' };
		case 'video/mp4':
		case 'video/quicktime':
		case 'video/mov':
		case 'video/webm':
		case 'video/ogg':
		case 'video/x-ms-wmv':
		case 'video/x-msvideo':
			// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
			return { icon: IconType.Video, label: 'Video' };
		// Others
		case 'text/css':
		case 'text/html':
		case 'application/javascript':
			// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
			return { icon: IconType.Code, label: 'Source Code' };
		case 'application/zip':
		case 'application/x-tar':
		case 'application/x-gtar':
		case 'application/x-7z-compressed':
		case 'application/x-apple-diskimage':
		case 'application/vnd.rar':
			// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
			return { icon: IconType.Archive, label: 'Archive' };
		case 'application/dmg':
			// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
			return { icon: IconType.Executable, label: 'Executable' };
		case 'application/sketch':
			// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
			return { icon: IconType.Sketch, label: 'Sketch' };
		case 'application/octet-stream':
			// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
			return { icon: IconType.Generic, label: 'Binary file' };
		case 'application/invision.prototype':
			// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
			return { icon: IconType.Generic, label: 'Prototype' };
		default:
			return undefined;
	}
};

export default extractFileFormatIcon;
