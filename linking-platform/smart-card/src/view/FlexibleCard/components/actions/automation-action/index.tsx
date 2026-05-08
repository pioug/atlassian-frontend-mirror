import React, { lazy, useCallback } from 'react';

import { FormattedMessage, useIntl } from 'react-intl';

import AutomationIcon from '@atlaskit/icon/core/automation';
import { fg } from '@atlaskit/platform-feature-flags';
import { Text } from '@atlaskit/primitives/compiled';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import { useAnalyticsEvents } from '../../../../../common/analytics/generated/use-analytics-events';
import { ActionName } from '../../../../../constants';
import { messages } from '../../../../../messages';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { type AutomationActionData } from '../../../../../state/flexible-ui-context/types';
import { useBlockCardRovoActionExperimentNoExposure } from '../../../../../state/hooks/use-block-card-rovo-action-experiment';
import { useSmartLinkModal } from '../../../../../state/modal';
import Action from '../action';
import { type LinkActionProps } from '../types';

import { getModalContent } from './utils';

const AutomationModal = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_smart-card-automation-modal" */ './automation-manual-triggers/manual-triggers-modal'
		),
);

const AutomationAction = (props: LinkActionProps): React.JSX.Element | null => {
	const { formatMessage } = useIntl();
	const modal = useSmartLinkModal();
	const { onClick: onClickCallback } = props;

	const context = useFlexibleUiContext();
	const { fireEvent } = useAnalyticsEvents();
	const automationActionData = context?.actions?.[ActionName.AutomationAction];

	const isRovoBlockCardExperimentEnabled = useBlockCardRovoActionExperimentNoExposure();

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
						color="currentColor"
						label={automationActionIconLabel}
						{...(fg('platform_sl_3p_auth_rovo_action_kill_switch') ||
						isRovoBlockCardExperimentEnabled ||
						expValEqualsNoExposure('rovogrowth-640-inline-action-nudge-exp', 'isEnabled', true)
							? { size: props.iconSize }
							: {})}
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

export default AutomationAction;
