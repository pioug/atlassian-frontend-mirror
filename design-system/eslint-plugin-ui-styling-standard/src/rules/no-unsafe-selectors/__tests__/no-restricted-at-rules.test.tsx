import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('no-restricted-at-rules', rule, {
	valid: [
		{
			name: '@media',
			code: `
        import { css } from '@compiled/react';

        css({
          '@media screen and (min-width: 900px)': {}
        });
      `,
		},
		{
			name: '@media in cssMap',
			code: `
        import { cssMap } from '@compiled/react';

        const myMap = cssMap({
          danger: {
            color: 'red',
            '@media (min-width: 500px)': {
              fontSize: '1.5em',
            },
            '@media (max-width: 800px)': {
              fontSize: '1.8em',
            },
          },
        });
      `,
		},
		{
			name: 'no space after rule name',
			code: `
        import { css } from '@compiled/react';

        css({
          '@supports(display: flex)': {}
        });
      `,
		},
		{
			name: '@supports',
			code: `
        import { css } from '@compiled/react';

        css({
          '@supports (display: flex)': {}
        });
      `,
		},
		{
			name: '@container',
			code: `
        import { css } from '@compiled/react';

        css({
          '@container (width > 400px)': {}
        });
      `,
		},
		{
			name: '@property',
			code: `
        import { css } from '@compiled/react';

        css({
          '@property --property-name': {
            syntax: '"<color>"',
            inherits: 'false',
            initialValue: '#c0ffee',
          }
        });
      `,
		},
	],
	invalid: [
		{
			name: '@color-profile',
			code: `
        import { css } from '@compiled/react';

        css({
          '@color-profile --swop5c': {}
        });
      `,
			errors: [
				{
					messageId: 'no-restricted-at-rules',
					data: { atRule: '@color-profile' },
				},
			],
		},
		{
			name: '@scope',
			code: `
        import { css } from '@compiled/react';

        css({
          '@scope (.article-body) to (figure)': {}
        });
      `,
			errors: [
				{
					messageId: 'no-restricted-at-rules',
					data: { atRule: '@scope' },
				},
			],
		},
		{
			name: '@scope in cssMap',
			code: `
        import { cssMap } from '@compiled/react';

        cssMap({
          base: {
            '@scope (.article-body) to (figure)': {}
          }
        });
      `,
			errors: [
				{
					messageId: 'no-restricted-at-rules',
					data: { atRule: '@scope' },
				},
			],
		},
	],
});
