import React, { RefObject } from 'react';

import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';

import type { WidthNames } from './internal/constants';

export type KeyboardOrMouseEvent =
  | React.MouseEvent<any>
  | React.KeyboardEvent<any>
  | KeyboardEvent;

export type Appearance = 'danger' | 'warning';

export type OnCloseHandler = (
  e: KeyboardOrMouseEvent,
  analyticEvent: UIAnalyticsEvent,
) => void;

export type OnCloseCompleteHandler = (element: HTMLElement) => void;

export type OnOpenCompleteHandler = (
  node: HTMLElement,
  isAppearing: boolean,
) => void;

export type OnStackChangeHandler = (stackIndex: number) => void;

export type { ModalHeaderProps } from './modal-header';
export type { ModalTitleProps } from './modal-title';
export type { ModalBodyProps } from './modal-body';
export type { ModalFooterProps } from './modal-footer';

export type { ModalAttributes } from './internal/context';

export interface ModalDialogProps {
  /**
   * Focus is moved to the first interactive element inside the modal dialog when `true`.
   * Pass an element `ref` to focus on a specific element.
   */
  autoFocus?: boolean | RefObject<HTMLElement | null | undefined>;

  /**
   * Contents of the modal dialog.
   */
  children?: React.ReactNode;

  /**
   * Height of the modal dialog.
   * When unset the modal dialog will grow to fill the viewport and then start overflowing its contents.
   */
  height?: number | string;

  /**
   * Width of the modal dialog.
   * The recommended way to specify modal width is using named size options.
   */
  width?: number | string | WidthNames;

  /**
   * Callback function called when the modal dialog is requesting to be closed.
   */
  onClose?: OnCloseHandler;

  /**
   * Callback function called when the modal dialog has finished closing.
   */
  onCloseComplete?: OnCloseCompleteHandler;

  /**
   * Callback function called when the modal dialog has finished opening.
   */
  onOpenComplete?: OnOpenCompleteHandler;

  /**
   * Callback function called when the modal changes position in the stack.
   */
  onStackChange?: OnStackChangeHandler;

  /**
   * Will set the scroll boundary to the viewport.
   * If set to false, the scroll boundary is set to the modal dialog body.
   */
  shouldScrollInViewport?: boolean;

  /**
   * Calls `onClose` when clicking the blanket behind the modal dialog.
   */
  shouldCloseOnOverlayClick?: boolean;

  /**
   * Calls `onClose` when pressing escape.
   */
  shouldCloseOnEscapePress?: boolean;

  /**
   * Will remove the blanket tinted background color.
   */
  isBlanketHidden?: boolean;

  /**
   * Number representing where in the stack of modals this modal sits.
   * This offsets the modal dialogs vertical position.
   */
  stackIndex?: number;

  /**
   * A `testId` prop is provided for specified elements,
   * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests.

   * If not overridden using `testId` prop in the respective components,
   * this will set `data-testid` on these elements when defined:

   * - Modal dialog - `{testId}`
   * - Modal header - `{testId}--header`
   * - Modal title - `{testId}--title`
   * - Modal body - `{testId}--body`
   * - Modal footer - `{testId}--footer`
   * - Scrollable element - `{testId}--scrollable`
   * - Blanket - `{testId}--blanket`
   */
  testId?: string;
}
