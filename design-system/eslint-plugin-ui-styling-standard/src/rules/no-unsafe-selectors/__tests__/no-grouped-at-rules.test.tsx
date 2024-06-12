import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('no-grouped-at-rules', rule, {
	valid: [],
	invalid: [
		{
			name: '@media grouping',
			code: `
        import { cssMap } from '@compiled/react';

        cssMap({
          variant: {
            '@media': {
              '(min-width: 900px)': {},
              '(min-width: 1200px)': {},
            }
          }
        });
      `,
			errors: [{ messageId: 'no-grouped-at-rules' }],
		},
		{
			name: '@keyframes grouping',
			code: `
        import { cssMap } from '@compiled/react';

        cssMap({
          success: {
            '@keyframes': {
              'fadeIn': {}
            }
          }
        });
      `,
			errors: [{ messageId: 'no-grouped-at-rules' }, { messageId: 'no-keyframes-at-rules' }],
		},
		{
			name: '@scope grouping',
			code: `
        import { cssMap } from '@compiled/react';

        cssMap({
          success: {
            '@scope': {
              '(body) to (article)': {}
            }
          }
        });
      `,
			errors: [
				{ messageId: 'no-grouped-at-rules' },
				{ messageId: 'no-restricted-at-rules', data: { atRule: '@scope' } },
			],
		},
	],
});
