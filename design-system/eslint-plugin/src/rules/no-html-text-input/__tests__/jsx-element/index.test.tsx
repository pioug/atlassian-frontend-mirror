// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import { linesOnly } from '../../../__tests__/utils/_strings';
import rule from '../../index';

ruleTester.run('no-html-text-input', rule, {
	valid: [
		`
			// JSX Element > ignores React components
			import { css } from '@emotion/react';
			const paddingStyles = css({ padding: '8px' });
			<A href="/" css={paddingStyles}></A>
		`,
		`
			// JSX Element > doesn't report for textfield
			import Textfield from '@atlaskit/textfield';
			<Textfield />
		`,
		`
			// JSX Element > doesn't report for another input that isn't a text input
			<input type="number" />
		`,
	],
	invalid: [
		{
			code: linesOnly`
				// JSX Element > reports for basic input
				<input />
			`,
			errors: [
				{
					messageId: 'noHtmlTextInput',
					suggestions: [
						{
							desc: 'Replace with Textfield component from @atlaskit/textfield',
							output: linesOnly`
								// JSX Element > reports for basic input
								import Textfield from '@atlaskit/textfield';
								<Textfield />
							`,
						},
					],
				},
			],
		},
		{
			code: linesOnly`
				// JSX Element > reports for a self-closing text input
				<input type="text" />
			`,
			errors: [
				{
					messageId: 'noHtmlTextInput',
					suggestions: [
						{
							desc: 'Replace with Textfield component from @atlaskit/textfield',
							output: linesOnly`
								// JSX Element > reports for a self-closing text input
								import Textfield from '@atlaskit/textfield';
								<Textfield />
							`,
						},
					],
				},
			],
		},
		{
			code: linesOnly`
				// JSX Element > reports for a self-closing text input with more attributes
				<input type="text" id="foo" name="bar" />
			`,
			errors: [
				{
					messageId: 'noHtmlTextInput',
					suggestions: [
						{
							desc: 'Replace with Textfield component from @atlaskit/textfield',
							output: linesOnly`
								// JSX Element > reports for a self-closing text input with more attributes
								import Textfield from '@atlaskit/textfield';
								<Textfield id="foo" name="bar" />
							`,
						},
					],
				},
			],
		},
		{
			code: linesOnly`
				// Existing Textfield import with same name from another package
				import Textfield from 'another-package';
				<input type="text" />
			`,
			errors: [
				{
					messageId: 'noHtmlTextInput',
					suggestions: [
						{
							desc: 'Replace with Textfield component from @atlaskit/textfield',
							output: linesOnly`
								// Existing Textfield import with same name from another package
								import Textfield1 from '@atlaskit/textfield';
								import Textfield from 'another-package';
								<Textfield1 />
							`,
						},
					],
				},
			],
		},
	],
});
