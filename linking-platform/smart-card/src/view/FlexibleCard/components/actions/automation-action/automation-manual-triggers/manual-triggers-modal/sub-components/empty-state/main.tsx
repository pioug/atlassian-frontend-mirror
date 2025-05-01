/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { defineMessages, FormattedMessage, useIntl } from 'react-intl-next';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import ButtonOld from '@atlaskit/button';
import { cssMap, jsx } from '@atlaskit/css';
import Link from '@atlaskit/link';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { useAutomationMenu } from '../../menu-context';

import EmptyIcon from './empty-icon';

const styles = cssMap({
	emptyState: {
		paddingLeft: token('space.300'),
		paddingRight: token('space.300'),
		marginTop: token('space.500'),
	},
	image: {
		marginTop: token('space.050'),
		marginBottom: token('space.300'),
		width: '160px',
		height: '156px',
	},
	description: {
		width: '360px',
		textAlign: 'center',
	},
});

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
		<Stack xcss={styles.emptyState} alignInline="center" alignBlock="center" grow="fill">
			<Box xcss={styles.image}>
				<EmptyIcon alt={formatMessage(i18n.emptyAutomationListImageAlt)} />
			</Box>
			<Box xcss={styles.description}>
				{displayedEmptyStateDesc}
				{canManageAutomation && (
					<div>
						{fg('platform-smart-card-remove-legacy-button') ? (
							<Link
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
							</Link>
						) : (
							<ButtonOld
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
							</ButtonOld>
						)}
					</div>
				)}
			</Box>
		</Stack>
	);
};
