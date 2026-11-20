import { defineMessages, type MessageDescriptor } from 'react-intl';

import { type Appearance } from '../types';

export const titleIconMessages: Record<Appearance, MessageDescriptor> = defineMessages({
	warning: {
		id: 'modal-dialog.title.warning-icon-label',
		defaultMessage: 'warning',
		description:
			'Accessible label for the warning icon inside a modal dialog heading. Identifies the severity of the dialog to screen reader users.',
	},
	danger: {
		id: 'modal-dialog.title.danger-icon-label',
		defaultMessage: 'danger',
		description:
			'Accessible label for the error icon inside a modal dialog heading with danger appearance. Indicates a destructive or high-risk action to screen reader users.',
	},
});
