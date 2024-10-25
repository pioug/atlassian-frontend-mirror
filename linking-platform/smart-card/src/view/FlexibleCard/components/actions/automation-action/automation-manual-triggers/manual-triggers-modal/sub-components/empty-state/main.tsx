import React from 'react';

import { defineMessages, FormattedMessage, useIntl } from 'react-intl-next';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import Button from '@atlaskit/button';
import { Box, Stack, xcss } from '@atlaskit/primitives';

import { useAutomationMenu } from '../../menu-context';

import EmptyIcon from './empty-icon';

const i18n = defineMessages({
	defaultEmptyStateAdminDesc: {
		id: 'automation-menu.modal.empty.automations.admin.description',
		defaultMessage:
			'Use the manual trigger to populate a menu of selections that anyone, or people you specify, can apply as one-click automations.',
		description:
			'A description shown in the automation menu when the rule list is empty for an admin.',
	},
	defaultEmptyStateDesc: {
		id: 'automation-menu.modal.empty.automations.user.description',
		defaultMessage: 'Admins haven’t configured any manually triggered automations yet.',
		description:
			'A description shown in the automation menu when the rule list is empty for a user.',
	},
	learnMoreLink: {
		id: 'automation-menu.empty-state.learn-more.link',
		defaultMessage: 'Learn more about the manual trigger',
		description:
			'The text of a link that takes a user to the documentation for manually triggered rules in Automation for Confluence.',
	},
	emptyAutomationListImageAlt: {
		id: 'automation-menu.empty-state.image.alt',
		defaultMessage: 'Empty automation list icon',
		description: 'Alternative text for the image that renders when the automation list is empty.',
	},
});

const emptyStateStyles = xcss({
	paddingLeft: 'space.300',
	paddingRight: 'space.300',
	marginTop: 'space.500',
});

const imageStyles = xcss({
	marginTop: 'space.050',
	marginBottom: 'space.300',
	width: '160px',
	height: '156px',
});

const descriptionStyles = xcss({
	width: '360px',
	textAlign: 'center',
});

export const AutomationModalEmptyState = () => {
	const { formatMessage } = useIntl();
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const {
		canManageAutomation,
		analyticsSource,
		emptyStateDescription,
		emptyStateAdminDescription,
	} = useAutomationMenu();

	const emptyStateDesc: React.ReactNode = emptyStateDescription ?? (
		<FormattedMessage {...i18n.defaultEmptyStateDesc} />
	);
	const adminEmptyStateDesc: React.ReactNode = emptyStateAdminDescription ?? (
		<FormattedMessage {...i18n.defaultEmptyStateAdminDesc} />
	);
	const displayedEmptyStateDesc = canManageAutomation ? adminEmptyStateDesc : emptyStateDesc;

	return (
		<Stack xcss={emptyStateStyles} alignInline="center" alignBlock="center" grow="fill">
			<Box xcss={imageStyles}>
				<EmptyIcon alt={formatMessage(i18n.emptyAutomationListImageAlt)} />
			</Box>
			<Box xcss={descriptionStyles}>
				{displayedEmptyStateDesc}
				{canManageAutomation && (
					<div>
						<Button
							appearance="link"
							spacing="none"
							href="https://www.atlassian.com/platform/automation"
							target="_blank"
							onClick={() => {
								createAnalyticsEvent({
									type: 'sendUIEvent',
									data: {
										action: 'clicked',
										actionSubject: 'link',
										actionSubjectId: 'learnMore',
										source: analyticsSource,
									},
								}).fire();
							}}
						>
							<FormattedMessage {...i18n.learnMoreLink} />
						</Button>
					</div>
				)}
			</Box>
		</Stack>
	);
};
