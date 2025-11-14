/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import Banner from '@atlaskit/banner';
import { cssMap, jsx } from '@atlaskit/css';
import Form, { Field, useFormState } from '@atlaskit/form';
import Select, { type ValueType as Value } from '@atlaskit/select';
import TextArea from '@atlaskit/textarea';
import { token } from '@atlaskit/tokens';

interface Option {
	label: string;
	value: 'warning' | 'error' | 'announcement';
}

const styles = cssMap({
	formContainer: {
		maxWidth: '400px',
		margin: '0 auto',
	},
	preview: {
		marginBlockStart: token('space.200'),
	},
});

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
		<div css={styles.preview}>
			<Banner appearance={formState?.values.appearance.value}>{formState?.values.content}</Banner>
			<pre>{JSON.stringify(formState, null, 2)}</pre>;
		</div>
	);
};

export default function StateSubscriptionExample() {
	return (
		<Form
			onSubmit={(data) => {
				console.log('form data', data);
			}}
		>
			<div css={styles.formContainer}>
				<Field<string, HTMLTextAreaElement>
					name="content"
					defaultValue=" "
					label="Banner content"
					component={({ fieldProps }) => <TextArea {...fieldProps} />}
				/>

				<Field<Value<Option>>
					name="appearance"
					label="Select banner appearance"
					defaultValue={{ label: 'Announcement', value: 'announcement' }}
					component={({ fieldProps: { id, ...rest } }) => (
						<Select<Option>
							inputId={id}
							{...rest}
							options={[
								{ label: 'Announcement', value: 'announcement' },
								{ label: 'Warning', value: 'warning' },
								{ label: 'Error', value: 'error' },
							]}
							isClearable
							clearControlLabel="Clear appearance"
						/>
					)}
				/>
			</div>
			<FormPreview />
		</Form>
	);
}
