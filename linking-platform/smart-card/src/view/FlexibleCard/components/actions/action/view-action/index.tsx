import React from 'react';
import { ViewActionProps } from './types';
import Action from '../index';
import { openUrl } from '../../../../../../utils';
import { ActionName } from '../../../../../../constants';
import { useFlexibleUiAnalyticsContext } from '../../../../../../state/flexible-ui-context';
import useInvokeClientAction from '../../../../../../state/hooks/use-invoke-client-action';

const ViewAction: React.FC<ViewActionProps> = (props: ViewActionProps) => {
  const { appearance, asDropDownItem, testId, onClick, viewUrl, url } = props;

  const analytics = useFlexibleUiAnalyticsContext();
  const invoke = useInvokeClientAction({ analytics });

  if (viewUrl && url) {
    const action = {
      ...props,
      onClick: () => {
        invoke({
          actionType: ActionName.ViewAction,
          actionFn: async () => openUrl(viewUrl),
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

export default ViewAction;
