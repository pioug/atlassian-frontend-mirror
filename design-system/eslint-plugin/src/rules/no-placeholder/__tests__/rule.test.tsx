import { tester } from '../../__tests__/utils/_tester';
import rule, { AFFECTED_ATLASKIT_PACKAGES, AFFECTED_HTML_ELEMENTS } from '../index';

tester.run('no-placeholder', rule, {
	valid: [
		`
			// Ignore non-input HTML elements
      <p placeholder="foo">Hello</p>
    `,
		`
      // Ignore inputs without placeholders
      <input />
    `,
		`
			// Ignore non-DS inputs
			import Textfield from '@foo/textfield';

			<Textfield placeholder="foo" />
    `,
		`
			// Ignore DS input with no placeholder
			import Textfield from '@atlaskit/textfield';

			<Textfield />
    `,
		`
			// Ignore DS import from input package that is not one of the ones we are focusing on
			import { BingBongInput } from '@atlaskit/textfield';

			<BingBongInput placeholder="foo" />
    `,
	],
	invalid: [
		...AFFECTED_HTML_ELEMENTS.map((elementName) => [
			{
				code: `
				// HTML input with placeholder
				<${elementName} placeholder="foo" />
			`,
				errors: [
					{
						messageId: 'noPlaceholder',
					},
				],
			},
			{
				code: `
				// HTML input with placeholder and aria-describedby
				<>
					<${elementName} aria-describedby="bar" placeholder="foo" />
					<p id="bar">blah</p>
				</>
			`,
				errors: [
					{
						messageId: 'noPlaceholder',
					},
				],
			},
		]),
		...Object.keys(AFFECTED_ATLASKIT_PACKAGES)
			.map((packageName) => {
				const isolatedPackageName = packageName.split('/').slice(-1)[0];
				const defaultImportText =
					isolatedPackageName.charAt(0).toUpperCase() + isolatedPackageName.slice(1);

				return AFFECTED_ATLASKIT_PACKAGES[packageName].map((importName) => [
					{
						code: `
					// DS input with placeholder
					import ${importName === 'default' ? defaultImportText : `{ ${importName} }`} from '${packageName}';
					<${importName === 'default' ? defaultImportText : importName} placeholder="foo" />
				`,
						errors: [
							{
								messageId: 'noPlaceholder',
							},
						],
					},
					{
						code: `
					// Renamed DS input with placeholder
					import ${importName === 'default' ? `Ak${defaultImportText}` : `{ ${importName} as Ak${importName} }`} from '${packageName}';
					<Ak${importName === 'default' ? defaultImportText : importName} placeholder="foo" />
				`,
						errors: [
							{
								messageId: 'noPlaceholder',
							},
						],
					},
					{
						code: `
					// DS input with placeholder inside of a simple field
					import { Field } from '@atlaskit/form';
					import ${importName === 'default' ? defaultImportText : `{ ${importName} }`} from '${packageName}';
					<Field component={(fieldProps) => <${importName === 'default' ? defaultImportText : importName} {...fieldProps} placeholder="foo" />} />
				`,
						errors: [
							{
								messageId: 'noPlaceholderOnSimpleField',
							},
						],
					},
					{
						code: `
					// DS input with placeholder inside of a complex field
					import { Field } from '@atlaskit/form';
					import ${importName === 'default' ? defaultImportText : `{ ${importName} }`} from '${packageName}';
					<Field>
						{(fieldProps) => <${importName === 'default' ? defaultImportText : importName} {...fieldProps} placeholder="foo" />}
					</Field>
				`,
						errors: [
							{
								messageId: 'noPlaceholderOnComplexField',
							},
						],
					},
				]);
			})
			.flat(),
		{
			code: `
					// DS input that is after other imports with placeholder
					import { Field } from '@atlaskit/form';
					import Default, { Foo, Bar, DatePicker } from '@atlaskit/datetime-picker';
					<Field>
						{(fieldProps) => <DatePicker {...fieldProps} placeholder="foo" />}
					</Field>
				`,
			errors: [
				{
					messageId: 'noPlaceholderOnComplexField',
				},
			],
		},
	].flat(),
});
