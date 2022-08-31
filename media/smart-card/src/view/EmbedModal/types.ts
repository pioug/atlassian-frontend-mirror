import { ErrorInfo } from 'react';
import { IconProps } from '../common/Icon';
import { WithSizeExperimentProps } from './components/size-experiment/types';
import { ModalProps } from '../common/Modal';
import { WithAnalytics } from './components/analytics/types';

export enum EmbedModalSize {
  Large = 'large',
  Small = 'small',
}

export type EmbedModalContext = {
  duration?: number;
  size: EmbedModalSize;
};

export type EmbedModalProps = {
  /* Label to be used for the close 'x' */
  closeLabel?: string;
  /* A download link - if it is provided, the download button will be shown */
  download?: string;
  /* This should be the icon of the provider, which will be displayed to the left of the title */
  icon?: IconProps;
  /* The name of the iframe, if you need that for an external reference */
  iframeName: string;
  /* A flag that determines whether link source can be trusted in iframe */
  isTrusted?: boolean;
  /* Add responses to the modal being closed */
  onClose: (context: EmbedModalContext) => void;
  /* Hook for when primary action is clicked */
  onDownloadActionClick?: () => void;
  /* Called once the modal has finished opening - things such as dropbox want
   * an iframe with an `iframeName` that they will add src to. You should likely
   * only have src OR onOpen */
  onOpen?: (context: EmbedModalContext) => void;
  /* Called if the modal failed to open */
  onOpenFailed?: (error: Error, errorInfo: ErrorInfo) => void;
  /* Hook for when resize button is clicked */
  onResize?: (context: EmbedModalContext) => void;
  /* Hook for when secondary action is clicked */
  onViewActionClick?: () => void;
  /* Name of the provider, used in the link out to the document. */
  providerName?: string;
  /* Toggle whether to show the modal or not */
  showModal?: boolean;
  /* Size of the modal used in an experiment */
  size?: EmbedModalSize;
  /* URL used to load iframe */
  src?: string;
  /* For testing purposes */
  testId?: string;
  /* The title of the document - this is displayed as a heading */
  title?: string;
  /* If you are not providing src, you should still provide a url, allowing people to access the page where the document is */
  url?: string;
};

export type EmbedModalWithExperimentProps = EmbedModalProps &
  ModalProps &
  WithSizeExperimentProps &
  WithAnalytics;
