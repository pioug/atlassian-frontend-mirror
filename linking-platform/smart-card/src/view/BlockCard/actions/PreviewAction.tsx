import React, { ErrorInfo } from 'react';
import ReactDOM from 'react-dom';
import { FormattedMessage, IntlProvider } from 'react-intl-next';

import { AnalyticsFacade } from '../../../state/analytics';
import { EmbedModalProps } from '../../EmbedModal/types';
import { ActionProps } from '../components/Action';
import { IconProps } from '../../common/Icon';
import { MetadataProps } from '../../common/Metadata';
import { messages } from '../../../messages';
import { AnalyticsOrigin } from '../../../utils/types';

export interface PreviewFunctionArg extends EmbedModalProps {
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
    popupMountPoint.setAttribute('data-testid', 'preview-modal');
    document.body.appendChild(popupMountPoint);
  }

  let Modal = await import('../../EmbedModal');

  ReactDOM.render(
    <IntlProvider locale="en">
      <Modal.default
        {...rest}
        onClose={(context) => {
          if (popupMountPoint) {
            onClose(context);
            ReactDOM.unmountComponentAtNode(popupMountPoint);
          }
        }}
      />
    </IntlProvider>,
    popupMountPoint,
  );
}

/*
Most of these are optional as we are being fault-tolerant
However src, details, icon, title, and providerName are STRONGLY encouraged
*/
type PreviewInfo = {
  src?: string;
  testId?: string;
  details?: Array<MetadataProps>;
  icon?: IconProps;
  url?: string;
  title?: string;
  providerName?: string;
  download?: string;
  byline?: React.ReactNode;
  onViewActionClick?: () => void;
  onDownloadActionClick?: () => void;
  onOpen?: () => void;
  onOpenFailed?: (error: Error, errorInfo: ErrorInfo) => void;
  analytics: AnalyticsFacade;
  origin?: AnalyticsOrigin;
};

export default ({ details, ...rest }: PreviewInfo): ActionProps => ({
  id: 'preview-content',
  text: <FormattedMessage {...messages.preview} />,
  promise: () =>
    previewFunction({
      popupMountPointId: 'twp-editor-preview-iframe',
      providerName: 'Preview',
      showModal: true,
      iframeName: 'twp-editor-preview-iframe',
      onClose: () => {},
      ...rest,
    }),
});
