import { IconType } from '../../../../constants';
import extractFileFormatIcon from '../extract-file-formatIcon';

describe('extractFileFormatIcon', () => {
	// prettier-ignore
	it.each([
    ['folder', 'folder', IconType.Folder],
    ['document', 'text/plain', IconType.Document],
    ['document', 'application/vnd.oasis.opendocument.text', IconType.Document],
    ['document', 'application/vnd.apple.pages', IconType.Document],
    ['pdf', 'application/pdf', IconType.PDF],
    ['presentation', 'application/vnd.oasis.opendocument.presentation', IconType.Presentation],
    ['presentation', 'application/vnd.apple.keynote', IconType.Presentation],
    ['spreadsheet', 'application/vnd.oasis.opendocument.spreadsheet', IconType.Spreadsheet],
    ['spreadsheet', 'application/vnd.apple.numbers', IconType.Spreadsheet],
    ['Google Docs', 'application/vnd.google-apps.document', IconType.GoogleDocs],
    ['Google Form', 'application/vnd.google-apps.form', IconType.GoogleForms],
    ['Google Sheets', 'application/vnd.google-apps.spreadsheet', IconType.GoogleSheets],
    ['Google Slides', 'application/vnd.google-apps.presentation', IconType.GoogleSlides],
    ['Excel spreadsheet', 'application/vnd.ms-excel', IconType.MSExcel],
    ['Excel spreadsheet', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', IconType.MSExcel],
    ['MS Powerpoint', 'application/vnd.ms-powerpoint', IconType.MSPowerpoint],
    ['MS Powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', IconType.MSPowerpoint],
    ['MS Word', 'application/msword', IconType.MSWord],
    ['MS Word', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', IconType.MSWord],
    ['image', 'image/png', IconType.Image],
    ['image', 'image/jpeg', IconType.Image],
    ['image', 'image/bmp', IconType.Image],
    ['image', 'image/webp', IconType.Image],
    ['image', 'image/svg+xml', IconType.Image],
    ['gif', 'image/gif', IconType.GIF],
    ['audio', 'audio/midi', IconType.Audio],
    ['audio', 'audio/mpeg', IconType.Audio],
    ['audio', 'audio/webm', IconType.Audio],
    ['audio', 'audio/ogg', IconType.Audio],
    ['audio', 'audio/wav', IconType.Audio],
    ['video', 'video/mp4', IconType.Video],
    ['video', 'video/quicktime', IconType.Video],
    ['video', 'video/mov', IconType.Video],
    ['video', 'video/webm', IconType.Video],
    ['video', 'video/ogg', IconType.Video],
    ['video', 'video/x-ms-wmv', IconType.Video],
    ['video', 'video/x-msvideo', IconType.Video],
    ['code', 'text/css', IconType.Code],
    ['code', 'text/html', IconType.Code],
    ['code', 'application/javascript', IconType.Code],
    ['archive', 'application/zip', IconType.Archive],
    ['archive', 'application/x-tar', IconType.Archive],
    ['archive', 'application/x-gtar', IconType.Archive],
    ['archive', 'application/x-7z-compressed', IconType.Archive],
    ['archive', 'application/x-apple-diskimage', IconType.Archive],
    ['archive', 'application/vnd.rar', IconType.Archive],
    ['executable', 'application/dmg', IconType.Executable],
    ['sketch', 'application/sketch', IconType.Sketch],
    ['generic', 'application/octet-stream', IconType.Generic],
    ['generic', 'application/invision.prototype', IconType.Generic],
  ])(`returns %s icon for %s`, (_, fileFormat, expectedIconType) => {
    const { icon} = extractFileFormatIcon(fileFormat) || { };

    expect(icon).toEqual(expectedIconType);
  });

	it('returns undefined if document type does not match', () => {
		const iconDescriptor = extractFileFormatIcon('random');

		expect(iconDescriptor).toBeUndefined();
	});
});
