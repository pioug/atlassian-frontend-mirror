import { IconDescriptor } from './types';
import { IconType } from '../../../constants';

const extractFileFormatIcon = (
  fileFormat?: string,
): IconDescriptor | undefined => {
  switch (fileFormat) {
    // Generic documents
    case 'folder':
      return [IconType.Folder, 'Folder'];
    case 'text/plain':
    case 'application/vnd.oasis.opendocument.text':
    case 'application/vnd.apple.pages':
      return [IconType.Document, 'Document'];
    case 'application/pdf':
      return [IconType.PDF, 'PDF document'];
    case 'application/vnd.oasis.opendocument.presentation':
    case 'application/vnd.apple.keynote':
      return [IconType.Presentation, 'Presentation'];
    case 'application/vnd.oasis.opendocument.spreadsheet':
    case 'application/vnd.apple.numbers':
      return [IconType.Spreadsheet, 'Spreadsheet'];
    // Google Drive
    case 'application/vnd.google-apps.document':
      return [IconType.GoogleDocs, 'Google Docs'];
    case 'application/vnd.google-apps.form':
      return [IconType.GoogleForms, 'Google Form'];
    case 'application/vnd.google-apps.spreadsheet':
      return [IconType.GoogleSheets, 'Google Sheets'];
    case 'application/vnd.google-apps.presentation':
      return [IconType.GoogleSlides, 'Google Slides'];
    // Microsoft
    case 'application/vnd.ms-excel':
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      return [IconType.MSExcel, 'Excel spreadsheet'];
    case 'application/vnd.ms-powerpoint':
    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      return [IconType.MSPowerpoint, 'PowerPoint presentation'];
    case 'application/msword':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return [IconType.MSWord, 'Word document'];
    case 'image/png':
    case 'image/jpeg':
    case 'image/bmp':
    case 'image/webp':
    case 'image/svg+xml':
      return [IconType.Image, 'Image'];
    case 'image/gif':
      return [IconType.GIF, 'GIF'];
    case 'audio/midi':
    case 'audio/mpeg':
    case 'audio/webm':
    case 'audio/ogg':
    case 'audio/wav':
      return [IconType.Audio, 'Audio'];
    case 'video/mp4':
    case 'video/quicktime':
    case 'video/mov':
    case 'video/webm':
    case 'video/ogg':
    case 'video/x-ms-wmv':
    case 'video/x-msvideo':
      return [IconType.Video, 'Video'];
    // Others
    case 'text/css':
    case 'text/html':
    case 'application/javascript':
      return [IconType.Code, 'Source Code'];
    case 'application/zip':
    case 'application/x-tar':
    case 'application/x-gtar':
    case 'application/x-7z-compressed':
    case 'application/x-apple-diskimage':
    case 'application/vnd.rar':
      return [IconType.Archive, 'Archive'];
    case 'application/dmg':
      return [IconType.Executable, 'Executable'];
    case 'application/sketch':
      return [IconType.Sketch, 'Sketch'];
    case 'application/octet-stream':
      return [IconType.Generic, 'Binary file'];
    case 'application/invision.prototype':
      return [IconType.Generic, 'Prototype'];
    default:
      return undefined;
  }
};

export default extractFileFormatIcon;
