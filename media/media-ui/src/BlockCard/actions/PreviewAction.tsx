import React from 'react';
import ReactDOM from 'react-dom';

import { ModalProps } from '../components/Modal';
import { ActionProps } from '../components/Action';

export interface PreviewFunctionArg extends ModalProps {
  /* The id of a HTML element that will be used OR created to mount the modal from */
  popupMountPointId: string;
}

/*
  Explanatory note:
  Actions don't have access to the react tree of whatever is rendered them
  (and this concept is fraught inside editor anyway) so we want to ensure
  it is mounting to a new unique place. This function manages that, including
  creating an element if it doesn't exist, as well as tidying up the react tree
  (but not the element) upon closing the modal.

  This may strike you as really uncomfortable as you read it, so I wanted to note
  that a) this was discussed and agreed upon, and b) it's definitely odd, and if
  you find an elegant solution around this, you should definitely feel free to
  refactor it.
*/
export async function previewFunction({
  popupMountPointId,
  onClose,
  ...rest
}: PreviewFunctionArg) {
  let popupMountPoint: HTMLElement | null;

  popupMountPoint = document.getElementById(popupMountPointId);
  if (!popupMountPoint) {
    popupMountPoint = document.createElement('div');
    popupMountPoint.id = popupMountPointId;
    document.body.appendChild(popupMountPoint);
  }

  let Modal = await import('../components/Modal');

  ReactDOM.render(
    <Modal.default
      {...rest}
      onClose={() => {
        if (popupMountPoint) {
          onClose();
          ReactDOM.unmountComponentAtNode(popupMountPoint);
        }
      }}
    />,
    popupMountPoint,
  );
}

export default ({ src }: { src: string }): ActionProps => ({
  id: 'preview-content',
  text: 'Preview',
  promise: () =>
    previewFunction({
      popupMountPointId: 'twp-editor-preview-iframe',
      providerName: 'Preview',
      closeLabel: 'Close Preview',
      showModal: true,
      iframeName: 'twp-editor-preview-iframe',
      onClose: () => {},
      src,
    }),
});
