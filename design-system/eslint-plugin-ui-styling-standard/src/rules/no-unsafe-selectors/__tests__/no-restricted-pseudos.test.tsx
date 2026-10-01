import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('no-restricted-pseudos', rule, {
	valid: [
		{
			name: ':hover',
			code: `
        import { css } from '@compiled/react';

        css({
          '&:hover': {}
        });
      `,
		},
		{
			name: ':active',
			code: `
        import { css } from '@compiled/react';

        css({
          '&:active': {}
        });
      `,
		},
		{
			name: '&::-webkit-details-marker',
			code: `
		import { css } from '@compiled/react';

		css({
		  '&::-webkit-details-marker': {}
		});
	  `,
		},
		{
			name: 'range vendor pseudo-elements',
			code: `
		import { css } from '@compiled/react';

		css({
		  '&::-webkit-slider-thumb': {},
		  '&:disabled::-moz-range-thumb': {},
		  '&::-moz-focus-inner': {},
		});
	  `,
		},
		{
			name: '&:focus:not(:focus-visible) chained pseudo',
			code: `
		import { css } from '@compiled/react';

		css({
		  '&:focus:not(:focus-visible)': {}
		});
	  `,
		},
	],
	invalid: [
		{
			name: 'vendor pseudo-element outside the allowlist',
			code: `
        import { css } from '@compiled/react';

        css({
          '&::-webkit-scrollbar': {},
        });
      `,
			errors: [
				{
					messageId: 'no-restricted-pseudos',
					line: 5,
					column: 13,
					endColumn: 32,
					data: { pseudo: '::-webkit-scrollbar' },
				},
			],
		},
		{
			name: ':not() outside an allowlisted chain',
			code: `
        import { css } from '@compiled/react';

        css({
          '&:hover:not(:focus-visible)': {},
        });
      `,
			errors: [
				{
					messageId: 'no-restricted-pseudos',
					line: 5,
					column: 19,
					endColumn: 23,
					data: { pseudo: ':not' },
				},
			],
		},
		{
			name: 'partial chain :not(:focus-visible) without :focus',
			code: `
        import { css } from '@compiled/react';

        css({
          '&:not(:focus-visible)': {},
        });
      `,
			errors: [
				{
					messageId: 'no-restricted-pseudos',
					line: 5,
					column: 13,
					endColumn: 17,
					data: { pseudo: ':not' },
				},
			],
		},
		{
			name: ':has()',
			code: `
        import { css } from '@compiled/react';

        css({
          '&:has(div)': {},
        });
      `,
			errors: [
				{
					messageId: 'no-restricted-pseudos',
					line: 5,
					column: 13,
					endColumn: 17,
					data: { pseudo: ':has' },
				},
			],
		},
		{
			name: ':first-child',
			code: `
        import { css } from '@compiled/react';

        css({
          '&:first-child': {},
        });
      `,
			errors: [
				{
					messageId: 'no-restricted-pseudos',
					line: 5,
					column: 13,
					endColumn: 25,
					data: {
						pseudo: ':first-child',
					},
				},
			],
		},
		{
			name: ':first-of-type',
			code: `
        import { css } from '@compiled/react';

        css({
          '&:first-of-type': {},
        });
      `,
			errors: [
				{
					messageId: 'no-restricted-pseudos',
					line: 5,
					column: 13,
					endColumn: 27,
					data: {
						pseudo: ':first-of-type',
					},
				},
			],
		},
		{
			name: ':nth-child(2)',
			code: `
        import { css } from '@compiled/react';

        css({
          '&:nth-child(2)': {},
        });
      `,
			errors: [
				{
					messageId: 'no-restricted-pseudos',
					line: 5,
					column: 13,
					endColumn: 23,
					data: {
						pseudo: ':nth-child',
					},
				},
			],
		},
		{
			name: 'compound selector with child selectors',
			code: `
        import { css } from '@compiled/react';

        css({
          '&:hover:first-child:active': {},
        });
      `,
			errors: [
				{
					messageId: 'no-restricted-pseudos',
					line: 5,
					column: 19,
					endColumn: 31,
					data: {
						pseudo: ':first-child',
					},
				},
			],
		},
	],
});
