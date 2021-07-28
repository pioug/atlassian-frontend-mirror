import { FileInfo } from './imageMetaData/types';
import PdfDocumentIcon from '@atlaskit/icon-file-type/glyph/pdf-document/24';
import GifIcon from '@atlaskit/icon-file-type/glyph/gif/24';
import PowerpointPresentationIcon from '@atlaskit/icon-file-type/glyph/powerpoint-presentation/24';
import WordDocumentIcon from '@atlaskit/icon-file-type/glyph/word-document/24';
import SketchIcon from '@atlaskit/icon-file-type/glyph/sketch/24';
import FigmaIcon from '@atlaskit/icon-file-type/glyph/figma/24';
import ExecutableIcon from '@atlaskit/icon-file-type/glyph/executable/24';
import GoogleDocIcon from '@atlaskit/icon-file-type/glyph/google-doc/24';
import GoogleFormIcon from '@atlaskit/icon-file-type/glyph/google-form/24';
import GoogleSheetIcon from '@atlaskit/icon-file-type/glyph/google-sheet/24';
import GoogleSlideIcon from '@atlaskit/icon-file-type/glyph/google-slide/24';
import ExcelSpreadsheetIcon from '@atlaskit/icon-file-type/glyph/excel-spreadsheet/24';
import SpreadsheetIcon from '@atlaskit/icon-file-type/glyph/spreadsheet/24';
import PresentationIcon from '@atlaskit/icon-file-type/glyph/presentation/24';
import SourceCodeIcon from '@atlaskit/icon-file-type/glyph/source-code/24';
import { isCodeViewerItem } from './codeViewer';

export function dataURItoFile(
  dataURI: string,
  filename: string = 'untitled',
): File {
  if (dataURI.length === 0) {
    throw new Error('dataURI not found');
  }

  // convert base64/URLEncoded data component to raw binary data held in a string
  const dataURIParts = dataURI.split(',');
  const byteString =
    dataURIParts[0].indexOf('base64') >= 0
      ? atob(dataURIParts[1])
      : decodeURIComponent(dataURIParts[1]);

  // separate out the mime component
  let mimeString;
  try {
    mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  } catch (e) {
    // https://stackoverflow.com/questions/1176022/unknown-file-type-mime
    mimeString = 'application/octet-stream';
  }

  // write the bytes of the string to a typed array
  const intArray = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    intArray[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([intArray], { type: mimeString });
  try {
    return new File([blob], filename, { type: mimeString });
  } catch (e) {
    // IE11 does not allow the File constructor (yay!)
    // we get around this by decorating the blob instance with File properties
    // effectively casting up from Blob to File.
    const ie11File: any = blob;
    const date = new Date();
    ie11File.lastModified = date.getTime();
    ie11File.lastModifiedDate = date;
    ie11File.name = filename;
    ie11File.webkitRelativePath = '';
    return ie11File;
  }
}

export function fileToDataURI(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      const result = reader.result;
      if (typeof result === 'string') {
        resolve(result);
      } else if (result === null) {
        reject();
      }
    });
    reader.addEventListener('error', reject);
    reader.readAsDataURL(blob);
  });
}

export async function getFileInfo(file: File, src?: string): Promise<FileInfo> {
  return {
    file,
    src: src || (await fileToDataURI(file)),
  };
}

export async function getFileInfoFromSrc(
  src: string,
  file?: File,
): Promise<FileInfo> {
  return {
    file: file || (await dataURItoFile(src)),
    src,
  };
}

export function fileToArrayBuffer(file: File): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      const array = new Uint8Array(reader.result as ArrayBuffer);
      resolve(array);
    });
    reader.addEventListener('error', reject);
    reader.readAsArrayBuffer(file);
  });
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      resolve(img);
    };
    img.onerror = reject;
  });
}

export function readImageNaturalOrientationFromDOM(img: HTMLImageElement) {
  img.style.position = 'absolute';
  img.style.visibility = 'hidden';
  document.body.appendChild(img);
  const { width, height } = img.getBoundingClientRect();
  document.body.removeChild(img);
  return { width, height };
}

export const findParentByClassname = (
  element: HTMLElement,
  className: string,
  maxParentElement: HTMLElement = document.body,
): HTMLElement | undefined => {
  if (element.classList.contains(className)) {
    return element;
  }

  let currentElement = element;

  while (currentElement.parentElement !== maxParentElement) {
    if (currentElement.parentElement) {
      currentElement = currentElement.parentElement;

      if (currentElement.classList.contains(className)) {
        return currentElement;
      }
    } else {
      return undefined;
    }
  }

  return undefined;
};
interface MimeTypesRepresentation {
  label: string;
  mimeTypes: string[];
  icon: any;
}

const mimeTypes: MimeTypesRepresentation[] = [
  {
    label: 'pdf',
    mimeTypes: ['application/pdf'],
    icon: PdfDocumentIcon,
  },
  {
    label: 'google-form',
    mimeTypes: ['application/vnd.google-apps.form'],
    icon: GoogleFormIcon,
  },
  {
    label: 'google-slides',
    mimeTypes: ['application/vnd.google-apps.presentation'],
    icon: GoogleSlideIcon,
  },
  {
    label: 'google-form',
    mimeTypes: ['application/vnd.google-apps.form'],
    icon: GoogleFormIcon,
  },
  {
    label: 'google-sheets',
    mimeTypes: ['application/vnd.google-apps.spreadsheet'],
    icon: GoogleSheetIcon,
  },
  {
    label: 'google-docs',
    mimeTypes: [
      'application/vnd.google-apps.document',
      'application/vnd.google-apps.kix',
    ],
    icon: GoogleDocIcon,
  },
  {
    label: 'microsoft-word',
    mimeTypes: [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.word',
    ],
    icon: WordDocumentIcon,
  },
  {
    label: 'presentation',
    mimeTypes: [
      'application/x-iwork-keynote-sffkey',
      'application/vnd.oasis.opendocument.presentation',
    ],
    icon: PresentationIcon,
  },
  {
    label: 'powerpoint-presentation',
    mimeTypes: [
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-powerpoint',
    ],
    icon: PowerpointPresentationIcon,
  },
  {
    label: 'giphy',
    mimeTypes: ['image/gif'],
    icon: GifIcon,
  },
  {
    label: 'spreadsheet',
    mimeTypes: ['text/csv'],
    icon: SpreadsheetIcon,
  },
  {
    label: 'excel-spreadsheet',
    mimeTypes: [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/x-iwork-keynote-sffnumbers',
    ],
    icon: ExcelSpreadsheetIcon,
  },
];

/*
 * Returns a label and icon
 */
export function getMimeIcon(mimeType: string, fileName: string) {
  // based on the mimeType, determine the corresponding icon and label
  const iconInfo = mimeTypes.find(
    (file) => file.mimeTypes.indexOf(mimeType) > -1,
  );

  //return the appropriate icon and its label if we have it
  if (iconInfo) {
    return iconInfo;
  }

  if (isCodeViewerItem(fileName)) {
    return { label: 'source-code', icon: SourceCodeIcon };
  }

  // we are not able to determine what icon to render based on the mimeType
  // hence we render the icon based on the filename
  if (fileName.match(/.*\.sketch$/)) {
    return { label: 'sketch', icon: SketchIcon };
  }
  if (fileName.match(/.*\.fig$/)) {
    return { label: 'figma', icon: FigmaIcon };
  }
  if (fileName.match(/.*\.exe$/) || fileName.match(/.*\.dmg$/)) {
    return { label: 'executable', icon: ExecutableIcon };
  }

  // cannot find a corresponding mimeType icon.
  return undefined;
}

export const getIframeSandboxAttribute = (isTrusted: boolean) =>
  isTrusted
    ? undefined
    : 'allow-downloads allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts';
