// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import { linesOnly } from '../../../__tests__/utils/_strings';
import rule from '../../index';

ruleTester.run('no-html-anchor', rule, {
	valid: [
		`
			// JSX Element > ignores React components
			import { css } from '@emotion/react';
			const paddingStyles = css({ padding: '8px' });
			<A href="/" css={paddingStyles}></A>
		`,
		`
			// JSX Element > ignores Anchor
			<Anchor href="/">Hello, World!</Anchor>
		`,
	],
	invalid: [
		{
			code: linesOnly`
				// JSX Element > reports for an anchor element and shows correct message
				<img src="foo.jpg" />
			`,
			errors: [
				{
					message:
						'This <img> should be replaced with the image component from the Atlassian Design System. ADS images ensure accessible implementations, and provide access to ADS styling features like design tokens.',
					suggestions: [
						{
							desc: 'Replace with Image component from @atlaskit/image',
							output: linesOnly`
								// JSX Element > reports for an anchor element and shows correct message
								import Image from '@atlaskit/image';
								<Image src="foo.jpg" />
							`,
						},
					],
				},
			],
		},
		{
			code: linesOnly`
				// JSX Element > reports for an image with src and alt
				<img src="foo.jpg" alt="Foo" />
			`,
			errors: [
				{
					messageId: 'noHtmlImage',
					suggestions: [
						{
							desc: 'Replace with Image component from @atlaskit/image',
							output: linesOnly`
								// JSX Element > reports for an image with src and alt
								import Image from '@atlaskit/image';
								<Image src="foo.jpg" alt="Foo" />
							`,
						},
					],
				},
			],
		},
		{
			code: linesOnly`
				// JSX Element > existing Image import with different name
				import CustomImage from '@atlaskit/image';
				<img src="foo.jpg" alt="Foo" />
			`,
			errors: [
				{
					messageId: 'noHtmlImage',
					suggestions: [
						{
							desc: 'Replace with Image component from @atlaskit/image',
							output: linesOnly`
								// JSX Element > existing Image import with different name
								import CustomImage from '@atlaskit/image';
								<CustomImage src="foo.jpg" alt="Foo" />
							`,
						},
					],
				},
			],
		},
		{
			code: linesOnly`
				// Existing Image import with same name from another package
				import Image from 'another-package';
				<img src="foo.jpg" alt="Foo" />
			`,
			errors: [
				{
					messageId: 'noHtmlImage',
					suggestions: [
						{
							desc: 'Replace with Image component from @atlaskit/image',
							output: linesOnly`
						// Existing Image import with same name from another package
						import Image1 from '@atlaskit/image';
						import Image from 'another-package';
						<Image1 src="foo.jpg" alt="Foo" />
					`,
						},
					],
				},
			],
		},
		{
			code: linesOnly`
				// Existing Image, Image1, and Image2 imports
				import Image from 'another-package';
				import Image1 from 'yet-another-package';
				import Image2 from '@some/package';
				<img src="foo.jpg" alt="Foo" />
			`,
			errors: [
				{
					messageId: 'noHtmlImage',
					suggestions: [
						{
							desc: 'Replace with Image component from @atlaskit/image',
							output: linesOnly`
						// Existing Image, Image1, and Image2 imports
						import Image3 from '@atlaskit/image';
						import Image from 'another-package';
						import Image1 from 'yet-another-package';
						import Image2 from '@some/package';
						<Image3 src="foo.jpg" alt="Foo" />
					`,
						},
					],
				},
			],
		},
		{
			code: linesOnly`
				// JSX Element > reports for a self-closing div with role="img"
				<div role="img" src="foo.jpg" alt="" />
			`,
			errors: [
				{
					messageId: 'noHtmlImage',
					suggestions: [
						{
							output: linesOnly`
								// JSX Element > reports for a self-closing div with role="img"
								import Image from '@atlaskit/image';
								<Image src="foo.jpg" alt="" />
							`,
							desc: 'Replace with Image component from @atlaskit/image',
						},
					],
				},
			],
		},
		{
			code: linesOnly`
				// JSX Element > reports for a self-closing span with role="img"
				<span role="img" src="foo.jpg" alt="" />
			`,
			errors: [
				{
					messageId: 'noHtmlImage',
					suggestions: [
						{
							output: linesOnly`
								// JSX Element > reports for a self-closing span with role="img"
								import Image from '@atlaskit/image';
								<Image src="foo.jpg" alt="" />
							`,
							desc: 'Replace with Image component from @atlaskit/image',
						},
					],
				},
			],
		},
	],
});
