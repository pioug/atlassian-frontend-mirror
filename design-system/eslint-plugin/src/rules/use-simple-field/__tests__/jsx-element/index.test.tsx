// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import { linesOnly } from '../../../__tests__/utils/_strings';
import rule, { convertField } from '../../index';

ruleTester.run('use-simple-field', rule, {
	valid: [
		`
			// No field
			<input />
		`,
		`
			// Field, simple
			import { Field } from '@atlaskit/form';
			<Field
				component={({ fieldProps }) => (
					<input {...fieldProps} />
				)}
			/>
		`,
		...['ErrorMessage', 'HelperMessage', 'ValidMessage'].map(
			(msgComponent) =>
				`
			// Field, has message '${msgComponent}'
			import { ${msgComponent}, Field } from '@atlaskit/form';
			<Field
				component={({ fieldProps }) => (
					<>
						<input {...fieldProps} />
						<${msgComponent}>Message</${msgComponent}>
					</>
				)}
			/>
			`,
		),
		`
			// Field, doesn't destructure
			import { Field } from '@atlaskit/form';
			<Field>
				{(arg) => (
					<>
						<input {...arg.fieldProps} />
						<p>{error}</p>
					</>
				)}
			</Field>
		`,
		`
			// Field, uses more than fieldProps
			import { Field } from '@atlaskit/form';
			<Field>
				{({ fieldProps, error }) => (
					<>
						<input {...fieldProps} />
						<p>{error}</p>
					</>
				)}
			</Field>
		`,
	],
	invalid: [
		{
			code: linesOnly`
				// Field
				import { Field } from '@atlaskit/form';
				<Field>
					{({ fieldProps }) => <input {...fieldProps} />}
				</Field>
			`,
			errors: [
				{
					messageId: 'useSimpleField',
					suggestions: [
						{
							desc: convertField,
							output: linesOnly`
								// Field
								import { Field } from '@atlaskit/form';
								<Field component={({ fieldProps }) => <input {...fieldProps} />} >

								</Field>
							`,
						},
					],
				},
			],
		},
		{
			code: linesOnly`
				// Field
				import { Field } from '@atlaskit/form';
				<Field>
					{({ fieldProps: AkFieldProps }) => <input {...AkFieldProps} />}
				</Field>
			`,
			errors: [
				{
					messageId: 'useSimpleField',
					suggestions: [
						{
							desc: convertField,
							output: linesOnly`
								// Field
								import { Field } from '@atlaskit/form';
								<Field component={({ fieldProps: AkFieldProps }) => <input {...AkFieldProps} />} >

								</Field>
							`,
						},
					],
				},
			],
		},
		{
			code: linesOnly`
				// Field with aliased name
				import { Field as AkField } from '@atlaskit/form';
				<AkField>
					{({ fieldProps }) => <input {...fieldProps} />}
				</AkField>
			`,
			errors: [
				{
					messageId: 'useSimpleField',
					suggestions: [
						{
							desc: convertField,
							output: linesOnly`
								// Field with aliased name
								import { Field as AkField } from '@atlaskit/form';
								<AkField component={({ fieldProps }) => <input {...fieldProps} />} >

								</AkField>
							`,
						},
					],
				},
			],
		},
		{
			code: linesOnly`
				// Field in Form with aliased fieldprops
				import Form, { Field } from '@atlaskit/form';
				<Form>
					<Field>
						{({ fieldProps: AkFieldProps }) => <input {...AkFieldProps} />}
					</Field>
				</Form>
			`,
			errors: [
				{
					messageId: 'useSimpleField',
					suggestions: [
						{
							desc: convertField,
							output: linesOnly`
								// Field in Form with aliased fieldprops
								import Form, { Field } from '@atlaskit/form';
								<Form>
									<Field component={({ fieldProps: AkFieldProps }) => <input {...AkFieldProps} />} >

									</Field>
								</Form>
							`,
						},
					],
				},
			],
		},
	],
});
