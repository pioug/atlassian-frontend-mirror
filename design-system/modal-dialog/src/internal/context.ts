import { createContext } from 'react';

import { ModalDialogProps, OnCloseHandler } from '../types';

export type ModalAttributes = {
  /**
   * Test id passed to the modal dialog.
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

export const ModalContext = createContext<ModalAttributes | null>(null);

export const ScrollContext = createContext<boolean | null>(null);
