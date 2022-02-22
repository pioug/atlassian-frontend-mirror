import { IconDescriptor } from './types';
import { IconType } from '../../../constants';

const extractFileFormatIcon = (
  fileFormat?: string,
): IconDescriptor | undefined => {
  switch (fileFormat) {
    // Generic documents
    case 'folder':
      return { icon: IconType.Folder, label: 'Folder' };
    case 'text/plain':
    case 'application/vnd.oasis.opendocument.text':
    case 'application/vnd.apple.pages':
      return { icon: IconType.Document, label: 'Document' };
    case 'application/pdf':
      return { icon: IconType.PDF, label: 'PDF document' };
    case 'application/vnd.oasis.opendocument.presentation':
    case 'application/vnd.apple.keynote':
      return { icon: IconType.Presentation, label: 'Presentation' };
    case 'application/vnd.oasis.opendocument.spreadsheet':
    case 'application/vnd.apple.numbers':
      return { icon: IconType.Spreadsheet, label: 'Spreadsheet' };
    // Google Drive
    case 'application/vnd.google-apps.document':
      return { icon: IconType.GoogleDocs, label: 'Google Docs' };
    case 'application/vnd.google-apps.form':
      return { icon: IconType.GoogleForms, label: 'Google Form' };
    case 'application/vnd.google-apps.spreadsheet':
      return { icon: IconType.GoogleSheets, label: 'Google Sheets' };
    case 'application/vnd.google-apps.presentation':
      return { icon: IconType.GoogleSlides, label: 'Google Slides' };
    // Microsoft
    case 'application/vnd.ms-excel':
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      return { icon: IconType.MSExcel, label: 'Excel spreadsheet' };
    case 'application/vnd.ms-powerpoint':
    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      return { icon: IconType.MSPowerpoint, label: 'PowerPoint presentation' };
    case 'application/msword':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return { icon: IconType.MSWord, label: 'Word document' };
    case 'image/png':
    case 'image/jpeg':
    case 'image/bmp':
    case 'image/webp':
    case 'image/svg+xml':
      return { icon: IconType.Image, label: 'Image' };
    case 'image/gif':
      return { icon: IconType.GIF, label: 'GIF' };
    case 'audio/midi':
    case 'audio/mpeg':
    case 'audio/webm':
    case 'audio/ogg':
    case 'audio/wav':
      return { icon: IconType.Audio, label: 'Audio' };
    case 'video/mp4':
    case 'video/quicktime':
    case 'video/mov':
    case 'video/webm':
    case 'video/ogg':
    case 'video/x-ms-wmv':
    case 'video/x-msvideo':
      return { icon: IconType.Video, label: 'Video' };
    // Others
    case 'text/css':
    case 'text/html':
    case 'application/javascript':
      return { icon: IconType.Code, label: 'Source Code' };
    case 'application/zip':
    case 'application/x-tar':
    case 'application/x-gtar':
    case 'application/x-7z-compressed':
    case 'application/x-apple-diskimage':
    case 'application/vnd.rar':
      return { icon: IconType.Archive, label: 'Archive' };
    case 'application/dmg':
      return { icon: IconType.Executable, label: 'Executable' };
    case 'application/sketch':
      return { icon: IconType.Sketch, label: 'Sketch' };
    case 'application/octet-stream':
      return { icon: IconType.Generic, label: 'Binary file' };
    case 'application/invision.prototype':
      return { icon: IconType.Generic, label: 'Prototype' };
    default:
      return undefined;
  }
};

export default extractFileFormatIcon;
