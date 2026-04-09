import { defineMessages } from 'react-intl-next';

export const booleanTypeMessages: {
    booleanTruthyValue: {
        id: string;
        description: string;
        defaultMessage: string;
    }; booleanFalsyValue: {
        id: string;
        description: string;
        defaultMessage: string;
    };
} = defineMessages({
	booleanTruthyValue: {
		id: 'linkDataSource.render-type.boolean.true',
		description: 'Text to display for the boolean type when the value is true',
		defaultMessage: 'Yes',
	},
	booleanFalsyValue: {
		id: 'linkDataSource.render-type.boolean.false',
		description: 'Text to display for the boolean type when the value is false',
		defaultMessage: 'No',
	},
});
