// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import { linesOnly } from '../../../__tests__/utils/_strings';
import rule from '../../index';

ruleTester.run('no-html-code', rule, {
	valid: [
		`
			// JSX Element > ignores React components
			import { css } from '@emotion/react';
			const paddingStyles = css({ padding: '8px' });
			<A href="/" css={paddingStyles}></A>
		`,
		`
			// JSX Element > ignores Code
			<Code href="/">Hello, World!</Code>
		`,
	],
	invalid: [
		{
			code: linesOnly`
				// JSX Element > reports for an code element and shows correct message
				<code>Test</code>
			`,
			errors: [
				{
					message:
						'This <code> should be replaced with the code component from the Atlassian Design System. The ADS code component ensures accessible implementations and consistent ADS styling.',
					suggestions: [
						{
							desc: 'Replace with Code component from @atlaskit/code',
							output: linesOnly`
								// JSX Element > reports for an code element and shows correct message
								import { Code } from '@atlaskit/code';
								<Code>Test</Code>
							`,
						},
					],
				},
			],
		},
		{
			code: linesOnly`
				// JSX Element > existing Code import with different name
				import { Code } from '@atlaskit/code';
				<code>Test</code>
			`,
			errors: [
				{
					messageId: 'noHtmlCode',
					suggestions: [
						{
							desc: 'Replace with Code component from @atlaskit/code',
							output: linesOnly`
								// JSX Element > existing Code import with different name
								import { Code } from '@atlaskit/code';
								<Code>Test</Code>
							`,
						},
					],
				},
			],
		},
		{
			code: linesOnly`
				// JSX Element > existing Code import with different name
				import { Code as CustomCode } from '@atlaskit/code';
				<code>Test</code>
			`,
			errors: [
				{
					messageId: 'noHtmlCode',
					suggestions: [
						{
							desc: 'Replace with Code component from @atlaskit/code',
							output: linesOnly`
								// JSX Element > existing Code import with different name
								import { Code as CustomCode } from '@atlaskit/code';
								<CustomCode>Test</CustomCode>
							`,
						},
					],
				},
			],
		},
		{
			code: linesOnly`
				// Existing Code import with same name from another package
				import Code from 'another-package';
				<code>Test</code>
			`,
			errors: [
				{
					messageId: 'noHtmlCode',
					suggestions: [
						{
							desc: 'Replace with Code component from @atlaskit/code',
							output: linesOnly`
						// Existing Code import with same name from another package
						import { Code1 } from '@atlaskit/code';
						import Code from 'another-package';
						<Code1>Test</Code1>
					`,
						},
					],
				},
			],
		},
		{
			code: linesOnly`
				// Existing Code, Code1, and Code2 imports
				import Code from 'another-package';
				import Code1 from 'yet-another-package';
				import Code2 from '@some/package';
				<code>Test</code>
			`,
			errors: [
				{
					messageId: 'noHtmlCode',
					suggestions: [
						{
							desc: 'Replace with Code component from @atlaskit/code',
							output: linesOnly`
						// Existing Code, Code1, and Code2 imports
						import { Code3 } from '@atlaskit/code';
						import Code from 'another-package';
						import Code1 from 'yet-another-package';
						import Code2 from '@some/package';
						<Code3>Test</Code3>
					`,
						},
					],
				},
			],
		},
	],
});
