import React from 'react';
import Loadable from 'react-loadable';

import { CardProps } from '../view/Card';

export const isCardWithData = (props: CardProps) => !!props.data;

export const isSpecialEvent = (evt: React.MouseEvent | React.KeyboardEvent) =>
  evt.isDefaultPrevented() &&
  (isIframe() || isSpecialKey(evt) || isSpecialClick(evt as React.MouseEvent));

export const isIframe = () => window.parent !== parent;

export const isSpecialKey = (event: React.MouseEvent | React.KeyboardEvent) =>
  event.metaKey || event.ctrlKey;

export const isSpecialClick = (event: React.MouseEvent) => event.button === 1;

export const getIconForFileType = (
  fileMimeType: string,
): React.ReactNode | undefined => {
  if (!fileMimeType) {
    return;
  }
  let icon = typeToIcon[fileMimeType.toLowerCase()];
  if (!icon) {
    return;
  }

  const [label, importCb] = icon;

  if (!importCb) {
    return;
  }

  const Icon = Loadable({
    loader: () => importCb().then((module) => module.default),
    loading: () => null,
  }) as any; // because we're using dynamic loading here, TS will not be able to infer the type

  return (<Icon label={label} />) as React.ReactNode;
};

export const getLabelForFileType = (
  fileMimeType: string,
): React.ReactNode | undefined => {
  let icon = typeToIcon[fileMimeType.toLowerCase()];
  if (!icon) {
    return;
  }

  const [label] = icon;

  return label;
};

type iconDescriptor = [string, (() => Promise<any>) | undefined];

const typeToIcon: { [key: string]: iconDescriptor } = {
  'text/plain': [
    'Document',
    () => import('@atlaskit/icon-file-type/glyph/document/16'),
  ],
  'application/vnd.oasis.opendocument.text': [
    'Document',
    () => import('@atlaskit/icon-file-type/glyph/document/16'),
  ],
  'application/vnd.apple.pages': [
    'Document',
    () => import('@atlaskit/icon-file-type/glyph/document/16'),
  ],
  'application/vnd.google-apps.document': [
    'Google Doc',
    () => import('@atlaskit/icon-file-type/glyph/google-doc/16'),
  ],
  'application/msword': [
    'Word document',
    () => import('@atlaskit/icon-file-type/glyph/word-document/16'),
  ],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
    'Word document',
    () => import('@atlaskit/icon-file-type/glyph/word-document/16'),
  ],
  'application/pdf': [
    'PDF document',
    () => import('@atlaskit/icon-file-type/glyph/pdf-document/16'),
  ],
  'application/vnd.oasis.opendocument.spreadsheet': [
    'Spreadsheet',
    () => import('@atlaskit/icon-file-type/glyph/spreadsheet/16'),
  ],
  'application/vnd.apple.numbers': [
    'Spreadsheet',
    () => import('@atlaskit/icon-file-type/glyph/spreadsheet/16'),
  ],
  'application/vnd.google-apps.spreadsheet': [
    'Google Sheet',
    () => import('@atlaskit/icon-file-type/glyph/google-sheet/16'),
  ],
  'application/vnd.ms-excel': [
    'Excel spreadsheet',
    () => import('@atlaskit/icon-file-type/glyph/excel-spreadsheet/16'),
  ],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
    'Excel spreadsheet',
    () => import('@atlaskit/icon-file-type/glyph/excel-spreadsheet/16'),
  ],
  'application/vnd.oasis.opendocument.presentation': [
    'Presentation',
    () => import('@atlaskit/icon-file-type/glyph/presentation/16'),
  ],
  'application/vnd.apple.keynote': [
    'Presentation',
    () => import('@atlaskit/icon-file-type/glyph/presentation/16'),
  ],
  'application/vnd.google-apps.presentation': [
    'Google Slide',
    () => import('@atlaskit/icon-file-type/glyph/google-slide/16'),
  ],
  'application/vnd.ms-powerpoint': [
    'PowerPoint presentation',
    () => import('@atlaskit/icon-file-type/glyph/powerpoint-presentation/16'),
  ],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': [
    'PowerPoint presentation',
    () => import('@atlaskit/icon-file-type/glyph/powerpoint-presentation/16'),
  ],
  'application/vnd.google-apps.form': [
    'Google Form',
    () => import('@atlaskit/icon-file-type/glyph/google-form/16'),
  ],
  'image/png': [
    'Image',
    () => import('@atlaskit/icon-file-type/glyph/image/16'),
  ],
  'image/jpeg': [
    'Image',
    () => import('@atlaskit/icon-file-type/glyph/image/16'),
  ],
  'image/bmp': [
    'Image',
    () => import('@atlaskit/icon-file-type/glyph/image/16'),
  ],
  'image/webp': [
    'Image',
    () => import('@atlaskit/icon-file-type/glyph/image/16'),
  ],
  'image/svg+xml': [
    'Image',
    () => import('@atlaskit/icon-file-type/glyph/image/16'),
  ],
  'image/gif': ['GIF', () => import('@atlaskit/icon-file-type/glyph/gif/16')],
  'audio/midi': [
    'Audio',
    () => import('@atlaskit/icon-file-type/glyph/audio/16'),
  ],
  'audio/mpeg': [
    'Audio',
    () => import('@atlaskit/icon-file-type/glyph/audio/16'),
  ],
  'audio/webm': [
    'Audio',
    () => import('@atlaskit/icon-file-type/glyph/audio/16'),
  ],
  'audio/ogg': [
    'Audio',
    () => import('@atlaskit/icon-file-type/glyph/audio/16'),
  ],
  'audio/wav': [
    'Audio',
    () => import('@atlaskit/icon-file-type/glyph/audio/16'),
  ],
  'video/mp4': [
    'Video',
    () => import('@atlaskit/icon-file-type/glyph/video/16'),
  ],
  'video/quicktime': [
    'Video',
    () => import('@atlaskit/icon-file-type/glyph/video/16'),
  ],
  'video/mov': [
    'Video',
    () => import('@atlaskit/icon-file-type/glyph/video/16'),
  ],
  'video/webm': [
    'Video',
    () => import('@atlaskit/icon-file-type/glyph/video/16'),
  ],
  'video/ogg': [
    'Video',
    () => import('@atlaskit/icon-file-type/glyph/video/16'),
  ],
  'video/x-ms-wmv': [
    'Video',
    () => import('@atlaskit/icon-file-type/glyph/video/16'),
  ],
  'video/x-msvideo': [
    'Video',
    () => import('@atlaskit/icon-file-type/glyph/video/16'),
  ],
  'application/zip': [
    'Archive',
    () => import('@atlaskit/icon-file-type/glyph/archive/16'),
  ],
  'application/x-tar': [
    'Archive',
    () => import('@atlaskit/icon-file-type/glyph/archive/16'),
  ],
  'application/x-gtar': [
    'Archive',
    () => import('@atlaskit/icon-file-type/glyph/archive/16'),
  ],
  'application/x-7z-compressed': [
    'Archive',
    () => import('@atlaskit/icon-file-type/glyph/archive/16'),
  ],
  'application/x-apple-diskimage': [
    'Archive',
    () => import('@atlaskit/icon-file-type/glyph/archive/16'),
  ],
  'application/vnd.rar': [
    'Archive',
    () => import('@atlaskit/icon-file-type/glyph/archive/16'),
  ],
  'application/dmg': [
    'Executable',
    () => import('@atlaskit/icon-file-type/glyph/executable/16'),
  ],
  'text/css': [
    'Source Code',
    () => import('@atlaskit/icon-file-type/glyph/source-code/16'),
  ],
  'text/html': [
    'Source Code',
    () => import('@atlaskit/icon-file-type/glyph/source-code/16'),
  ],
  'application/javascript': [
    'Source Code',
    () => import('@atlaskit/icon-file-type/glyph/source-code/16'),
  ],
  'application/octet-stream': [
    'Binary file',
    () => import('@atlaskit/icon-file-type/glyph/generic/16'),
  ],
  'application/invision.prototype': [
    'Prototype',
    () => import('@atlaskit/icon-file-type/glyph/generic/16'),
  ],

  // TODO: Figure a way to detect those
  'application/sketch': [
    'Sketch',
    () => import('@atlaskit/icon-file-type/glyph/sketch/16'),
  ],

  folder: ['Folder', () => import('@atlaskit/icon-file-type/glyph/folder/16')],
};
