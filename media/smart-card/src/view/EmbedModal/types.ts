import { ErrorInfo } from 'react';
import { IconProps } from '../common/Icon';

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
  onClose: () => any;
  /* Hook for when primary action is clicked */
  onDownloadActionClick?: () => void;
  /* Called once the modal has finished opening - things such as dropbox want
   * an iframe with an `iframeName` that they will add src to. You should likely
   * only have src OR onOpen */
  onOpen?: () => void;
  /* Called if the modal failed to open */
  onOpenFailed?: (error: Error, errorInfo: ErrorInfo) => void;
  /* Hook for when secondary action is clicked */
  onViewActionClick?: () => void;
  /* Name of the provider, used in the link out to the document. */
  providerName?: string;
  /* Toggle whether to show the modal or not */
  showModal?: boolean;
  /* URL used to load iframe */
  src?: string;
  /* For testing purposes */
  testId?: string;
  /* The title of the document - this is displayed as a heading */
  title?: string;
  /* If you are not providing src, you should still provide a url, allowing people to access the page where the document is */
  url?: string;
};
