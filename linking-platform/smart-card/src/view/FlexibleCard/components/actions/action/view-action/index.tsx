import React from 'react';
import { ViewActionProps } from './types';
import Action from '../index';
import { openUrl } from '../../../../../../utils';

const ViewAction: React.FC<ViewActionProps> = (props: ViewActionProps) => {
  const { appearance, asDropDownItem, testId, onClick, viewUrl, url } = props;

  if (viewUrl && url) {
    const action = {
      ...props,
      onClick: () => {
        openUrl(viewUrl);
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
