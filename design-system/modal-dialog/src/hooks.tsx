import { useContext } from 'react';

import { ModalContext } from './internal/context';

export const useModal = () => {
  const modalContext = useContext(ModalContext);
  if (modalContext == null) {
    throw Error(
      '@atlaskit/modal-dialog: Modal context unavailable – this component needs to be a child of ModalDialog.',
    );
  }

  return modalContext;
};
