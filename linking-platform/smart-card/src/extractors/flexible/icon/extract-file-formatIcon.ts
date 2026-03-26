import { fg } from '@atlaskit/platform-feature-flags';

import { IconType } from '../../../constants';

import { type IconDescriptor } from './types';

const extractFileFormatIcon = (fileFormat?: string): IconDescriptor | undefined => {
	const getIconDescriptor = (icon: IconType, label: string): IconDescriptor =>
		fg('platform_navx_smart_link_icon_label_a11y') ? { icon, label } : { icon };

	switch (fileFormat) {
		// Generic documents
		case 'folder':
			return getIconDescriptor(IconType.Folder, 'folder');
		case 'text/plain':
		case 'application/vnd.oasis.opendocument.text':
		case 'application/vnd.apple.pages':
			return getIconDescriptor(IconType.Document, 'document');
		case 'application/pdf':
			return getIconDescriptor(IconType.PDF, 'pdf');
		case 'application/vnd.oasis.opendocument.presentation':
		case 'application/vnd.apple.keynote':
			return getIconDescriptor(IconType.Presentation, 'presentation');
		case 'application/vnd.oasis.opendocument.spreadsheet':
		case 'application/vnd.apple.numbers':
			return getIconDescriptor(IconType.Spreadsheet, 'spreadsheet');
		// Google Drive
		case 'application/vnd.google-apps.document':
			return getIconDescriptor(IconType.GoogleDocs, 'google document');
		case 'application/vnd.google-apps.form':
			return getIconDescriptor(IconType.GoogleForms, 'google form');
		case 'application/vnd.google-apps.spreadsheet':
			return getIconDescriptor(IconType.GoogleSheets, 'google sheet');
		case 'application/vnd.google-apps.presentation':
			return getIconDescriptor(IconType.GoogleSlides, 'google slide');
		// Microsoft
		case 'application/vnd.ms-excel':
		case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
			return getIconDescriptor(IconType.MSExcel, 'excel spreadsheet');
		case 'application/vnd.ms-powerpoint':
		case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
			return getIconDescriptor(IconType.MSPowerpoint, 'powerpoint');
		case 'application/msword':
		case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
			return getIconDescriptor(IconType.MSWord, 'word document');
		case 'image/png':
		case 'image/jpeg':
		case 'image/bmp':
		case 'image/webp':
		case 'image/svg+xml':
			return getIconDescriptor(IconType.Image, 'image');
		case 'image/gif':
			return getIconDescriptor(IconType.GIF, 'gif');
		case 'audio/midi':
		case 'audio/mpeg':
		case 'audio/webm':
		case 'audio/ogg':
		case 'audio/wav':
			return getIconDescriptor(IconType.Audio, 'audio');
		case 'video/mp4':
		case 'video/quicktime':
		case 'video/mov':
		case 'video/webm':
		case 'video/ogg':
		case 'video/x-ms-wmv':
		case 'video/x-msvideo':
			return getIconDescriptor(IconType.Video, 'video');
		// Others
		case 'text/css':
		case 'text/html':
		case 'application/javascript':
			return getIconDescriptor(IconType.Code, 'code');
		case 'application/zip':
		case 'application/x-tar':
		case 'application/x-gtar':
		case 'application/x-7z-compressed':
		case 'application/x-apple-diskimage':
		case 'application/vnd.rar':
			return getIconDescriptor(IconType.Archive, 'archive');
		case 'application/dmg':
			return getIconDescriptor(IconType.Executable, 'disk image');
		case 'application/sketch':
			return getIconDescriptor(IconType.Sketch, 'sketch');
		case 'application/octet-stream':
			return getIconDescriptor(IconType.Generic, 'file');
		case 'application/invision.prototype':
			return getIconDescriptor(IconType.Generic, 'file');
		default:
			return undefined;
	}
};

export default extractFileFormatIcon;
