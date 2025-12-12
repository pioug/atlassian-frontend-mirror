import { defineMessages } from 'react-intl-next';

const messages = defineMessages({
	selectorLabel: {
		id: 'rovo-agent-selector.label',
		defaultMessage: 'Select agent',
		description: 'Label for the agent selector dropdown',
	},
	rovoAgentPlaceholder: {
		id: 'rovo-agent-selector.lplaceholder',
		defaultMessage: 'Select a Rovo agent',
		description: 'Placeholder for the Rovo Agent select on the customer portal settings page',
	},
	noOptionsMessage: {
		id: 'rovo-agent-selector.lno-options-message',
		defaultMessage: 'No agents found',
		description: 'Message displayed when no options are available',
	},
	
});

export default messages;
