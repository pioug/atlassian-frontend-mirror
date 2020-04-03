import React, { useState } from 'react';
import ModalDialog, {
  ModalTransition,
  HeaderComponentProps,
} from '@atlaskit/modal-dialog';
import { Header } from './ModalHeader';
import { ModalBody } from './ModalBody';

export interface ModalProps {
  /* Add responses to the modal being closed */
  onClose: () => any;
  /*
    Called once the modal has finished opening - things such as dropbox want an iframe
    with an `iframeName` that they will add src to. You should likely only have src OR onOpen
  */
  onOpen?: () => void;
  /* If this is provided, the iframe will load this src */
  src?: string;
  /* Toggle whether to show the modal or not */
  showModal?: boolean;
  /* The name of the iframe, if you need that for an external reference */
  iframeName: string;
  /* Name of the provider, to be displayed at the top of the iframe */
  providerName: string;
  /* Label to be used for the close 'x' */
  closeLabel: string;
}

const Modal = ({
  onClose,
  onOpen,
  src,
  showModal,
  providerName,
  closeLabel,
  iframeName,
}: ModalProps) => {
  let [isOpen, setIsOpen] = useState(showModal);

  return (
    <ModalTransition>
      {isOpen && (
        <ModalDialog
          height="100%"
          width="large"
          onOpenComplete={onOpen}
          components={{
            Body: ModalBody,
            Header: (props: HeaderComponentProps) => (
              <Header {...props} title={providerName} label={closeLabel} />
            ),
          }}
          onClose={() => {
            setIsOpen(false);
          }}
          onCloseComplete={onClose}
        >
          {src ? (
            <iframe
              style={{ width: '100%', height: '100%' }}
              name={iframeName}
              frameBorder={0}
              src={src}
            />
          ) : (
            <iframe
              style={{ width: '100%', height: '100%' }}
              name={iframeName}
              frameBorder={0}
            />
          )}
        </ModalDialog>
      )}
    </ModalTransition>
  );
};

export default Modal;
