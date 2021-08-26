import { ModalDialogProps } from '../types';

import { width, WidthNames } from './constants';

export const dialogWidth = (input?: ModalDialogProps['width']) => {
  if (!input) {
    return 'auto';
  }

  const isWidthName = width.values.indexOf(input.toString()) !== -1;
  const widthName = isWidthName && (input as WidthNames);

  if (widthName) {
    return `${width.widths[widthName]}px`;
  }

  return typeof input === 'number' ? `${input}px` : input;
};

export const dialogHeight = (input?: ModalDialogProps['height']) => {
  if (!input) {
    return 'auto';
  }

  return typeof input === 'number' ? `${input}px` : input;
};
