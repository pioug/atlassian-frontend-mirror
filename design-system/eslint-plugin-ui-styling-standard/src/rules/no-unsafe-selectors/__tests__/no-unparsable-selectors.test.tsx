import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('no-unparsable-selectors', rule, {
	valid: [],
	invalid: [
		{
			name: 'unparsable selectors',
			code: `
        import { css } from '@emotion/react';

        css({
          '[&]': {},
          ':name:': {},
        });
      `,
			errors: [
				{
					messageId: 'no-unparsable-selectors',
					data: { selectorText: '[&]' },
					line: 5,
					column: 11,
					endColumn: 16,
				},
				{
					messageId: 'no-unparsable-selectors',
					data: { selectorText: ':name:' },
					line: 6,
					column: 11,
					endColumn: 19,
				},
			],
		},
	],
});
