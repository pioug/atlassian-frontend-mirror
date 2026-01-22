import { defineMessages } from 'react-intl-next';

export default defineMessages({
	verifyAgentLabel: {
		id: 'rovo-agent-components.agent-verification-dropdown-item.verify-agent',
		defaultMessage: 'Verify agent',
		description: 'Label for verify agent dropdown menu item',
	},
	unverifyAgentLabel: {
		id: 'rovo-agent-components.agent-verification-dropdown-item.unverify-agent',
		defaultMessage: 'Unverify agent',
		description: 'Label for unverify agent dropdown menu item',
	},
	verifySuccessTitle: {
		id: 'rovo-agent-components.agent-verification-dropdown-item.verify-success-title',
		defaultMessage: 'Agent verified',
		description: 'Title for success flag when agent is verified',
	},
	unverifySuccessTitle: {
		id: 'rovo-agent-components.agent-verification-dropdown-item.unverify-success-title',
		defaultMessage: 'Agent unverified',
		description: 'Title for success flag when agent is unverified',
	},
	verifyErrorTitle: {
		id: 'rovo-agent-components.agent-verification-dropdown-item.verify-error-title',
		defaultMessage: 'Failed to verify agent',
		description: 'Title for error flag when verifying agent fails',
	},
	unverifyErrorTitle: {
		id: 'rovo-agent-components.agent-verification-dropdown-item.unverify-error-title',
		defaultMessage: 'Failed to unverify agent',
		description: 'Title for error flag when unverifying agent fails',
	},
	errorDescription: {
		id: 'rovo-agent-components.agent-verification-dropdown-item.error-description',
		defaultMessage: 'An error occurred while updating agent verification status: {errorMessage}',
		description: 'Description for error flag showing the error message',
	},
});
