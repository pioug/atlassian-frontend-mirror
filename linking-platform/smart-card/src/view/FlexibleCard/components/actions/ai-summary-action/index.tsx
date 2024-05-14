import React from 'react';

import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { InternalActionName } from '../../../../../constants';
import { AISummaryActionComponent } from './ai-summary-action-component';

import type { AISummaryActionProps } from './types';

const AISummaryAction = (props: AISummaryActionProps) => {
  const context = useFlexibleUiContext();

  const actionData = context?.actions?.[InternalActionName.AISummaryAction];

  return actionData ? (
    <AISummaryActionComponent {...actionData} {...props} />
  ) : null;
};

export default AISummaryAction;
