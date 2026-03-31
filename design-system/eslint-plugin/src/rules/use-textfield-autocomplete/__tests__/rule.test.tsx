import { tester } from '../../__tests__/utils/_tester';
import rule, { ruleName } from '../index';

tester.run(ruleName, rule, {
	valid: [
		// Not ADS Textfield
		`
		import Foo from 'bar';

		<Foo type="email" />
		`,
		// Textfield with correct autoComplete for email
		`
		import Textfield from '@atlaskit/textfield';

		<Textfield type="email" autoComplete="email" />
		`,
		// Textfield with correct autoComplete for tel
		`
		import Textfield from '@atlaskit/textfield';

		<Textfield type="tel" autoComplete="tel" />
		`,
		// Textfield with correct autoComplete for url
		`
		import Textfield from '@atlaskit/textfield';

		<Textfield type="url" autoComplete="url" />
		`,
		// Textfield without type prop
		`
		import Textfield from '@atlaskit/textfield';

		<Textfield />
		`,
		// Textfield with non-matching type (e.g. text, number)
		`
		import Textfield from '@atlaskit/textfield';

		<Textfield type="text" />
		`,
		// Textfield with dynamic autoComplete expression
		`
		import Textfield from '@atlaskit/textfield';

		<Textfield type="email" autoComplete={someVar} />
		`,
		// Textfield with valid non-email autocomplete value (Will be caught by the jsx-a11y/autocomplete-valid rule)
		`
		import Textfield from '@atlaskit/textfield';

		<Textfield type="email" autoComplete="work email" />
		`,
		// Aliased import with correct autocomplete
		`
		import AkTextField from '@atlaskit/textfield';

		<AkTextField type="email" autoComplete="email" />
		`,
		// Textfield with dynamic type (We cannot determine)
		`
		import Textfield from '@atlaskit/textfield';

		<Textfield type={inputType} />
		`,
		// Dynamic autoComplete for tel
		`
		import Textfield from '@atlaskit/textfield';

		<Textfield type="tel" autoComplete={phoneAutoComplete} />
		`,
		// Dynamic autoComplete for url
		`
		import Textfield from '@atlaskit/textfield';

		<Textfield type="url" autoComplete={urlAutoComplete} />
		`,
	],
	invalid: [
		// Missing autoComplete for email
		{
			code: `
			import Textfield from '@atlaskit/textfield';

			<Textfield type="email" />
			`,
			errors: [
				{
					messageId: 'missingAutocomplete',
				},
			],
			output: `
			import Textfield from '@atlaskit/textfield';

			<Textfield type="email" autoComplete='email' />
			`,
		},
		// autoComplete="off" for email
		{
			code: `
			import Textfield from '@atlaskit/textfield';

			<Textfield type="email" autoComplete="off" />
			`,
			errors: [
				{
					messageId: 'noAutocompleteOff',
				},
			],
			output: `
			import Textfield from '@atlaskit/textfield';

			<Textfield type="email" autoComplete="email" />
			`,
		},
		// Aliased import missing autoComplete
		{
			code: `
			import AkTextField from '@atlaskit/textfield';

			<AkTextField type="email" />
			`,
			errors: [
				{
					messageId: 'missingAutocomplete',
				},
			],
			output: `
			import AkTextField from '@atlaskit/textfield';

			<AkTextField type="email" autoComplete='email' />
			`,
		},
		// Missing autoComplete for tel
		{
			code: `
			import Textfield from '@atlaskit/textfield';

			<Textfield type="tel" />
			`,
			errors: [
				{
					messageId: 'missingAutocomplete',
				},
			],
			output: `
			import Textfield from '@atlaskit/textfield';

			<Textfield type="tel" autoComplete='tel' />
			`,
		},
		// autoComplete="off" for tel
		{
			code: `
			import Textfield from '@atlaskit/textfield';

			<Textfield type="tel" autoComplete="off" />
			`,
			errors: [
				{
					messageId: 'noAutocompleteOff',
				},
			],
			output: `
			import Textfield from '@atlaskit/textfield';

			<Textfield type="tel" autoComplete="tel" />
			`,
		},
		// Missing autoComplete for url
		{
			code: `
			import Textfield from '@atlaskit/textfield';

			<Textfield type="url" />
			`,
			errors: [
				{
					messageId: 'missingAutocomplete',
				},
			],
			output: `
			import Textfield from '@atlaskit/textfield';

			<Textfield type="url" autoComplete='url' />
			`,
		},
		// autoComplete="off" for url
		{
			code: `
			import Textfield from '@atlaskit/textfield';

			<Textfield type="url" autoComplete="off" />
			`,
			errors: [
				{
					messageId: 'noAutocompleteOff',
				},
			],
			output: `
			import Textfield from '@atlaskit/textfield';

			<Textfield type="url" autoComplete="url" />
			`,
		},
	],
});
