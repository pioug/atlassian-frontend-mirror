// Based on https://developer.atlassian.com/platform/media/learning/file-previews/
export const isImageMimeTypeSupportedByServer = (mimeType: string) =>
  [
    'image/bmp',
    'image/x-windows-bmp',
    'application/dicom',
    'image/gif',
    'image/jpeg',
    'image/jpg',
    'image/jp_',
    'application/jpg',
    'application/x-jpg',
    'image/png',
    'application/png',
    'application/x-png',
    'application/vnd.adobe.photoshop',
    'image/vnd.adobe.photoshop',
    'image/photoshop',
    'image/x-photoshop',
    'image/psd',
    'application/photoshop',
    'application/psd',
    'zz-application/zz-winassoc-psd',
    'image/tiff',
    'image/x-tif',
    'image/x-tiff',
    'application/tif',
    'application/x-tif',
    'application/tiff',
    'application/x-tiff',
    'image/svg+xml',
    'image/heif',
    'image/heif-sequence',
    'image/heic',
    'image/heic-sequence',
  ].indexOf(mimeType.toLowerCase()) > -1;

export const isDocumentMimeTypeSupportedByServer = (mimeType: string) =>
  [
    // Adobe PDF
    'application/pdf',
    'application/x-pdf',
    'application/acrobat',
    'applications/vnd.pdf',
    'text/pdf',
    'text/x-pdf',
    // Adobe Illustrator
    'application/vnd.adobe.illustrator',
    // Microsoft Office
    'application/vnd.ms-office',
    // Microsoft Word
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
    'application/vnd.ms-word.document.macroenabled.12',
    'application/vnd.ms-word.template.macroenabled.12',
    // Microsoft Excel
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
    'application/vnd.ms-excel.sheet.macroenabled.12',
    'application/vnd.ms-excel.template.macroenabled.12',
    'application/vnd.ms-excel.addin.macroenabled.12',
    'application/vnd.ms-excel.sheet.macroenabled',
    'application/vnd.ms-excel.template.macroenabled',
    'application/vnd.ms-excel.addin.macroenabled',
    // Microsoft Powerpoint
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.presentationml.template',
    'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
    'application/vnd.ms-powerpoint.presentation.macroenabled.12',
    'application/vnd.ms-powerpoint.template.macroenabled.12',
    'application/vnd.ms-powerpoint.slideshow.macroenabled.12',
    // OpenOffice
    'application/vnd.sun.xml.writer',
    'application/vnd.sun.xml.writer.template',
    // OpenDocument
    'application/vnd.sun.xml.draw',
    'application/vnd.sun.xml.draw.template',
    'application/vnd.oasis.opendocument.graphics',
    'application/vnd.oasis.opendocument.presentation',
    'application/x-vnd.oasis.opendocument.presentation',
    'application/vnd.sun.xml.calc',
    'application/vnd.sun.xml.calc.template',
    'application/vnd.oasis.opendocument.spreadsheet',
    'application/x-vnd.oasis.opendocument.spreadsheet',
    'application/vnd.oasis.opendocument.spreadsheet-template',
    'application/vnd.oasis.opendocument.text',
    'application/vnd.oasis.opendocument.text-template',
    'application/vnd.oasis.opendocument.text-master',
    'application/x-vnd.oasis.opendocument.text',
    'application/x-vnd.oasis.opendocument.text-template',
    'application/x-vnd.oasis.opendocument.text-master',
    // WordPerfect
    'application/vnd.wordperfect',
    // Text files
    'text/csv',
    'text/x-diff',
    'text/x-perl',
    'text/x-python',
    'text/x-ruby',
    'text/rtf',
    'text/richtext',
    'text/plain',
    'application/txt',
    // Rich text
    'application/rtf',
    'application/x-rtf',
    // PostScript
    'application/postscript',
  ].indexOf(mimeType.toLowerCase()) > -1;

export const isAudioMimeTypeSupportedByServer = (mimeType: string) =>
  [
    'audio/aac',
    'audio/x-hx-aac-adts',
    'audio/vnd.dolby.dd-raw',
    'audio/aiff',
    'audio/x-aiff',
    'audio/x-monkeys-audio',
    'audio/x-ape',
    'audio/basic',
    'audio/flac',
    'audio/mp4',
    'audio/midi',
    'audio/x-matroska',
    'audio/x-mod',
    'audio/mpeg',
    'audio/ogg',
    'audio/x-ogg',
    'audio/x-pn-realaudio',
    'audio/wav',
    'audio/x-wav',
    'audio/x-ms-wma',
  ].indexOf(mimeType.toLowerCase()) > -1;

export const isVideoMimeTypeSupportedByServer = (mimeType: string) =>
  [
    'video/3gpp',
    'video/3gpp2',
    'video/x-ms-asf',
    'video/avi',
    'video/msvideo',
    'video/x-msvideo',
    'video/x-dv',
    'video/x-flv',
    'video/m2ts',
    'video/x-m4v',
    'video/x-matroska',
    'video/quicktime',
    'video/mp4',
    'video/mpeg',
    'video/ogg',
    'video/x-ogg',
    'video/webm',
    'video/x-ms-wmv',
  ].indexOf(mimeType.toLowerCase()) > -1;

// BMPT-620: The backend momentarily returns this mimeType for cloud files imported via dt-api-mediapicker
// Once these cloud files are processed they are receiving a more relevant mimeType
export const isUnknownMimeTypeSupportedByServer = (mimeType: string) =>
  ['binary/octet-stream'].indexOf(mimeType.toLowerCase()) > -1;

export const isMimeTypeSupportedByServer = (mimeType: string) =>
  isImageMimeTypeSupportedByServer(mimeType) ||
  isDocumentMimeTypeSupportedByServer(mimeType) ||
  isAudioMimeTypeSupportedByServer(mimeType) ||
  isVideoMimeTypeSupportedByServer(mimeType) ||
  isUnknownMimeTypeSupportedByServer(mimeType);
