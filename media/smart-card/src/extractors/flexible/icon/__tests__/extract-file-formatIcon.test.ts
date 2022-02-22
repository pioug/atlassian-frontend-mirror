import { IconType } from '../../../../constants';
import extractFileFormatIcon from '../extract-file-formatIcon';

describe('extractFileFormatIcon', () => {
  // prettier-ignore
  it.each([
    ['folder', 'folder', IconType.Folder, 'Folder'],
    ['document', 'text/plain', IconType.Document, 'Document'],
    ['document', 'application/vnd.oasis.opendocument.text', IconType.Document, 'Document'],
    ['document', 'application/vnd.apple.pages', IconType.Document, 'Document'],
    ['pdf', 'application/pdf', IconType.PDF, 'PDF document'],
    ['presentation', 'application/vnd.oasis.opendocument.presentation', IconType.Presentation, 'Presentation'],
    ['presentation', 'application/vnd.apple.keynote', IconType.Presentation, 'Presentation'],
    ['spreadsheet', 'application/vnd.oasis.opendocument.spreadsheet', IconType.Spreadsheet, 'Spreadsheet'],
    ['spreadsheet', 'application/vnd.apple.numbers', IconType.Spreadsheet, 'Spreadsheet'],
    ['Google Docs', 'application/vnd.google-apps.document', IconType.GoogleDocs, 'Google Docs'],
    ['Google Form', 'application/vnd.google-apps.form', IconType.GoogleForms, 'Google Form'],
    ['Google Sheets', 'application/vnd.google-apps.spreadsheet', IconType.GoogleSheets, 'Google Sheets'],
    ['Google Slides', 'application/vnd.google-apps.presentation', IconType.GoogleSlides, 'Google Slides'],
    ['Excel spreadsheet', 'application/vnd.ms-excel', IconType.MSExcel, 'Excel spreadsheet'],
    ['Excel spreadsheet', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', IconType.MSExcel, 'Excel spreadsheet'],
    ['MS Powerpoint', 'application/vnd.ms-powerpoint', IconType.MSPowerpoint, 'PowerPoint presentation'],
    ['MS Powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', IconType.MSPowerpoint, 'PowerPoint presentation'],
    ['MS Word', 'application/msword', IconType.MSWord, 'Word document'],
    ['MS Word', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', IconType.MSWord, 'Word document'],
    ['image', 'image/png', IconType.Image, 'Image'],
    ['image', 'image/jpeg', IconType.Image, 'Image'],
    ['image', 'image/bmp', IconType.Image, 'Image'],
    ['image', 'image/webp', IconType.Image, 'Image'],
    ['image', 'image/svg+xml', IconType.Image, 'Image'],
    ['gif', 'image/gif', IconType.GIF, 'GIF'],
    ['audio', 'audio/midi', IconType.Audio, 'Audio'],
    ['audio', 'audio/mpeg', IconType.Audio, 'Audio'],
    ['audio', 'audio/webm', IconType.Audio, 'Audio'],
    ['audio', 'audio/ogg', IconType.Audio, 'Audio'],
    ['audio', 'audio/wav', IconType.Audio, 'Audio'],
    ['video', 'video/mp4', IconType.Video, 'Video'],
    ['video', 'video/quicktime', IconType.Video, 'Video'],
    ['video', 'video/mov', IconType.Video, 'Video'],
    ['video', 'video/webm', IconType.Video, 'Video'],
    ['video', 'video/ogg', IconType.Video, 'Video'],
    ['video', 'video/x-ms-wmv', IconType.Video, 'Video'],
    ['video', 'video/x-msvideo', IconType.Video, 'Video'],
    ['code', 'text/css', IconType.Code, 'Source Code'],
    ['code', 'text/html', IconType.Code, 'Source Code'],
    ['code', 'application/javascript', IconType.Code, 'Source Code'],
    ['archive', 'application/zip', IconType.Archive, 'Archive'],
    ['archive', 'application/x-tar', IconType.Archive, 'Archive'],
    ['archive', 'application/x-gtar', IconType.Archive, 'Archive'],
    ['archive', 'application/x-7z-compressed', IconType.Archive, 'Archive'],
    ['archive', 'application/x-apple-diskimage', IconType.Archive, 'Archive'],
    ['archive', 'application/vnd.rar', IconType.Archive, 'Archive'],
    ['executable', 'application/dmg', IconType.Executable, 'Executable'],
    ['sketch', 'application/sketch', IconType.Sketch, 'Sketch'],
    ['generic', 'application/octet-stream', IconType.Generic, 'Binary file'],
    ['generic', 'application/invision.prototype', IconType.Generic, 'Prototype'],
  ])(`returns %s icon for %s`, (_, fileFormat, expectedIconType, expectedLabel) => {
    const { icon, label} = extractFileFormatIcon(fileFormat) || { };

    expect(icon).toEqual(expectedIconType);
    expect(label).toEqual(expectedLabel);
  });

  it('returns undefined if document type does not match', () => {
    const iconDescriptor = extractFileFormatIcon('random');

    expect(iconDescriptor).toBeUndefined();
  });
});
