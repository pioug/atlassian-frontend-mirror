import React from 'react';

import Checkbox from '@atlaskit/checkbox';
import { CheckboxField, Field } from '@atlaskit/form';
import Textarea from '@atlaskit/textarea';

export type SurveyFormExpandedFeedbackProps = {
	canContactDefault: boolean;
	onFeedbackChange: () => void;
	submitting: boolean;
	textLabel: string;
};

export function SurveyFormExpandedFeedback({
	canContactDefault,
	onFeedbackChange,
	submitting,
	textLabel,
}: SurveyFormExpandedFeedbackProps): React.JSX.Element {
	return (
		<React.Fragment>
			<Field<string, HTMLTextAreaElement>
				name="writtenFeedback"
				defaultValue=""
				isDisabled={submitting}
				label={textLabel}
			>
				{({ fieldProps }) => (
					<Textarea
						{...fieldProps}
						aria-label={textLabel}
						onChange={(event) => {
							fieldProps.onChange(event);
							onFeedbackChange();
						}}
					/>
				)}
			</Field>
			<CheckboxField name="canContact" isDisabled={submitting} defaultIsChecked={canContactDefault}>
				{({ fieldProps }) => (
					<Checkbox {...fieldProps} label="Atlassian can contact me about this feedback" />
				)}
			</CheckboxField>
		</React.Fragment>
	);
}
