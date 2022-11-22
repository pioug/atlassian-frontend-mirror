import React from 'react';
import { ViewActionProps, ViewFunctionProps } from './types';
import Action from '../index';

const ViewAction: React.FC<ViewActionProps> = (props: ViewActionProps) => {
  const { appearance, asDropDownItem, testId, onClick, viewUrl, url } = props;

  if (viewUrl && url) {
    const action = {
      ...props,
      onClick: () => {
        viewFunction({
          url: viewUrl,
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

export async function viewFunction({ url }: ViewFunctionProps) {
  if (!url) {
    return;
  }
  window.open(url, '_blank', 'noopener=yes');
}

export default ViewAction;
