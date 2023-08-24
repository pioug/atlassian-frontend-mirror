import React from 'react';
import { PreviewActionProps } from './types';
import Action from '../index';
import { useFlexibleUiAnalyticsContext } from '../../../../../../state/flexible-ui-context';
import { useSmartLinkAnalytics } from '../../../../../../state';
import { FormattedMessage } from 'react-intl-next';
import { messages } from '../../../../../../messages';
import { openEmbedModalWithFlexibleUiIcon } from '../../../utils';

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

  if (src && url) {
    const embedModal = () =>
      openEmbedModalWithFlexibleUiIcon({
        title,
        providerName,
        downloadUrl,
        isSupportTheming,
        analytics,
        linkIcon,
        src,
      });

    const action = {
      ...props,
      onClick: () => {
        embedModal();
        if (onClick) {
          onClick();
        }
      },
      content: <FormattedMessage {...messages.preview_improved} />,
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

export default PreviewAction;
