import { defineMessages } from 'react-intl';

const messages = defineMessages({
	selectorLabel: {
		id: 'rovo-agent-selector.label',
		defaultMessage: 'Select agent',
		description: 'The text is shown as the visible label for the drop-down selector component that allows the user to choose a Rovo AI agent from a list of available agents.',
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
