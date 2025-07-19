// @ts-ignore
import outdent from 'outdent';

import { tester } from '../../__tests__/utils/_tester';
import rule, { useCheckboxFieldMessage, useRangeFieldMessage } from '../index';

tester.run('use-correct-field', rule, {
	valid: [
		// Should pass for normal field
		`
			import { Field } from '@atlaskit/form';
			import Textfield from '@atlaskit/textfield';

			<Field aria-required={true} name="username" defaultValue="" label="Username" isRequired>
				{({ fieldProps }) => <TextField {...fieldProps} />}
			</Field>
		`,
		// Should pass for normal field and other imports
		`
			import { Field } from '@atlaskit/form';
			import Checkbox from '@foo/bar';

			<Field aria-required={true} name="username" defaultValue="" label="Username" isRequired>
				{({ fieldProps }) => <Checkbox {...fieldProps} />}
			</Field>
		`,
		// Should pass for checkbox field
		`
			import { CheckboxField } from '@atlaskit/form';
			import Checkbox from '@atlaskit/checkbox';

			<CheckboxField>
				{({ fieldProps }) => <Checkbox {...fieldProps} />}
			</CheckboxField>
		`,
		// Should pass for range field
		`
			import { RangeField } from '@atlaskit/form';
			import Range from '@atlaskit/range';

			<RangeField>
				{({ fieldProps }) => <Range {...fieldProps} />}
			</RangeField>
		`,
		// Should pass for toggle with checkbox field
		`
			import { CheckboxField } from '@atlaskit/form';
			import Toggle from '@atlaskit/toggle';

			<CheckboxField>
				{({ fieldProps }) => <Toggle {...fieldProps} />}
			</CheckboxField>
		`,
	],
	invalid: [
		// Should not pass if checkbox in normal field
		{
			code: outdent`
				import { Field } from '@atlaskit/form';
				import Checkbox from '@atlaskit/checkbox';

				<Field name="remember" isRequired>
					{({ fieldProps }) => <Checkbox {...fieldProps} label="Remember me" />}
				</Field>
    `,
			errors: [
				{
					messageId: 'useCheckboxField',
					suggestions: [
						{
							desc: useCheckboxFieldMessage,
							output: outdent`
								import { CheckboxField, Field } from '@atlaskit/form';
								import Checkbox from '@atlaskit/checkbox';

								<CheckboxField name="remember" isRequired>
									{({ fieldProps }) => <Checkbox {...fieldProps} label="Remember me" />}
								</CheckboxField>
							`,
						},
					],
				},
			],
		},
		// Should not pass if checkbox in normal field with different name
		{
			code: outdent`
				import { Field } from '@atlaskit/form';
				import AkCheckbox from '@atlaskit/checkbox';

				<Field name="remember" isRequired>
					{({ fieldProps }) => <AkCheckbox {...fieldProps} label="Remember me" />}
				</Field>
    `,
			errors: [
				{
					messageId: 'useCheckboxField',
					suggestions: [
						{
							desc: useCheckboxFieldMessage,
							output: outdent`
								import { CheckboxField, Field } from '@atlaskit/form';
								import AkCheckbox from '@atlaskit/checkbox';

								<CheckboxField name="remember" isRequired>
									{({ fieldProps }) => <AkCheckbox {...fieldProps} label="Remember me" />}
								</CheckboxField>
							`,
						},
					],
				},
			],
		},
		// Should not pass if range in normal field
		{
			code: outdent`
				import { Field } from '@atlaskit/form';
				import Range from '@atlaskit/range';

				<Field name="remember" isRequired>
					{({ fieldProps }) => <Range {...fieldProps} label="Remember me" />}
				</Field>
    `,
			errors: [
				{
					messageId: 'useRangeField',
					suggestions: [
						{
							desc: useRangeFieldMessage,
							output: outdent`
								import { RangeField, Field } from '@atlaskit/form';
								import Range from '@atlaskit/range';

								<RangeField name="remember" isRequired>
									{({ fieldProps }) => <Range {...fieldProps} label="Remember me" />}
								</RangeField>
							`,
						},
					],
				},
			],
		},
		// Should not pass if toggle in normal field
		{
			code: outdent`
				import { Field } from '@atlaskit/form';
				import Toggle from '@atlaskit/toggle';

				<Field name="remember" isRequired>
					{({ fieldProps }) => <Toggle {...fieldProps} label="Remember me" />}
				</Field>
    `,
			errors: [
				{
					messageId: 'useCheckboxFieldForToggle',
					suggestions: [
						{
							desc: useCheckboxFieldMessage,
							output: outdent`
								import { CheckboxField, Field } from '@atlaskit/form';
								import Toggle from '@atlaskit/toggle';

								<CheckboxField name="remember" isRequired>
									{({ fieldProps }) => <Toggle {...fieldProps} label="Remember me" />}
								</CheckboxField>
							`,
						},
					],
				},
			],
		},
	],
});
