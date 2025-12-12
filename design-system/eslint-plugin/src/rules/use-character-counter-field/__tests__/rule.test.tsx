// @ts-ignore
import outdent from 'outdent';

import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('use-character-counter-field', rule, {
	valid: [
		{
			name: 'should pass when using Textfield without maxLength or minLength',
			code: outdent`
				import Textfield from '@atlaskit/textfield';

				<Textfield label="Name" placeholder="Enter your name" />
			`,
		},
		{
			name: 'should pass when using Textarea without maxLength or minLength',
			code: outdent`
				import Textarea from '@atlaskit/textarea';

				<Textarea label="Description" placeholder="Enter description" />
			`,
		},
		{
			name: 'should pass when Textfield is from a different package',
			code: outdent`
				import Textfield from '@other-package/textfield';

				<Textfield label="Name" maxLength={50} />
			`,
		},
		{
			name: 'should pass when Textarea is from a different package',
			code: outdent`
				import Textarea from '@other-package/textarea';

				<Textarea label="Description" maxLength={200} />
			`,
		},
		{
			name: 'should pass with other props but no character limits',
			code: outdent`
				import Textfield from '@atlaskit/textfield';

				<Textfield label="Name" placeholder="Enter your name" isRequired />
			`,
		},
		{
			// TODO: DSP-24389 - Update below few tests when we export standalone CharacterCounter
			name: 'should pass when Textfield with maxLength is outside Form context',
			code: outdent`
				import Textfield from '@atlaskit/textfield';

				<Textfield label="Name" maxLength={50} />
			`,
		},
		{
			name: 'should pass when Textarea with maxLength is outside Form context',
			code: outdent`
				import Textarea from '@atlaskit/textarea';

				<Textarea label="Description" maxLength={200} />
			`,
		},
		{
			name: 'should pass when Textfield with minLength is outside Form context',
			code: outdent`
				import Textfield from '@atlaskit/textfield';

				<Textfield label="Name" minLength={10} />
			`,
		},
		{
			name: 'should pass when in custom Form component (not from @atlaskit/form)',
			code: outdent`
				import Textfield from '@atlaskit/textfield';
				import { Form } from './custom-form';

				<Form>
					<Textfield label="Name" maxLength={50} />
				</Form>
			`,
		},
		{
			name: 'should pass when in custom Field component (not from @atlaskit/form)',
			code: outdent`
				import Textfield from '@atlaskit/textfield';
				import { Field } from './custom-field';

				<Field>
					<Textfield label="Name" maxLength={50} />
				</Field>
			`,
		},
		{
			name: 'should pass when using CharacterCounterField inside Form',
			code: outdent`
				import Form, { CharacterCounterField } from '@atlaskit/form';
				import Textfield from '@atlaskit/textfield';

				<Form>
					<CharacterCounterField name="name" label="Name" maxCharacters={50}>
						{({ fieldProps }) => <Textfield {...fieldProps} />}
					</CharacterCounterField>
				</Form>
			`,
		},
	],
	invalid: [
		{
			name: 'should warn when Textfield has maxLength inside Form',
			code: outdent`
				import Form, { Field } from '@atlaskit/form';
				import Textfield from '@atlaskit/textfield';

				<Form>
					<Field name="name">
						{({ fieldProps }) => <Textfield {...fieldProps} label="Name" maxLength={50} />}
					</Field>
				</Form>
			`,
			errors: [
				{
					messageId: 'useCharacterCounterField',
				},
			],
		},
		{
			name: 'should warn when Textfield has minLength inside Form',
			code: outdent`
				import Form, { Field } from '@atlaskit/form';
				import Textfield from '@atlaskit/textfield';

				<Form>
					<Field name="name">
						{({ fieldProps }) => <Textfield {...fieldProps} label="Name" minLength={10} />}
					</Field>
				</Form>
			`,
			errors: [
				{
					messageId: 'useCharacterCounterField',
				},
			],
		},
		{
			name: 'should warn when Textfield has both maxLength and minLength inside Form',
			code: outdent`
				import Form, { Field } from '@atlaskit/form';
				import Textfield from '@atlaskit/textfield';

				<Form>
					<Field name="name">
						{({ fieldProps }) => <Textfield {...fieldProps} label="Name" minLength={10} maxLength={50} />}
					</Field>
				</Form>
			`,
			errors: [
				{
					messageId: 'useCharacterCounterField',
				},
			],
		},
		{
			name: 'should warn when Textarea has maxLength inside Form',
			code: outdent`
				import Form, { Field } from '@atlaskit/form';
				import Textarea from '@atlaskit/textarea';

				<Form>
					<Field name="description">
						{({ fieldProps }) => <Textarea {...fieldProps} label="Description" maxLength={200} />}
					</Field>
				</Form>
			`,
			errors: [
				{
					messageId: 'useCharacterCounterField',
				},
			],
		},
		{
			name: 'should warn when Textarea has minLength inside Form',
			code: outdent`
				import Form, { Field } from '@atlaskit/form';
				import Textarea from '@atlaskit/textarea';

				<Form>
					<Field name="description">
						{({ fieldProps }) => <Textarea {...fieldProps} label="Description" minLength={50} />}
					</Field>
				</Form>
			`,
			errors: [
				{
					messageId: 'useCharacterCounterField',
				},
			],
		},
		{
			name: 'should warn when Textarea has both maxLength and minLength inside Form',
			code: outdent`
				import Form, { Field } from '@atlaskit/form';
				import Textarea from '@atlaskit/textarea';

				<Form>
					<Field name="description">
						{({ fieldProps }) => <Textarea {...fieldProps} label="Description" minLength={50} maxLength={200} />}
					</Field>
				</Form>
			`,
			errors: [
				{
					messageId: 'useCharacterCounterField',
				},
			],
		},
		{
			name: 'should warn when using CharacterCounterField',
			code: outdent`
				import { CharacterCounterField } from '@atlaskit/form';
				import Textfield from '@atlaskit/textfield';

				<CharacterCounterField maxCharacters={100}>
					{({ fieldProps }) => <Textfield minLength={10} {...fieldProps} />}
				</CharacterCounterField>
			`,
			errors: [
				{
					messageId: 'useCharacterCounterField',
				},
			],
		},
		{
			name: 'should warn with custom import name inside Form',
			code: outdent`
				import Form, { Field } from '@atlaskit/form';
				import AkTextfield from '@atlaskit/textfield';

				<Form>
					<Field name="name">
						{({ fieldProps }) => <AkTextfield {...fieldProps} label="Name" maxLength={50} />}
					</Field>
				</Form>
			`,
			errors: [
				{
					messageId: 'useCharacterCounterField',
				},
			],
		},
		{
			name: 'should warn when used with other props inside Form',
			code: outdent`
				import Form, { Field } from '@atlaskit/form';
				import Textfield from '@atlaskit/textfield';

				<Form>
					<Field name="email">
						{({ fieldProps }) => <Textfield {...fieldProps} label="Email" type="email" placeholder="Enter email" maxLength={100} isRequired />}
					</Field>
				</Form>
			`,
			errors: [
				{
					messageId: 'useCharacterCounterField',
				},
			],
		},
		{
			name: 'should warn multiple times when multiple components have the prop inside Form',
			code: outdent`
				import Form, { Field } from '@atlaskit/form';
				import Textfield from '@atlaskit/textfield';
				import Textarea from '@atlaskit/textarea';

				<Form>
					<Field name="name">
						{({ fieldProps }) => <Textfield {...fieldProps} label="Name" maxLength={50} />}
					</Field>
					<Field name="description">
						{({ fieldProps }) => <Textarea {...fieldProps} label="Description" maxLength={200} />}
					</Field>
				</Form>
			`,
			errors: [
				{
					messageId: 'useCharacterCounterField',
				},
				{
					messageId: 'useCharacterCounterField',
				},
			],
		},
		{
			name: 'should warn when Textfield is directly inside Form (not in Field)',
			code: outdent`
				import Form from '@atlaskit/form';
				import Textfield from '@atlaskit/textfield';

				<Form>
					<Textfield label="Name" maxLength={50} />
				</Form>
			`,
			errors: [
				{
					messageId: 'useCharacterCounterField',
				},
			],
		},
		{
			name: 'should warn with custom Form import name',
			code: outdent`
				import AkForm, { Field } from '@atlaskit/form';
				import Textfield from '@atlaskit/textfield';

				<AkForm>
					<Field name="name">
						{({ fieldProps }) => <Textfield {...fieldProps} label="Name" maxLength={50} />}
					</Field>
				</AkForm>
			`,
			errors: [
				{
					messageId: 'useCharacterCounterField',
				},
			],
		},
		{
			name: 'should warn when Textfield is inside Field without Form wrapper',
			code: outdent`
				import { Field } from '@atlaskit/form';
				import Textfield from '@atlaskit/textfield';

				<Field name="name">
					{({ fieldProps }) => <Textfield {...fieldProps} label="Name" maxLength={50} />}
				</Field>
			`,
			errors: [
				{
					messageId: 'useCharacterCounterField',
				},
			],
		},
		{
			name: 'should warn when Textfield is nested deeply inside Form',
			code: outdent`
				import Form from '@atlaskit/form';
				import Textfield from '@atlaskit/textfield';

				<Form>
					<div>
						<div>
							<Textfield label="Name" maxLength={50} />
						</div>
					</div>
				</Form>
			`,
			errors: [
				{
					messageId: 'useCharacterCounterField',
				},
			],
		},
		{
			name: 'should warn when Textarea is nested deeply inside Field',
			code: outdent`
				import Form, { Field } from '@atlaskit/form';
				import Textarea from '@atlaskit/textarea';

				<Form>
					<Field name="description">
						{({ fieldProps }) => (
							<div>
								<div>
									<Textarea {...fieldProps} label="Description" maxLength={200} />
								</div>
							</div>
						)}
					</Field>
				</Form>
			`,
			errors: [
				{
					messageId: 'useCharacterCounterField',
				},
			],
		},
		{
			name: 'should warn with named Form import',
			code: outdent`
				import { Form, Field } from '@atlaskit/form';
				import Textfield from '@atlaskit/textfield';

				<Form>
					<Field name="name">
						{({ fieldProps }) => <Textfield {...fieldProps} label="Name" maxLength={50} />}
					</Field>
				</Form>
			`,
			errors: [
				{
					messageId: 'useCharacterCounterField',
				},
			],
		},
		{
			name: 'should warn when using both Textfield and Textarea in separate Fields',
			code: outdent`
				import Form, { Field } from '@atlaskit/form';
				import Textfield from '@atlaskit/textfield';
				import Textarea from '@atlaskit/textarea';

				<Form>
					<div>
						<Field name="name">
							{({ fieldProps }) => <Textfield {...fieldProps} label="Name" maxLength={50} />}
						</Field>
					</div>
					<div>
						<Field name="bio">
							{({ fieldProps }) => <Textarea {...fieldProps} label="Bio" minLength={10} />}
						</Field>
					</div>
				</Form>
			`,
			errors: [
				{
					messageId: 'useCharacterCounterField',
				},
				{
					messageId: 'useCharacterCounterField',
				},
			],
		},
	],
});
