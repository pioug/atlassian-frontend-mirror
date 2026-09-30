import { IconType } from '../../../../constants';
import extractFileFormatIcon from '../extract-file-formatIcon';

describe('extractFileFormatIcon', () => {
	describe('semantic labels on descriptor', () => {
		// prettier-ignore
		it.each([
    ['folder', 'folder', IconType.Folder, 'folder'],
    ['document', 'text/plain', IconType.Document, 'document'],
    ['document', 'application/vnd.oasis.opendocument.text', IconType.Document, 'document'],
    ['document', 'application/vnd.apple.pages', IconType.Document, 'document'],
    ['pdf', 'application/pdf', IconType.PDF, 'pdf'],
    ['presentation', 'application/vnd.oasis.opendocument.presentation', IconType.Presentation, 'presentation'],
    ['presentation', 'application/vnd.apple.keynote', IconType.Presentation, 'presentation'],
    ['spreadsheet', 'application/vnd.oasis.opendocument.spreadsheet', IconType.Spreadsheet, 'spreadsheet'],
    ['spreadsheet', 'application/vnd.apple.numbers', IconType.Spreadsheet, 'spreadsheet'],
    ['Google Docs', 'application/vnd.google-apps.document', IconType.GoogleDocs, 'google document'],
    ['Google Form', 'application/vnd.google-apps.form', IconType.GoogleForms, 'google form'],
    ['Google Sheets', 'application/vnd.google-apps.spreadsheet', IconType.GoogleSheets, 'google sheet'],
    ['Google Slides', 'application/vnd.google-apps.presentation', IconType.GoogleSlides, 'google slide'],
    ['Excel spreadsheet', 'application/vnd.ms-excel', IconType.MSExcel, 'excel spreadsheet'],
    ['Excel spreadsheet', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', IconType.MSExcel, 'excel spreadsheet'],
    ['MS Powerpoint', 'application/vnd.ms-powerpoint', IconType.MSPowerpoint, 'powerpoint'],
    ['MS Powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', IconType.MSPowerpoint, 'powerpoint'],
    ['MS Word', 'application/msword', IconType.MSWord, 'word document'],
    ['MS Word', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', IconType.MSWord, 'word document'],
    ['image', 'image/png', IconType.Image, 'image'],
    ['image', 'image/jpeg', IconType.Image, 'image'],
    ['image', 'image/bmp', IconType.Image, 'image'],
    ['image', 'image/webp', IconType.Image, 'image'],
    ['image', 'image/svg+xml', IconType.Image, 'image'],
    ['gif', 'image/gif', IconType.GIF, 'gif'],
    ['audio', 'audio/midi', IconType.Audio, 'audio'],
    ['audio', 'audio/mpeg', IconType.Audio, 'audio'],
    ['audio', 'audio/webm', IconType.Audio, 'audio'],
    ['audio', 'audio/ogg', IconType.Audio, 'audio'],
    ['audio', 'audio/wav', IconType.Audio, 'audio'],
    ['video', 'video/mp4', IconType.Video, 'video'],
    ['video', 'video/quicktime', IconType.Video, 'video'],
    ['video', 'video/mov', IconType.Video, 'video'],
    ['video', 'video/webm', IconType.Video, 'video'],
    ['video', 'video/ogg', IconType.Video, 'video'],
    ['video', 'video/x-ms-wmv', IconType.Video, 'video'],
    ['video', 'video/x-msvideo', IconType.Video, 'video'],
    ['code', 'text/css', IconType.Code, 'code'],
    ['code', 'text/html', IconType.Code, 'code'],
    ['code', 'application/javascript', IconType.Code, 'code'],
    ['archive', 'application/zip', IconType.Archive, 'archive'],
    ['archive', 'application/x-tar', IconType.Archive, 'archive'],
    ['archive', 'application/x-gtar', IconType.Archive, 'archive'],
    ['archive', 'application/x-7z-compressed', IconType.Archive, 'archive'],
    ['archive', 'application/x-apple-diskimage', IconType.Archive, 'archive'],
    ['archive', 'application/vnd.rar', IconType.Archive, 'archive'],
    ['executable', 'application/dmg', IconType.Executable, 'disk image'],
    ['sketch', 'application/sketch', IconType.Sketch, 'sketch'],
    ['generic', 'application/octet-stream', IconType.Generic, 'file'],
    ['generic', 'application/invision.prototype', IconType.Generic, 'file'],
  ])(`returns %s icon for %s`, (_, fileFormat, expectedIconType, expectedLabel) => {
			const { icon, label } = extractFileFormatIcon(fileFormat) || {};

			expect(icon).toEqual(expectedIconType);
			expect(label).toEqual(expectedLabel);
		});
	});

	it('returns undefined if document type does not match', () => {
		const iconDescriptor = extractFileFormatIcon('random');

		expect(iconDescriptor).toBeUndefined();
	});
});
