import outdent from 'outdent';
import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('no-unsafe-selectors', rule, {
	valid: [
		{
			name: 'css API valid usage',
			code: `
        import { css } from '@compiled/react';

        css({
          '&:hover': {},
          '&:focus, &:active': {},
        });
      `,
		},
		{
			name: 'styled API valid usage',
			code: `
        import { styled } from '@compiled/react';

        styled.div({
          '&:hover': {},
          '&:focus, &:active': {},
        });
      `,
		},
		{
			name: 'keyframes API valid usage',
			code: `
        import { keyframes } from '@compiled/react';

        keyframes({
          '0%': {
            '&:hover': {},
            '&:focus, &:active': {},
          },
          '100%': {
            '&:hover': {},
            '&:focus, &:active': {},
          },
        });
      `,
		},
		{
			name: 'xcss API valid usage',
			code: `
        import { xcss } from '@atlaskit/primitives';

        xcss({
          '&:hover': {},
        });
      `,
		},
		{
			name: 'cssMap API valid usage',
			code: `
        import { cssMap } from '@atlaskit/primitives';

        cssMap({
          ':name:': {
            '&:hover': {},
          }
        });
      `,
		},
	],
	invalid: [
		{
			name: 'css API invalid usage',
			code: outdent`
        import { css } from '@compiled/react';

        css({
          ':hover': {},
          '&:after': {},
        });
      `,
			output: outdent`
        import { css } from '@compiled/react';

        css({
          '&:hover': {},
          '&::after': {},
        });
      `,
			errors: [
				{
					messageId: 'no-ambiguous-pseudos',
					line: 4,
					column: 4,
					endColumn: 10,
				},
				{
					messageId: 'no-legacy-pseudo-element-syntax',
					line: 5,
					column: 5,
					endColumn: 11,
				},
			],
		},
		{
			name: 'styled API invalid usage',
			code: `
        import { styled } from '@compiled/react';

        styled.div({
          '@keyframes fadeIn': {},
          '@media screen and (width < 900px)': {},
          '@supports (display: flex)': {},
          '@scope (article) to (figure)': {},
        });
      `,
			errors: [
				{
					messageId: 'no-keyframes-at-rules',
					line: 5,
					column: 11,
					endColumn: 30,
				},
				{
					messageId: 'no-restricted-at-rules',
					line: 8,
					column: 11,
					endColumn: 41,
				},
			],
		},
		{
			name: 'keyframes API invalid usage',
			code: outdent`
        import { keyframes } from '@emotion/react';

        keyframes({
          '0%': {
            ':hover': {},
          },
          '100%': {
            '&:abcd': {}
          },
          ':hover': {}, // Not valid but shouldn't be picked up by this rule
        });
      `,
			output: outdent`
        import { keyframes } from '@emotion/react';

        keyframes({
          '0%': {
            '&:hover': {},
          },
          '100%': {
            '&:abcd': {}
          },
          ':hover': {}, // Not valid but shouldn't be picked up by this rule
        });
      `,
			errors: [
				{
					messageId: 'no-ambiguous-pseudos',
					line: 5,
					column: 6,
					endColumn: 12,
				},
				{
					messageId: 'no-restricted-pseudos',
					line: 8,
					column: 7,
					endColumn: 12,
				},
			],
		},
		{
			name: 'xcss API invalid usage',
			code: `
        import { xcss } from '@atlaskit/primitives';

        xcss({
          '&&&&&&': {},
        });
      `,
			errors: [
				{
					messageId: 'no-increased-specificity',
					line: 5,
					column: 12,
					endColumn: 18,
				},
			],
		},
		{
			name: 'cssMap API invalid usage',
			code: outdent`
        import { cssMap } from '@atlaskit/primitives';

        cssMap({
          ':name:': {
            ':hover': {},
          },
          ':hover': {},
          '[&]': {
            '&:first-child': {}
          },
        });
      `,
			output: outdent`
        import { cssMap } from '@atlaskit/primitives';

        cssMap({
          ':name:': {
            '&:hover': {},
          },
          ':hover': {},
          '[&]': {
            '&:first-child': {}
          },
        });
      `,
			errors: [
				{
					messageId: 'no-ambiguous-pseudos',
					line: 5,
					column: 6,
					endColumn: 12,
				},
				{
					messageId: 'no-restricted-pseudos',
					data: {
						pseudo: ':first-child',
					},
					line: 9,
					column: 7,
					endColumn: 19,
				},
			],
		},
	],
});
