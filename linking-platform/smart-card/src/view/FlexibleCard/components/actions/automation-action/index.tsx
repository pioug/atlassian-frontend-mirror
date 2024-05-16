import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl-next';

import AutomationManualTriggersGlyph from './manaul-triggers-icon';
import Action from '../action';
import {
  useFlexibleUiContext,
} from '../../../../../state/flexible-ui-context';
import { ActionName } from '../../../../../constants';
import { messages } from '../../../../../messages';
import { type LinkActionProps } from '../types';
// import { useSmartLinkContext } from '../../../../../../../link-provider/src';

const handleAutomateActionClick = (setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
  setIsModalOpen(true);
}

const AutomationAction = (props: LinkActionProps) => {
  const [_isModalOpen, setIsModalOpen] = useState(false);
  const { formatMessage } = useIntl();
  // const { connections } = useSmartLinkContext();

  // const env = connections.client.envKey ?? 'prod';
  const context = useFlexibleUiContext();
  const data = context?.actions?.[ActionName.AutomationAction];
  if (!data) {
    return null;
  }

  const automationActionTitle = <FormattedMessage {...messages.automation_action_title} />
  const automationActionTooltip = <FormattedMessage {...messages.automation_action_tooltip} />
  const automationActionIconLabel = formatMessage(messages.automation_action_icon_label);

  return (
    <>
      <Action
        content={automationActionTitle}
        icon={<AutomationManualTriggersGlyph label={automationActionIconLabel}/>}
        testId="smart-action-automation-action"
        tooltipMessage={automationActionTooltip}
        {...data}
        {...props}
        onClick={() => handleAutomateActionClick(setIsModalOpen)}
      />
    </>
  )
}

export default AutomationAction;
