import React, { useState, ErrorInfo } from 'react';
import ModalDialog, {
  ModalTransition,
  HeaderComponentProps,
} from '@atlaskit/modal-dialog';
import { Header } from './ModalHeader';
import { IconProps } from './Icon';
import { MetadataListProps } from './MetadataList';
import { gs } from '../utils';

const iframeStyles = {
  width: `100%`,
  height: `calc(100% - ${gs(3)})`,
};

export interface ModalProps {
  /* Add responses to the modal being closed */
  onClose: () => any;
  /*
    Called once the modal has finished opening - things such as dropbox want an iframe
    with an `iframeName` that they will add src to. You should likely only have src OR onOpen
  */
  onOpen?: () => void;
  /* Called if the modal failed to open */
  onOpenFailed?: (error: Error, errorInfo: ErrorInfo) => void;
  /* URL used to load iframe */
  src?: string;
  /* Toggle whether to show the modal or not */
  showModal?: boolean;
  /* The name of the iframe, if you need that for an external reference */
  iframeName: string;
  /* Name of the provider, used in the link out to the document. */
  providerName?: string;
  /* Label to be used for the close 'x' */
  closeLabel: string;
  /* If you are not providing src, you should still provide a url, allowing people to access the page where the document is */
  url?: string;
  /* The title of the document - this is displayed as a heading */
  title?: string;
  /* The metadata for the document - this will be rendered underneath the title */
  metadata?: MetadataListProps;
  /* This should be the icon of the provider, which will be displayed to the left of the title */
  icon?: IconProps;
  /* A download link - if it is provided, the download button will be shown */
  download?: string;
  /* Summary, description, or details about the resource */
  byline?: React.ReactNode;
  /* Hook for when secondary action is clicked */
  onViewActionClick?: () => void;
  /* Hook for when primary action is clicked */
  onDownloadActionClick?: () => void;
  /* For testing purposes */
  testId?: string;
}

class ModalWithErrorBoundary extends React.Component<ModalProps> {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (this.props.onOpenFailed) {
      this.props.onOpenFailed(error, errorInfo);
    }
  }

  render() {
    return <Modal {...this.props} />;
  }
}

const Modal = ({
  onClose,
  onOpen,
  src,
  testId,
  showModal,
  providerName,
  metadata,
  icon,
  closeLabel,
  iframeName,
  title,
  url,
  download,
  byline,
  onViewActionClick,
  onDownloadActionClick,
}: ModalProps) => {
  let [isOpen, setIsOpen] = useState(showModal);

  return (
    <ModalTransition>
      {isOpen && (
        <ModalDialog
          height="100%"
          width="large"
          testId={testId}
          onOpenComplete={onOpen}
          components={{
            // TODO modal body wants to be original modal with height 100% - find out how to add
            Header: (props: HeaderComponentProps) => (
              <Header
                {...props}
                providerName={providerName}
                icon={icon}
                metadata={metadata}
                url={url}
                title={title}
                label={closeLabel}
                download={download}
                byline={byline}
                onViewActionClick={onViewActionClick}
                onDownloadActionClick={onDownloadActionClick}
              />
            ),
          }}
          onClose={() => {
            setIsOpen(false);
          }}
          onCloseComplete={onClose}
        >
          {src ? (
            <iframe
              style={iframeStyles}
              name={iframeName}
              frameBorder={0}
              src={src}
            />
          ) : (
            <iframe style={iframeStyles} name={iframeName} frameBorder={0} />
          )}
        </ModalDialog>
      )}
    </ModalTransition>
  );
};

export default ModalWithErrorBoundary;
