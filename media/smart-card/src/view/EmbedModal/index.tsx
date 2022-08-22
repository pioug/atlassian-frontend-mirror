import React, { useCallback, useState } from 'react';
import ModalDialog, {
  ModalBody,
  ModalTransition,
} from '@atlaskit/modal-dialog';
import LinkInfo from './components/link-info';
import { MAX_MODAL_SIZE, MIN_MODAL_SIZE } from './constants';
import EmbedContent from './components/embed-content';
import { EmbedModalProps } from './types';
import withErrorBoundary from './components/error-boundary';

const EmbedModal: React.FC<EmbedModalProps> = ({
  download: downloadUrl,
  icon,
  iframeName,
  isTrusted = false,
  onClose,
  onDownloadActionClick,
  onOpen,
  onViewActionClick,
  providerName,
  showModal,
  src,
  testId = 'smart-links-preview-modal',
  title,
  url,
}) => {
  const [isOpen, setIsOpen] = useState(showModal);
  const [size, setSize] = useState(MIN_MODAL_SIZE);

  const handleOnClose = useCallback(() => setIsOpen(false), []);

  const handleOnSizeClick = useCallback(() => {
    const newSize = size === MIN_MODAL_SIZE ? MAX_MODAL_SIZE : MIN_MODAL_SIZE;
    setSize(newSize);
  }, [size]);

  return (
    <ModalTransition>
      {isOpen && (
        <ModalDialog
          height="100%"
          onClose={handleOnClose}
          onCloseComplete={onClose}
          onOpenComplete={onOpen}
          testId={testId}
          width={size}
        >
          <LinkInfo
            downloadUrl={downloadUrl}
            icon={icon}
            providerName={providerName}
            onViewButtonClick={onViewActionClick}
            onDownloadButtonClick={onDownloadActionClick}
            onResizeButtonClick={handleOnSizeClick}
            size={size}
            title={title}
            testId={testId}
            url={url}
          />
          <ModalBody>
            <EmbedContent
              isTrusted={isTrusted}
              name={iframeName}
              src={src}
              testId={testId}
            />
          </ModalBody>
        </ModalDialog>
      )}
    </ModalTransition>
  );
};

export default withErrorBoundary(EmbedModal);
