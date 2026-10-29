// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import { linesOnly } from '../../../__tests__/utils/_strings';
import rule from '../../index';

ruleTester.run('no-html-textarea', rule, {
	valid: [
		`
			// JSX Element > ignores React components
			import { css } from '@emotion/react';
			const paddingStyles = css({ padding: '8px' });
			<A href="/" css={paddingStyles}></A>
		`,
		`
			// JSX Element > ignores Textarea
			<Textarea href="/">Hello, World!</Textarea>
		`,
	],
	invalid: [
		{
			code: linesOnly`
				// JSX Element > reports for an textarea element and shows correct message
				<textarea>Test</textarea>
			`,
			errors: [
				{
					message:
						'Replace <textarea> with Textarea from @atlaskit/textarea/text-area. Preserve the field name, value, change handler and label association; use the supported sizing props for its intended height.',
					suggestions: [
						{
							desc: 'Replace with Textarea component from @atlaskit/textarea',
							output: linesOnly`
								// JSX Element > reports for an textarea element and shows correct message
								import Textarea from '@atlaskit/textarea/text-area';
								<Textarea>Test</Textarea>
							`,
						},
					],
				},
			],
		},
		{
			code: linesOnly`
				// JSX Element > existing Textarea subpath import with different name
				import CustomTextarea from '@atlaskit/textarea/text-area';
				<textarea>Test</textarea>
			`,
			errors: [
				{
					messageId: 'noHtmlTextarea',
					suggestions: [
						{
							desc: 'Replace with Textarea component from @atlaskit/textarea',
							output: linesOnly`
								// JSX Element > existing Textarea subpath import with different name
								import CustomTextarea from '@atlaskit/textarea/text-area';
								<CustomTextarea>Test</CustomTextarea>
							`,
						},
					],
				},
			],
		},
		{
			code: linesOnly`
				// JSX Element > existing Textarea import with same name
				import Textarea from '@atlaskit/textarea';
				<textarea>Test</textarea>
			`,
			errors: [
				{
					messageId: 'noHtmlTextarea',
					suggestions: [
						{
							desc: 'Replace with Textarea component from @atlaskit/textarea',
							output: linesOnly`
								// JSX Element > existing Textarea import with same name
								import Textarea from '@atlaskit/textarea';
								<Textarea>Test</Textarea>
							`,
						},
					],
				},
			],
		},
		{
			code: linesOnly`
				// JSX Element > existing Textarea import with different name
				import CustomTextarea from '@atlaskit/textarea';
				<textarea>Test</textarea>
			`,
			errors: [
				{
					messageId: 'noHtmlTextarea',
					suggestions: [
						{
							desc: 'Replace with Textarea component from @atlaskit/textarea',
							output: linesOnly`
								// JSX Element > existing Textarea import with different name
								import CustomTextarea from '@atlaskit/textarea';
								<CustomTextarea>Test</CustomTextarea>
							`,
						},
					],
				},
			],
		},
		{
			code: linesOnly`
				// Existing Textarea import with same name from another package
				import Textarea from 'another-package';
				<textarea>Test</textarea>
			`,
			errors: [
				{
					messageId: 'noHtmlTextarea',
					suggestions: [
						{
							desc: 'Replace with Textarea component from @atlaskit/textarea',
							output: linesOnly`
						// Existing Textarea import with same name from another package
						import Textarea1 from '@atlaskit/textarea/text-area';
						import Textarea from 'another-package';
						<Textarea1>Test</Textarea1>
					`,
						},
					],
				},
			],
		},
		{
			code: linesOnly`
				// Existing Textarea, Textarea1, and Textarea2 imports
				import Textarea from 'another-package';
				import Textarea1 from 'yet-another-package';
				import Textarea2 from '@some/package';
				<textarea>Test</textarea>
			`,
			errors: [
				{
					messageId: 'noHtmlTextarea',
					suggestions: [
						{
							desc: 'Replace with Textarea component from @atlaskit/textarea',
							output: linesOnly`
						// Existing Textarea, Textarea1, and Textarea2 imports
						import Textarea3 from '@atlaskit/textarea/text-area';
						import Textarea from 'another-package';
						import Textarea1 from 'yet-another-package';
						import Textarea2 from '@some/package';
						<Textarea3>Test</Textarea3>
					`,
						},
					],
				},
			],
		},
	],
});
