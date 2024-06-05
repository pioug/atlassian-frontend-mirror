import React, { lazy, useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl-next';

import AutomationManualTriggersGlyph from './manaul-triggers-icon';
import Action from '../action';
import {
  useFlexibleUiContext,
} from '../../../../../state/flexible-ui-context';
import { useSmartLinkModal } from '../../../../../state/modal';
import { type AutomationActionData } from '../../../../../state/flexible-ui-context/types';
import { useAnalyticsEvents } from '../../../../../common/analytics/generated/use-analytics-events';
import { ActionName } from '../../../../../constants';
import { messages } from '../../../../../messages';
import { type LinkActionProps } from '../types';
import { getModalContent } from './utils';

const AutomationModal = lazy(
  () => import( /* webpackChunkName: "@atlaskit-internal_smart-card-automation-modal" */ './automation-manual-triggers/manual-triggers-modal')
);

const AutomationAction = (props: LinkActionProps) => {
  const { formatMessage } = useIntl();
  const modal = useSmartLinkModal();
  const { onClick: onClickCallback } = props;

  const context = useFlexibleUiContext();
	const { fireEvent } = useAnalyticsEvents();
  const automationActionData = context?.actions?.[ActionName.AutomationAction];

  const automationActionOnClick = useCallback((automationActionData: AutomationActionData) => {
    const {
      product,
      resourceType,
      baseAutomationUrl,
      objectAri,
      siteAri,
      canManageAutomation,
      analyticsSource,
      objectName
    } = automationActionData;
		fireEvent('ui.button.clicked.automationAction', {});

    const { modalTitle, modalDescription } = getModalContent(product, resourceType) || {};

    const automationModalTitle = modalTitle ? <FormattedMessage {...modalTitle} /> : undefined;
    const automationModalDescription = modalDescription ?
      <FormattedMessage
        {...modalDescription}
        values={{
          name: objectName,
          b: (chunks: React.ReactNode[]) => <strong>{chunks}</strong>,
          br: <br />
        }}
      /> : undefined;

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

    onClickCallback?.();
  }, [modal, onClickCallback, fireEvent])

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
        {...props}
        onClick={() => automationActionOnClick(automationActionData)}
      />
    </>
  )
}
export default AutomationAction;
