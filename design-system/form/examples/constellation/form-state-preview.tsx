/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import Banner from '@atlaskit/banner';
import { css, jsx } from '@atlaskit/css';
import Form, { Field, useFormState } from '@atlaskit/form';
import Select, { type ValueType as Value } from '@atlaskit/select';
import TextArea from '@atlaskit/textarea';
import { token } from '@atlaskit/tokens';

interface Option {
	label: string;
	value: 'warning' | 'error' | 'announcement';
}

const formContainerStyles = css({
	maxWidth: '400px',
	margin: '0 auto',
});

const previewStyles = css({ marginBlockStart: token('space.200') });

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
		// eslint-disable-next-line @atlaskit/design-system/use-primitives
		<div css={previewStyles}>
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
			{({ formProps }) => (
				<form {...formProps}>
					<div css={formContainerStyles}>
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
									clearControlLabel="Clear appearance"
								/>
							)}
						</Field>
					</div>
					<FormPreview />
				</form>
			)}
		</Form>
	);
}
