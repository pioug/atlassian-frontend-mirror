import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('no-nested-styles', rule, {
	valid: [
		`
    const focusRingStyles = css({
      '@media screen and (forced-colors: active), screen and (-ms-high-contrast: active)': {
        '&:focus-visible': {
          outline: '1px solid',
        },
      },
    });
    `,
		`
    const iconExplorerLinkStyles = css({
      '&,&:hover,&:active,&:focus': {
        lineHeight: 0,
      },
    });
    `,
		`
    import { media } from '@atlaskit/primitives/responsive';

    css({
      ':hover': { color: 'blue' },
      '&:hover': { color: 'blue' },
      '@media screen': {
        color: 'red',
      },
      [media.above.md]: {
        color: 'green',
      },
    })
    `,
		`
    css({
      color: 'red',
    })
  `,
		`
    import { media as somethingElse } from '@atlaskit/primitives/responsive';

    xcss({
      ':hover': { color: 'blue' },
      '&:hover': { color: 'blue' },
      '@media screen': {
        color: 'red',
      },
      [somethingElse.above.md]: {
        color: 'green',
      },
    })
    `,
		`
    xcss({
      color: 'red',
    })
  `,
		`
    css({
      ':hover': { color: 'blue' },
      '&:hover': { color: 'blue' },
      '@media screen and (forced-colors: active)': {
        color: 'red',
      },
    })
    `,
		`
    xcss({
      ':hover': { color: 'blue' },
      '&:hover': { color: 'blue' },
      '@media screen and (forced-colors: active)': {
        color: 'red',
      },
    })
    `,
	],
	invalid: ['css', 'xcss'].flatMap((style) => [
		{
			code: `
        ${style}({
          div: {
            color: 'red',
          }
        })
    `,
			errors: [
				{
					messageId: 'noNestedStyles',
				},
			],
		},
		{
			code: `
        ${style}({
          '& :hover': {
            color: 'red',
          }
        })
    `,
			errors: [
				{
					messageId: 'noNestedStyles',
				},
			],
		},
		{
			code: `
        ${style}({
          '[data-disabled]': {
            color: 'red',
          }
        })
    `,
			errors: [
				{
					messageId: 'noNestedStyles',
				},
			],
		},
		{
			code: `
        ${style}({
          '&[data-disabled]': {
            color: 'red',
          }
        })
    `,
			errors: [
				{
					messageId: 'noDirectNestedStyles',
				},
			],
		},
		{
			code: `
        ${style}({
          '&, &[data-disabled]': {
            color: 'red',
          }
        })
    `,
			errors: [
				{
					messageId: 'noDirectNestedStyles',
				},
			],
		},
		{
			code: `
        ${style}({
          '> div': {
            color: 'red',
          }
        })
    `,
			errors: [
				{
					messageId: 'noNestedStyles',
				},
			],
		},
		{
			code: `
        ${style}({
          '&': {
            color: 'red',
          }
        })
    `,
			errors: [
				{
					messageId: 'noNestedStyles',
				},
			],
		},
		// No import for media query
		{
			code: `
	  ${style}({
        [media.above.md]: {
          color: 'green',
        },
      })
      `,
			errors: [
				{
					messageId: 'noNestedStyles',
				},
			],
		},
		// Sus definition for media query
		{
			code: `
      const media = {
        above: {
          md: '> div'
        }
      }
	  ${style}({
        [media.above.md]: {
          color: 'green',
        },
      })
      `,
			errors: [
				{
					messageId: 'noNestedStyles',
				},
			],
		},
		{
			code: `
        ${style}({
          '@media (max-width: 664px)': {
            color: 'red',
          }
        })
      `,
			errors: [
				{
					messageId: 'noWidthQueries',
				},
			],
		},
		{
			code: `
        ${style}({
          '@media (min-width: 664px)': {
            width: '35%',
          }
        })
      `,
			errors: [
				{
					messageId: 'noWidthQueries',
				},
			],
		},
	]),
});
