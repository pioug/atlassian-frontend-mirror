import React from 'react';

import { defineMessages, FormattedMessage } from 'react-intl-next';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import Button, { LinkButton } from '@atlaskit/button/new';

import type { ManualRule } from '../../../manual-triggers-container/common/types';
import { useAutomationMenu } from '../../menu-context';

type AutomationModalFooterProps = {
	selectedRule: ManualRule | undefined;
	onClose: () => void;
};

const i18n = defineMessages({
	modalFooterCancelButton: {
		id: 'automation-menu.modal.footer.cancel-button',
		defaultMessage: 'Cancel',
		description: 'The text for a cancel button, which closes the active modal.',
	},
	modalFooterAutomateButton: {
		id: 'automation-menu.modal.footer.automate-button',
		defaultMessage: 'Automate',
		description: 'The text for an automate button, which executes an automation rule.',
	},
	modalFooterCreateAutomationButton: {
		id: 'automation-menu.modal.footer.get-started-button',
		defaultMessage: 'Create automation',
		description:
			'The text for a button that links to the automation rule builder. This button only appears when the modal has no existing automations to display.',
	},
	modalFooterOkButton: {
		id: 'automation-menu.modal.footer.ok-button',
		defaultMessage: 'Ok',
		description:
			'The text for a button that closes the active modal. This button only appears when the modal has no existing automations to display.',
	},
});

export const AutomationModalFooter = ({ selectedRule, onClose }: AutomationModalFooterProps) => {
	const { createAnalyticsEvent } = useAnalyticsEvents();

	const {
		canManageAutomation,
		objectAri,
		initialised,
		invokeRuleOrShowDialog,
		invokingRuleId,
		rules,
		fetchError,
		baseAutomationUrl,
		analyticsSource,
	} = useAutomationMenu();

	const sendFooterAnalyticsEvent = (actionSubjectId: string, ruleId?: string) => {
		const event = createAnalyticsEvent({
			type: 'sendUIEvent',
			data: {
				action: 'clicked',
				actionSubject: 'button',
				actionSubjectId,
				source: analyticsSource,
			},
		});
		if (ruleId) {
			event.payload.data.attributes = { ruleId };
		}
		event.fire();
	};

	const okButton = (
		<Button
			key="automation-modal-footer-ok"
			appearance="primary"
			onClick={() => {
				sendFooterAnalyticsEvent('ok');
				onClose();
			}}
		>
			<FormattedMessage {...i18n.modalFooterOkButton} />
		</Button>
	);

	const cancelButton = (
		<Button
			key="automation-modal-footer-cancel"
			appearance="subtle"
			onClick={() => {
				sendFooterAnalyticsEvent('cancel');
				onClose();
			}}
		>
			<FormattedMessage {...i18n.modalFooterCancelButton} />
		</Button>
	);

	const createAutomationButton = (
		<LinkButton
			key="automation-modal-footer-create-automation"
			appearance="primary"
			href={`${baseAutomationUrl}#rule/new`}
			onClick={() => {
				sendFooterAnalyticsEvent('createAutomation');
			}}
			target="_blank"
		>
			<FormattedMessage {...i18n.modalFooterCreateAutomationButton} />
		</LinkButton>
	);

	const automateButton = (
		<Button
			key="automation-modal-footer-automate"
			appearance="primary"
			onClick={() => {
				if (selectedRule) {
					sendFooterAnalyticsEvent('executeManualTriggerAutomation', selectedRule.id.toString());
					invokeRuleOrShowDialog(selectedRule.id, [objectAri.toString()]);
				}
			}}
			isDisabled={!selectedRule || !!invokingRuleId}
		>
			<FormattedMessage {...i18n.modalFooterAutomateButton} />
		</Button>
	);

	const modalButtons: JSX.Element[] = [];

	if (!initialised) {
		return null;
	}

	// Populated rule list -> cancel and automate buttons
	// Empty admin scenario -> cancel and Create Automation buttons
	// Empty end user and error scenario -> Ok button
	if (rules.length < 1) {
		if (fetchError || !canManageAutomation) {
			modalButtons.push(okButton);
		} else {
			modalButtons.push(cancelButton, createAutomationButton);
		}
	} else {
		modalButtons.push(cancelButton, automateButton);
	}
	return <>{modalButtons}</>;
};
