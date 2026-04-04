/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { Checkbox } from '@atlaskit/checkbox';
import { CheckboxField, Field, FormFooter } from '@atlaskit/form';
import Textarea from '@atlaskit/textarea';

export type SurveyFormExpandedFeedbackProps = {
	canContactDefault: boolean;
	onFeedbackChange: () => void;
	submitting: boolean;
	textLabel: string;
	textPlaceholder: string;
};

export function SurveyFormExpandedFeedback({
	canContactDefault,
	onFeedbackChange,
	submitting,
	textLabel,
	textPlaceholder,
}: SurveyFormExpandedFeedbackProps): React.JSX.Element {
	return (
		<React.Fragment>
			<Field<string, HTMLTextAreaElement>
				name="writtenFeedback"
				defaultValue=""
				isDisabled={submitting}
			>
				{({ fieldProps }) => (
					<Textarea
						{...fieldProps}
						aria-label={textLabel}
						placeholder={textPlaceholder}
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
			<FormFooter>
				<Button type="submit" appearance="primary" isLoading={submitting}>
					Submit
				</Button>
			</FormFooter>
		</React.Fragment>
	);
}
