import React, { useState, lazy, Suspense } from 'react';
import { FormattedMessage, useIntl } from 'react-intl-next';

import AutomationManualTriggersGlyph from './manaul-triggers-icon';
import Action from '../action';
import {
  useFlexibleUiContext,
} from '../../../../../state/flexible-ui-context';
import { ActionName } from '../../../../../constants';
import { messages } from '../../../../../messages';
import { type LinkActionProps } from '../types';
import { useSmartLinkContext } from '@atlaskit/link-provider';
import { type Environment } from './automation-manual-triggers/manual-triggers-container/common/types';

const AutomationModal = lazy(
  () => import( /* webpackChunkName: "@atlaskit-internal_smart-card-automation-modal" */ './automation-manual-triggers/manual-triggers-modal')
);

const handleAutomateActionClick = (setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
  setIsModalOpen(true);
}

const handleAutomationActionClose =  (setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
  setIsModalOpen(false);
}

const AutomationAction = (props: LinkActionProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { formatMessage } = useIntl();
  const smartLinkContext = useSmartLinkContext();
  const { connections } = smartLinkContext;

  const environment = connections.client.envKey as Environment ?? 'prod';
  const context = useFlexibleUiContext();
  const automationActionData = context?.actions?.[ActionName.AutomationAction];
  if (!automationActionData) {
    return null;
  }

  const {
    baseAutomationUrl,
    objectName,
    objectAri,
    siteAri,
    canManageAutomation,
    analyticsSource,
    modalTitle,
    modalDescription
  } = automationActionData;

  const automationActionTitle = <FormattedMessage {...messages.automation_action_title} />
  const automationActionTooltip = <FormattedMessage {...messages.automation_action_tooltip} />
  const automationActionIconLabel = formatMessage(messages.automation_action_icon_label);
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

  return (
    <>
      <Action
        content={automationActionTitle}
        icon={<AutomationManualTriggersGlyph label={automationActionIconLabel}/>}
        testId="smart-action-automation-action"
        tooltipMessage={automationActionTooltip}
        {...automationActionData}
        {...props}
        onClick={() => handleAutomateActionClick(setIsModalOpen)}
      />
      {isModalOpen && (
        // TODO skeleton modal fallback
        <Suspense fallback={false}>
          <AutomationModal
            environment={environment}
            baseAutomationUrl={baseAutomationUrl}
            objectAri={objectAri}
            siteAri={siteAri}
            canManageAutomation={canManageAutomation}
            analyticsSource={analyticsSource}
            modalTitle={automationModalTitle}
            modalDescription={automationModalDescription}
            onClose={() => handleAutomationActionClose(setIsModalOpen)}
          />
        </Suspense>
      )}
    </>
  )
}

export default AutomationAction;
