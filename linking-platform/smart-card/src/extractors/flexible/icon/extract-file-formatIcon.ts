import { fg } from "@atlaskit/platform-feature-flags";

import { IconType } from '../../../constants';

import { type IconDescriptor } from './types';

const extractFileFormatIcon = (
	fileFormat?: string,
): IconDescriptor | undefined => {
	switch (fileFormat) {
		// Generic documents
		case 'folder':
			return fg('navx-2827-eslint-object-translation-smart-links')
				? {
						icon: IconType.Folder,
					}
				: {
						icon: IconType.Folder,
						// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
						label: 'Folder',
					};
		case 'text/plain':
		case 'application/vnd.oasis.opendocument.text':
		case 'application/vnd.apple.pages':
			return fg('navx-2827-eslint-object-translation-smart-links')
				? {
						icon: IconType.Document,
					}
				: {
						icon: IconType.Document,
						// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
						label: 'Document',
					};
		case 'application/pdf':
			return fg('navx-2827-eslint-object-translation-smart-links')
				? {
						icon: IconType.PDF,
					}
				: {
						icon: IconType.PDF,
						// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
						label: 'PDF document',
					};
		case 'application/vnd.oasis.opendocument.presentation':
		case 'application/vnd.apple.keynote':
			return fg('navx-2827-eslint-object-translation-smart-links')
				? {
						icon: IconType.Presentation,
					}
				: {
						icon: IconType.Presentation,
						// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
						label: 'Presentation',
					};
		case 'application/vnd.oasis.opendocument.spreadsheet':
		case 'application/vnd.apple.numbers':
			return fg('navx-2827-eslint-object-translation-smart-links')
				? {
						icon: IconType.Spreadsheet,
					}
				: {
						icon: IconType.Spreadsheet,
						// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
						label: 'Spreadsheet',
					};
		// Google Drive
		case 'application/vnd.google-apps.document':
			return fg('navx-2827-eslint-object-translation-smart-links')
				? {
						icon: IconType.GoogleDocs,
					}
				: {
						icon: IconType.GoogleDocs,
						// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
						label: 'Google Docs',
					};
		case 'application/vnd.google-apps.form':
			return fg('navx-2827-eslint-object-translation-smart-links')
				? {
						icon: IconType.GoogleForms,
					}
				: {
						icon: IconType.GoogleForms,
						// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
						label: 'Google Form',
					};
		case 'application/vnd.google-apps.spreadsheet':
			return fg('navx-2827-eslint-object-translation-smart-links')
				? {
						icon: IconType.GoogleSheets,
					}
				: {
						icon: IconType.GoogleSheets,
						// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
						label: 'Google Sheets',
					};
		case 'application/vnd.google-apps.presentation':
			return fg('navx-2827-eslint-object-translation-smart-links')
				? {
						icon: IconType.GoogleSlides,
					}
				: {
						icon: IconType.GoogleSlides,
						// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
						label: 'Google Slides',
					};
		// Microsoft
		case 'application/vnd.ms-excel':
		case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
			return fg('navx-2827-eslint-object-translation-smart-links')
				? {
						icon: IconType.MSExcel,
					}
				: {
						icon: IconType.MSExcel,
						// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
						label: 'Excel spreadsheet',
					};
		case 'application/vnd.ms-powerpoint':
		case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
			return fg('navx-2827-eslint-object-translation-smart-links')
				? {
						icon: IconType.MSPowerpoint,
					}
				: {
						icon: IconType.MSPowerpoint,
						// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
						label: 'PowerPoint presentation',
					};
		case 'application/msword':
		case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
			return fg('navx-2827-eslint-object-translation-smart-links')
				? {
						icon: IconType.MSWord,
					}
				: {
						icon: IconType.MSWord,
						// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
						label: 'Word document',
					};
		case 'image/png':
		case 'image/jpeg':
		case 'image/bmp':
		case 'image/webp':
		case 'image/svg+xml':
			return fg('navx-2827-eslint-object-translation-smart-links')
				? {
						icon: IconType.Image,
					}
				: {
						icon: IconType.Image,
						// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
						label: 'Image',
					};
		case 'image/gif':
			return fg('navx-2827-eslint-object-translation-smart-links')
				? {
						icon: IconType.GIF,
					}
				: {
						icon: IconType.GIF,
						// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
						label: 'GIF',
					};
		case 'audio/midi':
		case 'audio/mpeg':
		case 'audio/webm':
		case 'audio/ogg':
		case 'audio/wav':
			return fg('navx-2827-eslint-object-translation-smart-links')
				? {
						icon: IconType.Audio,
					}
				: {
						icon: IconType.Audio,
						// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
						label: 'Audio',
					};
		case 'video/mp4':
		case 'video/quicktime':
		case 'video/mov':
		case 'video/webm':
		case 'video/ogg':
		case 'video/x-ms-wmv':
		case 'video/x-msvideo':
			return fg('navx-2827-eslint-object-translation-smart-links')
				? {
						icon: IconType.Video,
					}
				: {
						icon: IconType.Video,
						// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
						label: 'Video',
					};
		// Others
		case 'text/css':
		case 'text/html':
		case 'application/javascript':
			return fg('navx-2827-eslint-object-translation-smart-links')
				? {
						icon: IconType.Code,
					}
				: {
						icon: IconType.Code,
						// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
						label: 'Source Code',
					};
		case 'application/zip':
		case 'application/x-tar':
		case 'application/x-gtar':
		case 'application/x-7z-compressed':
		case 'application/x-apple-diskimage':
		case 'application/vnd.rar':
			return fg('navx-2827-eslint-object-translation-smart-links')
				? {
						icon: IconType.Archive,
					}
				: {
						icon: IconType.Archive,
						// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
						label: 'Archive',
					};
		case 'application/dmg':
			return fg('navx-2827-eslint-object-translation-smart-links')
				? {
						icon: IconType.Executable,
					}
				: {
						icon: IconType.Executable,
						// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
						label: 'Executable',
					};
		case 'application/sketch':
			return fg('navx-2827-eslint-object-translation-smart-links')
				? {
						icon: IconType.Sketch,
					}
				: {
						icon: IconType.Sketch,
						// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
						label: 'Sketch',
					};
		case 'application/octet-stream':
			return fg('navx-2827-eslint-object-translation-smart-links')
				? {
						icon: IconType.Generic,
					}
				: {
						icon: IconType.Generic,
						// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
						label: 'Binary file',
					};
		case 'application/invision.prototype':
			return fg('navx-2827-eslint-object-translation-smart-links')
				? {
						icon: IconType.Generic,
					}
				: {
						icon: IconType.Generic,
						// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
						label: 'Prototype',
					};
		default:
			return undefined;
	}
};

export default extractFileFormatIcon;
