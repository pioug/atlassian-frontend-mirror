import React from 'react';

import Banner from '@atlaskit/banner';
import { Box, xcss } from '@atlaskit/primitives';
import Select, { type ValueType as Value } from '@atlaskit/select';
import TextArea from '@atlaskit/textarea';

import Form, { Field, useFormState } from '../../src';

interface Option {
	label: string;
	value: 'warning' | 'error' | 'announcement';
}

const formContainerStyles = xcss({
	maxWidth: '400px',
	margin: '0 auto',
});

const previewStyles = xcss({ marginBlockStart: 'space.200' });

type BannerForm = {
	appearance: Option;
	content: string;
};

const FormPreview = () => {
	const formState = useFormState<BannerForm>({
		values: true,
		pristine: true,
		dirty: true,
	});

	return (
		<Box xcss={previewStyles}>
			<Banner appearance={formState?.values.appearance.value}>{formState?.values.content}</Banner>
			<pre>{JSON.stringify(formState, null, 2)}</pre>;
		</Box>
	);
};

export default function StateSubscriptionExample() {
	return (
		<Form
			onSubmit={(data) => {
				console.log('form data', data);
			}}
		>
			{({ formProps }) => (
				<form {...formProps}>
					<Box xcss={formContainerStyles}>
						<Field<string, HTMLTextAreaElement>
							name="content"
							defaultValue=" "
							label="Banner content"
						>
							{({ fieldProps }) => <TextArea {...fieldProps} />}
						</Field>

						<Field<Value<Option>>
							name="appearance"
							label="Select banner appearance"
							defaultValue={{ label: 'Announcement', value: 'announcement' }}
						>
							{({ fieldProps: { id, ...rest }, error }) => (
								<Select<Option>
									inputId={id}
									{...rest}
									options={[
										{ label: 'Announcement', value: 'announcement' },
										{ label: 'Warning', value: 'warning' },
										{ label: 'Error', value: 'error' },
									]}
									isClearable
								/>
							)}
						</Field>
					</Box>
					<FormPreview />
				</form>
			)}
		</Form>
	);
}
