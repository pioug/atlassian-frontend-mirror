import React, { Fragment, useState } from 'react';

import Button from '@atlaskit/button/default/button';
import Form from '@atlaskit/form/form';
import { ErrorMessage } from '@atlaskit/form/error-message';
import Field from '@atlaskit/form/field';
import { FormFooter } from '@atlaskit/form/form-footer';
import { MessageWrapper } from '@atlaskit/form/message-wrapper';
import Select from '@atlaskit/select/default';
import type { ValueType } from '@atlaskit/select/types';

interface Option {
	label: string;
	value: string;
}

const colors = [
	{ label: 'blue', value: 'blue' },
	{ label: 'red', value: 'red' },
	{ label: 'purple', value: 'purple' },
	{ label: 'black', value: 'black' },
	{ label: 'white', value: 'white' },
	{ label: 'gray', value: 'gray' },
	{ label: 'yellow', value: 'yellow' },
	{ label: 'orange', value: 'orange' },
	{ label: 'teal', value: 'teal' },
];

export default function OnBlurValidationExample(): React.JSX.Element {
	const [selectHasError, setSelectHasError] = useState(false);
	const [selectValue, setSelectValue] = useState<ValueType<Option>>();

	const handleSubmit = (formState: { command: string }) => {
		console.log('form state', formState);
	};

	const handleSelectBlurEvent = () => {
		if (selectValue) {
			setSelectHasError(false);
		} else {
			setSelectHasError(true);
		}
	};

	return (
		<div
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				display: 'flex',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				width: '400px',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				maxWidth: '100%',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				margin: '0 auto',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				flexDirection: 'column',
			}}
		>
			<Form onSubmit={handleSubmit}>
				<Field<ValueType<Option>>
					name="colors"
					label="Select a color"
					defaultValue={null}
					isRequired
					validate={(value) => {
						setSelectValue(value);
					}}
				>
					{({ fieldProps: { id, ...rest } }) => {
						return (
							<Fragment>
								<Select<Option>
									inputId={id}
									{...rest}
									options={colors}
									isClearable
									clearControlLabel="Clear color"
									isInvalid={selectHasError}
									descriptionId={selectHasError ? `${id}-error` : undefined}
									onBlur={handleSelectBlurEvent}
								/>
								<MessageWrapper>
									{selectHasError && (
										<div id={`${id}-error`}>
											<ErrorMessage>Please select a color</ErrorMessage>
										</div>
									)}
								</MessageWrapper>
							</Fragment>
						);
					}}
				</Field>
				<FormFooter>
					<Button type="submit">Next</Button>
				</FormFooter>
			</Form>
		</div>
	);
}
