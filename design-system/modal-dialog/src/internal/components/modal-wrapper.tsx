import React, { useCallback } from 'react';

import Portal from '@atlaskit/portal';
import { layers } from '@atlaskit/theme/constants';

import useModalStack from '../hooks/use-modal-stack';
import type { ModalDialogProps } from '../types';

import Modal from './modal';
import { useModalTransition } from './modal-transition';

const noop = () => {};

export default function ModalWrapper({
  autoFocus = true,
  scrollBehavior = 'inside',
  shouldCloseOnEscapePress = true,
  shouldCloseOnOverlayClick = true,
  isChromeless = false,
  width = 'medium',
  isHeadingMultiline = true,
  onClose = noop,
  children,
  stackIndex: consumerDefinedStackIndex,
  ...props
}: ModalDialogProps) {
  const { isOpen, onExited } = useModalTransition();
  const stackIndex = useModalStack(isOpen);
  const onModalClosed = useCallback(
    (e: HTMLElement) => {
      if (onExited) {
        onExited();
      }

      if (props.onCloseComplete) {
        props.onCloseComplete(e);
      }
    },
    [onExited, props],
  );

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
        isOpen={isOpen}
        stackIndex={consumerDefinedStackIndex || stackIndex}
        onCloseComplete={onModalClosed}
      >
        {children}
      </Modal>
    </Portal>
  );
}
