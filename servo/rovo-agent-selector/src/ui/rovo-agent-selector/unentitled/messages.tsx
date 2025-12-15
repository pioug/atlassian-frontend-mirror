import { defineMessages } from 'react-intl-next';

export default defineMessages({
	noRovoEntitlementText: {
		id: 'rovo-agent-selector.unentitled.no-rovo-entitlement-text',
		defaultMessage:
			'You do not have access to Rovo. Please contact your administrator to get access.',
		description:
			'Text displayed in place of rovo agent selector when the user does not have access to Rovo',
	},
	noCreateAgentsPermissionText: {
		id: 'rovo-agent-selector.unentitled.no-create-agents-permission-text',
		defaultMessage:
			'You do not have permission to create agents. Please contact your administrator to get permission.',
		description:
			'Text displayed in place of rovo agent selector when the user does not have permission to create Rovo agents',
	},
});
