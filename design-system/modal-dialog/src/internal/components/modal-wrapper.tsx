import React from 'react';

import noop from '@atlaskit/ds-lib/noop';
import Portal from '@atlaskit/portal';
import { layers } from '@atlaskit/theme/constants';

import useModalStack from '../hooks/use-modal-stack';
import type { ModalDialogProps } from '../types';

import Modal from './modal';

export default function ModalWrapper({
  autoFocus = true,
  scrollBehavior = 'inside',
  shouldCloseOnEscapePress = true,
  shouldCloseOnOverlayClick = true,
  isChromeless = false,
  width = 'medium',
  isHeadingMultiline = true,
  onClose = noop,
  stackIndex: stackIndexOverride,
  onStackChange = noop,
  children,
  ...props
}: ModalDialogProps) {
  const stackIndex = useModalStack({ onStackChange });

  return (
    <Portal zIndex={layers.modal()}>
      <Modal
        {...props}
        autoFocus={autoFocus}
        scrollBehavior={scrollBehavior}
        shouldCloseOnEscapePress={shouldCloseOnEscapePress}
        shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
        isChromeless={isChromeless}
        width={width}
        isHeadingMultiline={isHeadingMultiline}
        onClose={onClose}
        stackIndex={stackIndexOverride || stackIndex}
      >
        {children}
      </Modal>
    </Portal>
  );
}
