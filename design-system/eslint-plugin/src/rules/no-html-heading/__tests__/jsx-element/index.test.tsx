// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import { linesOnly } from '../../../__tests__/utils/_strings';
import rule from '../../index';

ruleTester.run('no-html-heading', rule, {
	valid: [
		`
			// JSX Element > ignores React components
			import { css } from '@emotion/react';
			const paddingStyles = css({ padding: '8px' });
			<A href="/" css={paddingStyles}></A>
		`,
		`
			// JSX Element > ignores Heading
			<Heading href="/">Hello, World!</Heading>
		`,
	],
	invalid: [
		{
			code: linesOnly`
				// JSX Element > reports for a heading and shows correct message
				<h1>Hello, World!</h1>
			`,
			errors: [
				{
					message:
						'This <h1> should be replaced with a heading component from the Atlassian Design System. ADS headings include ensure accessible implementations and provide access to ADS styling features like design tokens.',
					suggestions: [
						{
							desc: 'Replace with Heading component from @atlaskit/heading',
							output: linesOnly`
								// JSX Element > reports for a heading and shows correct message
								import Heading from '@atlaskit/heading';
								<Heading as="h1">Hello, World!</Heading>
							`,
						},
					],
				},
			],
		},
		{
			code: linesOnly`
				// JSX Element > reports for a self-closing heading
				<h2 />
			`,
			errors: [
				{
					messageId: 'noHtmlHeading',
					suggestions: [
						{
							desc: 'Replace with Heading component from @atlaskit/heading',
							output: linesOnly`
								// JSX Element > reports for a self-closing heading
								import Heading from '@atlaskit/heading';
								<Heading as="h2" />
							`,
						},
					],
				},
			],
		},
		{
			code: linesOnly`
				// JSX Element > existing Heading import with different name
				import CustomHeading from '@atlaskit/heading';
				<h3>Hello, World!</h3>
			`,
			errors: [
				{
					messageId: 'noHtmlHeading',
					suggestions: [
						{
							desc: 'Replace with Heading component from @atlaskit/heading',
							output: linesOnly`
								// JSX Element > existing Heading import with different name
								import CustomHeading from '@atlaskit/heading';
								<CustomHeading as="h3">Hello, World!</CustomHeading>
							`,
						},
					],
				},
			],
		},
		{
			code: linesOnly`
				// Existing Heading import with same name from another package
				import Heading from 'another-package';
				<h4>Hello, World!</h4>
			`,
			errors: [
				{
					messageId: 'noHtmlHeading',
					suggestions: [
						{
							desc: 'Replace with Heading component from @atlaskit/heading',
							output: linesOnly`
						// Existing Heading import with same name from another package
						import Heading1 from '@atlaskit/heading';
						import Heading from 'another-package';
						<Heading1 as="h4">Hello, World!</Heading1>
					`,
						},
					],
				},
			],
		},
		{
			code: linesOnly`
				// Existing Heading, Heading1, and Heading2 imports
				import Heading from 'another-package';
				import Heading1 from 'yet-another-package';
				import Heading2 from '@some/package';
				<h5>Hello, World!</h5>
			`,
			errors: [
				{
					messageId: 'noHtmlHeading',
					suggestions: [
						{
							desc: 'Replace with Heading component from @atlaskit/heading',
							output: linesOnly`
						// Existing Heading, Heading1, and Heading2 imports
						import Heading3 from '@atlaskit/heading';
						import Heading from 'another-package';
						import Heading1 from 'yet-another-package';
						import Heading2 from '@some/package';
						<Heading3 as="h5">Hello, World!</Heading3>
					`,
						},
					],
				},
			],
		},
		{
			code: linesOnly`
				// JSX Element > reports for a self-closing div with role="heading" and no level
				<div role="heading" />
			`,
			errors: [
				{
					messageId: 'noHtmlHeading',
					suggestions: [
						{
							output: linesOnly`
								// JSX Element > reports for a self-closing div with role="heading" and no level
								import Heading from '@atlaskit/heading';
								<Heading />
							`,
							desc: 'Replace with Heading component from @atlaskit/heading',
						},
					],
				},
			],
		},
		{
			code: linesOnly`
				// JSX Element > reports for a self-closing div with role="heading" and a level
				<div role="heading" aria-level="2" />
			`,
			errors: [
				{
					messageId: 'noHtmlHeading',
					suggestions: [
						{
							output: linesOnly`
								// JSX Element > reports for a self-closing div with role="heading" and a level
								import Heading from '@atlaskit/heading';
								<Heading as="h2" />
							`,
							desc: 'Replace with Heading component from @atlaskit/heading',
						},
					],
				},
			],
		},
		{
			code: linesOnly`
				// JSX Element > reports for a div with role="heading" and level
				<div role="heading" aria-level="6">Hello, World!</div>
			`,
			errors: [
				{
					messageId: 'noHtmlHeading',
					suggestions: [
						{
							output: linesOnly`
								// JSX Element > reports for a div with role="heading" and level
								import Heading from '@atlaskit/heading';
								<Heading as="h6">Hello, World!</Heading>
							`,
							desc: 'Replace with Heading component from @atlaskit/heading',
						},
					],
				},
			],
		},
		{
			code: linesOnly`
				// JSX Element > reports for a div with role="heading" and level as number
				<div role="heading" aria-level={6}>Hello, World!</div>
			`,
			errors: [
				{
					messageId: 'noHtmlHeading',
					suggestions: [
						{
							output: linesOnly`
								// JSX Element > reports for a div with role="heading" and level as number
								import Heading from '@atlaskit/heading';
								<Heading as="h6">Hello, World!</Heading>
							`,
							desc: 'Replace with Heading component from @atlaskit/heading',
						},
					],
				},
			],
		},
		{
			code: linesOnly`
				// JSX Element > reports for a span with role="heading" and a level
				<span role="heading" aria-level="1">Hello, World!</span>
			`,
			errors: [
				{
					messageId: 'noHtmlHeading',
					suggestions: [
						{
							output: linesOnly`
								// JSX Element > reports for a span with role="heading" and a level
								import Heading from '@atlaskit/heading';
								<Heading as="h1">Hello, World!</Heading>
							`,
							desc: 'Replace with Heading component from @atlaskit/heading',
						},
					],
				},
			],
		},
	],
});
