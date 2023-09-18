import React from 'react';
import { PreviewActionProps } from './types';
import Action from '../index';
import { useFlexibleUiAnalyticsContext } from '../../../../../../state/flexible-ui-context';
import { FormattedMessage } from 'react-intl-next';
import { messages } from '../../../../../../messages';
import { openEmbedModalWithFlexibleUiIcon } from '../../../utils';
import useInvokeClientAction from '../../../../../../state/hooks/use-invoke-client-action';
import { ActionName } from '../../../../../../constants';

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

  const analytics = useFlexibleUiAnalyticsContext();
  const invoke = useInvokeClientAction({ analytics });

  if (src && url) {
    const actionFn = async () =>
      openEmbedModalWithFlexibleUiIcon({
        download: downloadUrl,
        extensionKey: analytics?.extensionKey,
        title,
        providerName,
        isSupportTheming,
        analytics,
        linkIcon,
        src,
        url,
      });

    const action = {
      ...props,
      onClick: () => {
        invoke({
          actionType: ActionName.PreviewAction,
          actionFn,
          // These values have already been set in analytics context.
          // We only pass these here for ufo experience.
          display: analytics?.display,
          extensionKey: analytics?.extensionKey,
        });
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
