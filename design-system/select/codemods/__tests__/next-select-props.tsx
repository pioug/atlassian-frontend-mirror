jest.autoMockOff();

import * as transformer from '../18.3.0-select-props';

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('Update Select props', () => {
	defineInlineTest(
		{ ...transformer, parser: 'tsx' },
		{},
		`
			import Foo from '@atlaskit/select';

			const App = () => {
				return (
					<Foo
						aria-errormessage={''}
						aria-live={''}
						ariaLiveMessages={''}
						captureMenuOnScroll={true}
						delimiter={''}
						isRTL={true}
						menuShouldBlockScroll={true}
						screenReaderStatus={''}
					/>
				);
			};
		`,
		`
			import Foo from '@atlaskit/select';

			const App = () => {
				return (<Foo />);
			};
		`,
		'should remove all deleted props with aliased import name',
	);

	defineInlineTest(
		{ ...transformer, parser: 'tsx' },
		{},
		`
			import Select from '@foo/bar';

			const App = () => {
				return (
					<Select
						aria-errormessage={''}
						aria-live={''}
						ariaLiveMessages={''}
						captureMenuOnScroll={true}
						delimiter={''}
						isRTL={true}
						menuShouldBlockScroll={true}
						screenReaderStatus={''}
					/>
				);
			};
		`,
		`
			import Select from '@foo/bar';

			const App = () => {
				return (
					<Select
						aria-errormessage={''}
						aria-live={''}
						ariaLiveMessages={''}
						captureMenuOnScroll={true}
						delimiter={''}
						isRTL={true}
						menuShouldBlockScroll={true}
						screenReaderStatus={''}
					/>
				);
			};
		`,
		'should not mutate if not from @atlaskit/select',
	);

	[
		'Select',
		'AsyncSelect',
		'CheckboxSelect',
		'CountrySelect',
		'CreatableSelect',
		'PopupSelect',
		'RadioSelect',
	].forEach((identifier) => {
		const variant = identifier === `Select` ? 'Select' : `{ ${identifier} }`;
		defineInlineTest(
			{ ...transformer, parser: 'tsx' },
			{},
			`
				import ${variant} from '@atlaskit/select';

				const App = () => {
					return (
						<${identifier}
							aria-errormessage={''}
							aria-live={''}
							ariaLiveMessages={''}
							captureMenuOnScroll={true}
							delimiter={''}
							isRTL={true}
							menuShouldBlockScroll={true}
							screenReaderStatus={''}
						/>
					);
				};
      		`,
			`
				import ${variant} from '@atlaskit/select';

				const App = () => {
					return (<${identifier} />);
				};
      		`,
			`should remove all deleted props for ${identifier} `,
		);

		defineInlineTest(
			{ ...transformer, parser: 'tsx' },
			{},
			`
				import ${variant} from '@atlaskit/select';

				const App = () => {
					return <${identifier} aria-invalid={true} aria-label={''} aria-labelledby={''} disabled={''} />;
				};
      		`,
			`
				import ${variant} from '@atlaskit/select';

				const App = () => {
					return <${identifier} isInvalid={true} label={''} labelId={''} isDisabled={''} />;
				};
      		`,
			`should transform all replaced props for ${identifier}`,
		);

		defineInlineTest(
			{ ...transformer, parser: 'tsx' },
			{},
			`
				import ${variant} from '@atlaskit/select';

				const App = () => {
					return <${identifier} validationState='error' />;
				};
			`,
			`
				import ${variant} from '@atlaskit/select';

				const App = () => {
					return <${identifier} isInvalid />;
				};
			`,
			`should transform validationState="error" to isInvalid for ${identifier}`,
		);

		defineInlineTest(
			{ ...transformer, parser: 'tsx' },
			{},
			`
				import ${variant} from '@atlaskit/select';

				const App = () => {
					return <${identifier} validationState = 'default' />;
				};
			`,
			`
				import ${variant} from '@atlaskit/select';

				const App = () => {
					return <${identifier} />;
				};
			`,
			`should remove validationState when set to "default" for ${identifier}`,
		);

		defineInlineTest(
			{ ...transformer, parser: 'tsx' },
			{},
			`
				import ${variant} from '@atlaskit/select';

				const App = () => {
					return <${identifier} validationState = 'success' />;
				};
			`,
			`
				import ${variant} from '@atlaskit/select';

				const App = () => {
					return <${identifier} />;
				};
			`,
			`should remove validationState when set to "success" for ${identifier}`,
		);

		// TODO: Enable once we have cleaned up validationState
		// defineInlineTest(
		// 	{ ...transformer, parser: 'tsx' },
		// 	{},
		// 	`
		//       import Select from '@atlaskit/select';

		//       const App = () => {
		//         return (
		//           <${identifier}
		// 						validationState={value}
		// 					/>
		//         )
		//       }
		//     `,
		// 	`
		//       import Select from '@atlaskit/select';

		//       const App = () => {
		//         return (
		//           <${identifier}
		// 						validationState={!value}
		// 					/>
		//         );
		//       }
		//     `,
		// 	'should transform validationState to isInvalid and negate when an expression is provided"',
		// );

		defineInlineTest(
			{ ...transformer, parser: 'tsx' },
			{},
			`
				const App = () => {
					return (
						<${identifier}
							aria-errormessage={''}
							aria-live={''}
							ariaLiveMessages={''}
							captureMenuOnScroll={true}
							delimiter={''}
							isRTL={true}
							menuShouldBlockScroll={true}
							screenReaderStatus={''}
						/>
					);
				};
			`,
			`
				const App = () => {
					return (
						<${identifier}
							aria-errormessage={''}
							aria-live={''}
							ariaLiveMessages={''}
							captureMenuOnScroll={true}
							delimiter={''}
							isRTL={true}
							menuShouldBlockScroll={true}
							screenReaderStatus={''}
						/>
					);
				};
			`,
			'should not mutate JSX if import is missing',
		);

		defineInlineTest(
			{ ...transformer, parser: 'tsx' },
			{},
			`
				import ${identifier === 'Select' ? `Ak${identifier}` : `{${identifier} as Ak${identifier}}`} from '@atlaskit/select';

				const App = () => {
					return (
						<Ak${identifier}
							aria-errormessage={''}
							aria-live={''}
							ariaLiveMessages={''}
							captureMenuOnScroll={true}
							delimiter={''}
							isRTL={true}
							menuShouldBlockScroll={true}
							screenReaderStatus={''}
						/>
					);
				};
      		`,
			`
				import ${identifier === 'Select' ? `Ak${identifier}` : `{${identifier} as Ak${identifier}}`} from '@atlaskit/select';

				const App = () => {
					return (<Ak${identifier} />);
				};
      		`,
			`should handle named imports for ${identifier} `,
		);
	});
});
