import { ReactNode } from 'react';

export type AnalyticsData = Object;
export type ResultId = string | number;
export type SelectedResultId = ResultId | null;

export type CancelableEvent =
  | KeyboardEvent
  | MouseEvent
  | React.KeyboardEvent<HTMLInputElement>
  | React.MouseEvent<HTMLElement>;

export type ResultData = {
  resultId: ResultId;
  type: string;
  event: CancelableEvent;
};

export type CommonResultProps = {
  /** Unique ID of the result. This is passed as a parameter to certain callbacks */
  resultId: string | number;
  /** Type of the result. This is passed as a parameter to certain callbacks. */
  type?: string;
  /** Src URL of the image to be used as the result's icon, overriden by avatar prop */
  avatarUrl?: string;
  /** React Component of the image to be used as the result's icon, takes precedence over avatarUrl */
  avatar?: ReactNode;
  /** Content to be shown after the main content. Shown to the right of content (or to the left in RTL mode). */
  elemAfter?: ReactNode;
  /** Icon to be shown after the main content when the result is selected */
  selectedIcon?: ReactNode;
  /** Location to link out to on click. */
  href?: string;
  /** Target to open the link in. */
  target?: string;
  /** Reduces padding and font size. */
  isCompact?: boolean;
  /** Triggered by mouseClick event. */
  onClick?: (resultData: ResultData) => void;
  /** key/value pairs of attributes to be send in analytics events. */
  analyticsData?: AnalyticsData | (() => AnalyticsData);
};
