import { createContext } from 'react';

import { type ModalDialogProps, type OnCloseHandler } from '../types';

export type ModalAttributes = {
  /**
   * Test ID passed to the modal dialog.
   */
  testId?: ModalDialogProps['testId'];

  /**
   * Id referenced by the modal dialog's `aria-labelledby` attribute.
   * This id should be assigned to the modal title element.
   */
  titleId: string;

  /**
   * Callback function called when the modal dialog is requesting to be closed,
   * wrapped in modal dialog's analytic event context.
   */
  onClose?: OnCloseHandler;
};

/* eslint-disable @repo/internal/react/require-jsdoc */
export const ModalContext = createContext<ModalAttributes | null>(null);
export const ScrollContext = createContext<boolean | null>(null);
