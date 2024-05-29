import { type ReactNode } from 'react';

export type SmartLinkModalAPI = {
  /**
   * Insert a modal component on the root of Card or standalone HoverCard.
   * This is to ensure that the modal would not be unmounted
   * when HoverCard is unmounted.
   */
  open: (node: JSX.Element) => void;
  /**
   * Remove modal component.
   */
  close: () => void;
};

export type SmartLinkModalProviderProps = {
  children?: ReactNode;
};
