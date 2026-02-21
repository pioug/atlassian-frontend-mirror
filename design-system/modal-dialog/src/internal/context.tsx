import { type Context, createContext } from 'react';

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
	onClose: OnCloseHandler;

	/**
	 * A boolean for if the onClose is provided. We define a `noop` as our onClose
	 * at the top level, but we need to know if one is provided for the close
	 * button to be rendered.
	 */
	hasProvidedOnClose?: boolean;

	/**
	 * Whether or not the modal is fullscreen (when `width="full"` is passed to the modal).
	 */
	isFullScreen: boolean;
};

/* eslint-disable @repo/internal/react/require-jsdoc */
export const ModalContext: Context<ModalAttributes | null> = createContext<ModalAttributes | null>(
	null,
);
export const ScrollContext: Context<boolean | null> = createContext<boolean | null>(null);
