import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('no-physical-properties', rule, {
	valid: [
		{ code: `const styles = css({ padding: '8px' })` },
		{ code: `const styles = css({ paddingInlineStart: '8px' })` },
		{ code: `const styles = css({ inset: '8px' })` },
		{ code: `const styles = css({ textAlign: 'start' })` },
		{ code: `const styles = cssMap({ danger: { padding: '8px' } })` },
		{ code: `const styles = cssMap({ danger: { paddingInlineStart: '8px' } })` },
		{ code: `const styles = cssMap({ danger: { inset: '8px' } })` },
		{ code: `const styles = cssMap({ danger: { textAlign: 'start' } })` },
	],
	invalid: [
		...['css', 'xcss'].flatMap((style) => [
			{
				code: `
        ${style}({
          paddingLeft: '8px'
        })
    `,
				output: `
        ${style}({
          paddingInlineStart: '8px'
        })
    `,
				errors: [
					{
						messageId: 'noPhysicalProperties',
					},
				],
			},
			{
				code: `
        ${style}({
          left: '8px'
        })
    `,
				output: `
        ${style}({
          insetInlineStart: '8px'
        })
    `,
				errors: [
					{
						messageId: 'noPhysicalProperties',
					},
				],
			},
		]),
		// cssMap tests
		{
			code: `
        cssMap({
          danger: {
            paddingLeft: '8px'
          }
        })
    `,
			output: `
        cssMap({
          danger: {
            paddingInlineStart: '8px'
          }
        })
    `,
			errors: [
				{
					messageId: 'noPhysicalProperties',
				},
			],
		},
		{
			code: `
        cssMap({
          danger: {
            left: '8px'
          }
        })
    `,
			output: `
        cssMap({
          danger: {
            insetInlineStart: '8px'
          }
        })
    `,
			errors: [
				{
					messageId: 'noPhysicalProperties',
				},
			],
		},
		{
			code: `
        cssMap({
          success: {
            marginTop: '8px'
          },
          danger: {
            paddingBottom: '4px'
          }
        })
    `,
			output: `
        cssMap({
          success: {
            marginBlockStart: '8px'
          },
          danger: {
            paddingBlockEnd: '4px'
          }
        })
    `,
			errors: [
				{
					messageId: 'noPhysicalProperties',
				},
				{
					messageId: 'noPhysicalProperties',
				},
			],
		},
	],
});
