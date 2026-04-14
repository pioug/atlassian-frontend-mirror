import { defineMessages } from 'react-intl';

const _default_1: {
	verifyAgentLabel: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	unverifyAgentLabel: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	verifySuccessTitle: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	unverifySuccessTitle: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	verifyErrorTitle: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	unverifyErrorTitle: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	errorDescription: {
		id: string;
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
	verifyAgentLabel: {
		id: 'rovo-agent-components.agent-verification-dropdown-item.verify-agent',
		defaultMessage: 'Verify agent',
		description: 'Label for verify agent dropdown menu item',
	},
	unverifyAgentLabel: {
		id: 'rovo-agent-components.agent-verification-dropdown-item.unverify-agent',
		defaultMessage: 'Remove verification',
		description: 'Label for remove verification dropdown menu item',
	},
	verifySuccessTitle: {
		id: 'rovo-agent-components.agent-verification-dropdown-item.verify-success-title',
		defaultMessage: 'Agent verified',
		description: 'Title for success flag when agent is verified',
	},
	unverifySuccessTitle: {
		id: 'rovo-agent-components.agent-verification-dropdown-item.unverify-success-title',
		defaultMessage: 'Verification removed',
		description: 'Title for success flag when agent verification is removed',
	},
	verifyErrorTitle: {
		id: 'rovo-agent-components.agent-verification-dropdown-item.verify-error-title',
		defaultMessage: 'Failed to verify agent',
		description: 'Title for error flag when verifying agent fails',
	},
	unverifyErrorTitle: {
		id: 'rovo-agent-components.agent-verification-dropdown-item.unverify-error-title',
		defaultMessage: 'Failed to remove verification',
		description: 'Title for error flag when removing agent verification fails',
	},
	errorDescription: {
		id: 'rovo-agent-components.agent-verification-dropdown-item.error-description',
		defaultMessage: 'An error occurred while updating agent verification status: {errorMessage}',
		description: 'Description for error flag showing the error message',
	},
});
export default _default_1;
