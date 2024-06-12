import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('no-increased-specificity', rule, {
	valid: [
		{
			name: 'multiple & in selector list',
			code: `
        import { css } from '@compiled/react';

        css({
          '&:hover, &:active': {},
        });
      `,
		},
	],
	invalid: [
		{
			name: 'single &',
			code: `
        import { css } from '@compiled/react';

        css({
          '&': {},
        });
      `,
			errors: [
				{
					messageId: 'no-increased-specificity',
					line: 5,
					column: 12,
					endColumn: 13,
				},
			],
		},
		{
			name: 'double &',
			code: `
        import { css } from '@compiled/react';

        css({
          '&&': {},
        });
      `,
			errors: [
				{
					messageId: 'no-increased-specificity',
					line: 5,
					column: 12,
					endColumn: 14,
				},
			],
		},
		{
			name: 'longer chain of &',
			code: `
        import { css } from '@compiled/react';

        css({
          '&&&&&&&&&': {},
        });
      `,
			errors: [
				{
					messageId: 'no-increased-specificity',
					line: 5,
					column: 12,
					endColumn: 21,
				},
			],
		},
	],
});
