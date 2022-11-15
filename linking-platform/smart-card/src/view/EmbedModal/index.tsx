import React, { useCallback, useRef, useState } from 'react';
import ModalDialog, {
  ModalBody,
  ModalTransition,
} from '@atlaskit/modal-dialog';
import LinkInfo from './components/link-info';
import { MAX_MODAL_SIZE, MIN_MODAL_SIZE } from './constants';
import EmbedContent from './components/embed-content';
import { EmbedModalProps, EmbedModalSize } from './types';
import withErrorBoundary from './components/error-boundary';
import withAnalytics from './components/analytics';

const toSize = (width: string) =>
  width === MAX_MODAL_SIZE ? EmbedModalSize.Large : EmbedModalSize.Small;

const toWidth = (size: EmbedModalSize) =>
  size === EmbedModalSize.Large ? MAX_MODAL_SIZE : MIN_MODAL_SIZE;

const EmbedModal: React.FC<EmbedModalProps> = ({
  download: downloadUrl,
  icon,
  iframeName,
  isTrusted = false,
  onClose,
  onDownloadActionClick,
  onOpen,
  onResize,
  onViewActionClick,
  providerName,
  showModal,
  size = EmbedModalSize.Large,
  src,
  testId = 'smart-embed-preview-modal',
  title,
  url,
}) => {
  const defaultWidth = toWidth(size);
  const [isOpen, setIsOpen] = useState(showModal);
  const [width, setWidth] = useState(defaultWidth);
  const openAt = useRef<number>();

  const handleOnOpenComplete = useCallback(() => {
    openAt.current = Date.now();
    if (onOpen) {
      onOpen({ size });
    }
  }, [onOpen, size]);

  const handleOnClose = useCallback(() => setIsOpen(false), []);

  const handleOnCloseComplete = useCallback(() => {
    if (onClose) {
      const duration = openAt.current ? Date.now() - openAt.current : undefined;
      onClose({ duration, size: toSize(width) });
    }
  }, [onClose, width]);

  const handleOnResizeClick = useCallback(() => {
    const newWidth = width === MIN_MODAL_SIZE ? MAX_MODAL_SIZE : MIN_MODAL_SIZE;
    setWidth(newWidth);

    if (onResize) {
      onResize({ size: toSize(newWidth) });
    }
  }, [onResize, width]);

  return (
    <ModalTransition>
      {isOpen && (
        <ModalDialog
          height="100%"
          onClose={handleOnClose}
          onCloseComplete={handleOnCloseComplete}
          onOpenComplete={handleOnOpenComplete}
          testId={testId}
          width={width}
        >
          <LinkInfo
            downloadUrl={downloadUrl}
            icon={icon}
            providerName={providerName}
            onViewButtonClick={onViewActionClick}
            onDownloadButtonClick={onDownloadActionClick}
            onResizeButtonClick={handleOnResizeClick}
            size={width}
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

export default withAnalytics(withErrorBoundary(EmbedModal));
