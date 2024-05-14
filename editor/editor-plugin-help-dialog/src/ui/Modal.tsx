/** @jsx jsx */
import { jsx } from '@emotion/react';

import { useModal } from '@atlaskit/modal-dialog';

import type Format from './Format';
import { ModalContent } from './ModalContent';

interface ModalProps {
  formatting: Format[];
}

const Modal = ({ formatting }: ModalProps) => {
  const { onClose } = useModal();
  return <ModalContent formatting={formatting} onClose={onClose} />;
};

export default Modal;
