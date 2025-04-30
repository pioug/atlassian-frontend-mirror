// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import { linesOnly } from '../../../__tests__/utils/_strings';
import rule from '../../index';

ruleTester.run('no-html-radio', rule, {
	valid: [
		`
			// JSX Element > ignores React components
			import { css } from '@emotion/react';
			const paddingStyles = css({ padding: '8px' });
			<A href="/" css={paddingStyles}></A>
		`,
		`
			// JSX Element > doesn't report for standard input
			<input />
		`,
		`
			// JSX Element > doesn't report for another input that isn't a radio
			<input type="number" />
		`,
	],
	invalid: [
		{
			code: linesOnly`
				// JSX Element > reports for a self-closing radio
				<input type="radio" />
			`,
			errors: [
				{
					messageId: 'noHtmlRadio',
				},
			],
		},
	],
});
