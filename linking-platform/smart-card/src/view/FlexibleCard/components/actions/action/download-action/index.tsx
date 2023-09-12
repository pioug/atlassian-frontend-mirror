import React from 'react';
import { DownloadActionProps } from './types';
import Action from '../index';
import { downloadUrl as download } from '../../../../../../utils';
import { ActionName } from '../../../../../../constants';
import useInvokeClientAction from '../../../../../../state/hooks/use-invoke-client-action';
import { useFlexibleUiAnalyticsContext } from '../../../../../../state/flexible-ui-context';

const DownloadAction: React.FC<DownloadActionProps> = (
  props: DownloadActionProps,
) => {
  const { appearance, asDropDownItem, downloadUrl, onClick, testId, url } =
    props;

  const analytics = useFlexibleUiAnalyticsContext();
  const invoke = useInvokeClientAction({ analytics });

  if (downloadUrl && url) {
    const action = {
      ...props,
      onClick: () => {
        invoke({
          actionType: ActionName.DownloadAction,
          actionFn: async () => download(downloadUrl),
          // These values have already been set in analytics context.
          // We only pass these here for ufo experience.
          display: analytics?.display,
          extensionKey: analytics?.extensionKey,
        });
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

export default DownloadAction;
