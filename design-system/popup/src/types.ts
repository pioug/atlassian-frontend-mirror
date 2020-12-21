import {
  ComponentType,
  CSSProperties,
  Dispatch,
  ReactNode,
  Ref,
  SetStateAction,
} from 'react';

import { Placement, PopperChildrenProps } from '@atlaskit/popper';

export interface TriggerProps {
  ref: Ref<HTMLElement>;
  'aria-controls'?: string;
  'aria-expanded': boolean;
  'aria-haspopup': boolean;
}

export type PopupRef = HTMLDivElement | null;
export type TriggerRef = HTMLElement | null;

export interface ContentProps {
  /**
   * Will reposition the popup if any of the content has changed.
   * Useful for when positions change and the popup was not aware.
   */
  update: PopperChildrenProps['update'];

  /**
   * Passed through from the parent popup.
   */
  isOpen: boolean;

  /**
   * Passed through from the parent popup.
   */
  onClose: (() => void) | undefined;

  /**
   * Escape hatch to set the initial focus for a specific element when the popup is opened.
   */
  setInitialFocusRef: Dispatch<SetStateAction<HTMLElement | null>>;
}

export interface PopupComponentProps {
  /**
   * Children passed passed through by the parent popup.
   */
  children: ReactNode;

  /**
   * Placement passed through by the parent popup.
   */
  'data-placement': Placement;

  /**
   * Test id passed through by the parent popup.
   */
  'data-testid'?: string;

  /**
   * Id passed through by the parent popup.
   */
  id?: string;

  /**
   * Ref that should be assigned to the root element.
   */
  ref: Ref<HTMLDivElement>;

  /**
   * Style that should be assigned to the root element.
   */
  style: CSSProperties;

  /**
   * Tab index passed through by the parent popup.
   */
  tabIndex: number | undefined;
}

interface BaseProps {
  /**
   * Used to either show or hide the popup.
   * When set to `false` popup will not render anything to the DOM.
   */
  isOpen: boolean;

  /**
   * Render props for content that is displayed inside the popup.
   */
  content: (props: ContentProps) => React.ReactNode;

  /**
   * Id that is assigned to the popup container element.
   */
  id?: string;

  /**
   * Distance the popup should be offset from the reference in the format of [along, away] (units in px).
   * Defaults to [0, 8] - which means the popup will be 8px away from the edge of the reference specified
   * by the `placement` prop.
   */
  offset?: [number, number];

  /**
   * Placement of where the popup should be displayed relative to the trigger element.
   * Defaults to `"auto"`.
   */
  placement?: Placement;

  /**
   * The boundary element that the popup will check for overflow.
   * Defaults to `"clippingParents"` which are parent scroll containers,
   * but can be set to any element.
   */
  boundary?: 'clippingParents' | HTMLElement;

  /**
   * The root boundary that the popup will check for overflow.
   * Defaults to `"viewport"` but can be set to `"document"`.
   */
  rootBoundary?: 'viewport' | 'document';

  /**
   * Allows the Popup to be placed on the opposite side of its trigger if it does not fit in the viewport.
   * Defaults to `true`.
   */
  shouldFlip?: boolean;

  /**
   * A `testId` prop is provided for specified elements,
   * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests.
   */
  testId?: string;

  /**
   * Handler that is called when the popup wants to close itself.
   * Generally this will be either when clicking away from the popup or pressing the escape key.
   * You'll want to use this to set open state accordingly and then pump it back into the `isOpen` prop.
   */
  onClose?(): void;

  /**
   * The element that is shown when `isOpen` prop is `true`.
   * The result of the `content` prop will be placed as children here.
   * Defaults to an element with an elevation of `e200` with _no padding_.
   */
  popupComponent?: ComponentType<PopupComponentProps>;

  /**
   * Controls whether the popup takes focus when opening.
   * This changes the `popupComponent` component tabIndex to `null`.
   * Defaults to `true`.
   */
  autoFocus?: boolean;
}

export interface PopupProps extends BaseProps {
  /**
   * Render props used to anchor the popup to your content.
   * Make this an interactive element,
   * such as an @atlaskit/button component.
   */
  trigger: (props: TriggerProps) => React.ReactNode;

  /**
   * Z-index that the popup should be displayed in.
   * This is passed to the portal component.
   * Defaults to `layers.layer()` from `@atlaskit/theme`.
   */
  zIndex?: number;
}

export interface PopperWrapperProps extends BaseProps {
  triggerRef: TriggerRef;
}

export type CloseManagerHook = Pick<PopupProps, 'isOpen' | 'onClose'> & {
  popupRef: PopupRef;
  triggerRef: TriggerRef;
};

export type FocusManagerHook = {
  popupRef: PopupRef;
  initialFocusRef: HTMLElement | null;
};

export type RepositionOnUpdateProps = {
  update: PopperChildrenProps['update'];
};
