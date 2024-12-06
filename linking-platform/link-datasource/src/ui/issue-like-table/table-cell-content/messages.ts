import { defineMessages } from 'react-intl-next';

export const tableCellMessages = defineMessages({
	editButtonLabel: {
		id: 'linkDataSource.issue-line-table.edit-button-label.non-final',
		description:
			'Label of inline editable field, used mostly for screen readers. This label is used to describe the field that is editable and can be changed. e.g John Doe, Assignee field',
		defaultMessage: '{fieldValue}, {fieldName} field',
	},
});
