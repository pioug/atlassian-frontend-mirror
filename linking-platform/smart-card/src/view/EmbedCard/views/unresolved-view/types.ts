import type { MouseEvent, ReactNode } from 'react';

export type UnresolvedViewProps = {
  /** An action button */
  button?: ReactNode;
  /** A detail and instruction of the unresolved link */
  description: ReactNode;
  /** A link icon displayed on embed frame */
  icon: string | ReactNode;
  /** A provider or visual aids for the unresolved link */
  image: string;
  /** A flag whether the embed frame should inherit parent dimension  */
  inheritDimensions?: boolean;
  /** A flag whether the embed frame is selected */
  isSelected?: boolean;
  /** An action when a link text is clicked */
  onClick?: (evt: MouseEvent) => void;
  /** A link text displayed on embed frame */
  text?: string;
  /** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests */
  testId?: string;
  /** A title for the unresolved link */
  title: ReactNode;
  /** A link url */
  url: string;
};
