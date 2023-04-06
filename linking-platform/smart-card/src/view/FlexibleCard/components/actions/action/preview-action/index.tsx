import React from 'react';
import { PreviewActionProps, PreviewFunctionProps } from './types';
import Action from '../index';
import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl-next';
import { useFlexibleUiAnalyticsContext } from '../../../../../../state/flexible-ui-context';
import { useSmartLinkAnalytics } from '../../../../../../state';
import Icon from '../../../elements/icon';

const PreviewAction: React.FC<PreviewActionProps> = (
  props: PreviewActionProps,
) => {
  const {
    appearance,
    asDropDownItem,
    testId,
    onClick,
    linkIcon,
    src,
    url,
    title,
    providerName,
    downloadUrl,
    isSupportTheming,
  } = props;

  const defaultAnalytics = useSmartLinkAnalytics(url, () => {});
  const analytics = useFlexibleUiAnalyticsContext() || defaultAnalytics;

  const EmbedIcon = { icon: <Icon {...linkIcon} />, isFlexibleUi: true };

  if (src && url) {
    const embedModal = () =>
      previewFunction({
        popupMountPointId: 'twp-editor-preview-iframe',
        showModal: true,
        iframeName: 'twp-editor-preview-iframe',
        onClose: () => {},
        download: downloadUrl,
        icon: EmbedIcon,
        providerName: providerName || 'Preview',
        src,
        title,
        url,
        analytics,
        origin: 'smartLinkCard',
        isSupportTheming,
      });

    const action = {
      ...props,
      onClick: () => {
        embedModal();
        if (onClick) {
          onClick();
        }
      },
    };

    return (
      <Action
        {...action}
        appearance={appearance}
        asDropDownItem={asDropDownItem}
        testId={testId}
      />
    );
  } else {
    return null;
  }
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

  let Modal = await import('../../../../../EmbedModal');

  ReactDOM.render(
    <IntlProvider locale="en">
      <Modal.default
        {...rest}
        onClose={(_context) => {
          if (popupMountPoint) {
            ReactDOM.unmountComponentAtNode(popupMountPoint);
          }
        }}
      />
    </IntlProvider>,
    popupMountPoint,
  );
}

export default PreviewAction;
