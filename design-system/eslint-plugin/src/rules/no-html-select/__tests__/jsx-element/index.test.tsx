// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import { linesOnly } from '../../../__tests__/utils/_strings';
import rule from '../../index';

ruleTester.run('no-html-select', rule, {
	valid: [
		`
			// JSX Element > ignores React components
			import { css } from '@emotion/react';
			const paddingStyles = css({ padding: '8px' });
			<A href="/" css={paddingStyles}></A>
		`,
		`
			// JSX Element > ignores Select
			<Select href="/">Hello, World!</Select>
		`,
	],
	invalid: [
		{
			code: linesOnly`
				// JSX Element > reports for a select element and shows correct message
				<select />
			`,
			errors: [
				{
					message:
						'This <select> should be replaced with the select component from the Atlassian Design System. ADS select components have event tracking, ensure accessible implementations, and provide access to ADS styling features like design tokens.',
				},
			],
		},
		{
			code: linesOnly`
				// JSX Element > reports for a select with options
				<select>
					<option value="test">Test</option>
				</select>
			`,
			errors: [{ messageId: 'noHtmlSelect' }],
		},
	],
});
