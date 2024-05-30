import React, { lazy, useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl-next';

import AutomationManualTriggersGlyph from './manaul-triggers-icon';
import Action from '../action';
import {
  useFlexibleUiContext,
} from '../../../../../state/flexible-ui-context';
import { useSmartLinkModal } from '../../../../../state/modal';
import { type AutomationActionData } from '../../../../../state/flexible-ui-context/types';
import { ActionName } from '../../../../../constants';
import { messages } from '../../../../../messages';
import { type LinkActionProps } from '../types';

const AutomationModal = lazy(
  () => import( /* webpackChunkName: "@atlaskit-internal_smart-card-automation-modal" */ './automation-manual-triggers/manual-triggers-modal')
);

const AutomationAction = (props: LinkActionProps) => {
  const { formatMessage } = useIntl();
  const modal = useSmartLinkModal();

  const context = useFlexibleUiContext();
  const automationActionData = context?.actions?.[ActionName.AutomationAction];

  const automationActionOnClick = useCallback((automationActionData: AutomationActionData) => {
    const {
      baseAutomationUrl,
      objectAri,
      siteAri,
      canManageAutomation,
      analyticsSource,
      modalTitle,
      modalDescription,
      objectName
    } = automationActionData;

    const automationModalTitle = <FormattedMessage {...modalTitle} />
    const automationModalDescription =
      <FormattedMessage
        {...modalDescription}
        values={{
          name: objectName,
          b: (chunks: React.ReactNode[]) => <strong>{chunks}</strong>,
          br: <br />
        }}
      />

    modal.open(
        <AutomationModal
          baseAutomationUrl={baseAutomationUrl}
          objectAri={objectAri}
          siteAri={siteAri}
          canManageAutomation={canManageAutomation}
          analyticsSource={analyticsSource}
          modalTitle={automationModalTitle}
          modalDescription={automationModalDescription}
          onClose={() => modal.close()}
        />
    )
  }, [modal])

  if (!automationActionData) {
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
        {...automationActionData}
        {...props}
        onClick={() => automationActionOnClick(automationActionData)}
      />
    </>
  )
}
export default AutomationAction;
