import React, { lazy, useCallback } from 'react';

import { FormattedMessage, useIntl } from 'react-intl-next';

import AutomationIcon from '@atlaskit/icon/core/automation';
import { fg } from '@atlaskit/platform-feature-flags';
import { Text } from '@atlaskit/primitives/compiled';

import { useAnalyticsEvents } from '../../../../../common/analytics/generated/use-analytics-events';
import { ActionName } from '../../../../../constants';
import { messages } from '../../../../../messages';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { type AutomationActionData } from '../../../../../state/flexible-ui-context/types';
import { useSmartLinkModal } from '../../../../../state/modal';
import Action from '../action';
import { type LinkActionProps } from '../types';

import AutomationActionOld from './AutomationActionOld';
import AutomationManualTriggersGlyph from './manual-triggers-icon';
import { getModalContent } from './utils';

const AutomationModal = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_smart-card-automation-modal" */ './automation-manual-triggers/manual-triggers-modal'
		),
);

const AutomationActionNew = (props: LinkActionProps) => {
	const { formatMessage } = useIntl();
	const modal = useSmartLinkModal();
	const { onClick: onClickCallback } = props;

	const context = useFlexibleUiContext();
	const { fireEvent } = useAnalyticsEvents();
	const automationActionData = context?.actions?.[ActionName.AutomationAction];

	const automationActionOnClick = useCallback(
		(automationActionData: AutomationActionData) => {
			const {
				product,
				resourceType,
				baseAutomationUrl,
				objectAri,
				siteAri,
				canManageAutomation,
				analyticsSource,
				objectName,
			} = automationActionData;
			fireEvent('ui.button.clicked.automationAction', {});

			const { modalTitle, modalDescription } = getModalContent(product, resourceType) || {};

			const automationModalTitle = modalTitle ? <FormattedMessage {...modalTitle} /> : undefined;
			const automationModalDescription = modalDescription ? (
				<FormattedMessage
					{...modalDescription}
					values={{
						name: objectName,
						b: (chunks: React.ReactNode[]) => <Text as="strong">{chunks}</Text>,
						br: <br />,
					}}
				/>
			) : undefined;

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
				/>,
			);

			onClickCallback?.();
		},
		[modal, onClickCallback, fireEvent],
	);

	if (!automationActionData) {
		return null;
	}

	const automationActionTitle = <FormattedMessage {...messages.automation_action_title} />;
	const automationActionTooltip = <FormattedMessage {...messages.automation_action_tooltip} />;
	const automationActionIconLabel = formatMessage(messages.automation_action_icon_label);

	return (
		<>
			<Action
				content={automationActionTitle}
				icon={
					<AutomationIcon
						spacing="spacious"
						LEGACY_fallbackIcon={AutomationManualTriggersGlyph}
						color="currentColor"
						label={automationActionIconLabel}
					/>
				}
				testId="smart-action-automation-action"
				tooltipMessage={automationActionTooltip}
				{...props}
				onClick={() => automationActionOnClick(automationActionData)}
			/>
		</>
	);
};

const AutomationAction = (props: LinkActionProps) => {
	if (fg('bandicoots-compiled-migration-smartcard')) {
		return <AutomationActionNew {...props} />;
	}
	return <AutomationActionOld {...props} />;
};

export default AutomationAction;
