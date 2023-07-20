import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl-next';
import { PreviewFunctionProps } from '../FlexibleCard/components/actions/action/preview-action/types';
import { PreviewActionData } from '../../state/flexible-ui-context/types';
import Icon from '../FlexibleCard/components/elements/icon';
import { AnalyticsFacade } from '../../state/analytics';
import { SmartLinkSize } from '../../constants';

type PreviewModalProps = {
  analytics?: AnalyticsFacade;
  onClose?: () => void;
} & PreviewActionData;

export const openPreviewModal = ({
  analytics,
  downloadUrl: download,
  isSupportTheming,
  linkIcon,
  onClose = () => {},
  providerName,
  src,
  title,
  url,
}: PreviewModalProps) => {
  const EmbedIcon = {
    icon: <Icon {...linkIcon} size={SmartLinkSize.Large} />,
    isFlexibleUi: true,
  };

  return previewFunction({
    popupMountPointId: 'twp-editor-preview-iframe',
    showModal: true,
    iframeName: 'twp-editor-preview-iframe',
    onClose,
    download,
    icon: EmbedIcon,
    providerName: providerName || 'Preview',
    src,
    title,
    url,
    analytics,
    origin: 'smartLinkCard',
    isSupportTheming,
  });
};

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
  onClose: onEmbedClose,
  ...rest
}: PreviewFunctionProps) {
  let popupMountPoint: HTMLElement | null;

  popupMountPoint = document.getElementById(popupMountPointId);
  if (!popupMountPoint) {
    popupMountPoint = document.createElement('div');
    popupMountPoint.id = popupMountPointId;
    popupMountPoint.setAttribute('data-testid', 'preview-modal');
    document.body.appendChild(popupMountPoint);
  }

  let Modal = await import('./index');

  ReactDOM.render(
    <IntlProvider locale="en">
      <Modal.default
        {...rest}
        onClose={(_context) => {
          if (popupMountPoint) {
            ReactDOM.unmountComponentAtNode(popupMountPoint);
          }
          if (onEmbedClose) {
            onEmbedClose(_context);
          }
        }}
      />
    </IntlProvider>,
    popupMountPoint,
  );
}
