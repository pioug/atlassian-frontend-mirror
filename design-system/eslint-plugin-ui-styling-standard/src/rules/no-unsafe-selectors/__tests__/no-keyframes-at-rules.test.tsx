import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('no-keyframes-at-rules', rule, {
	valid: [],
	invalid: [
		{
			name: '@keyframes',
			code: `
        import { css } from '@compiled/react';

        css({
          '@keyframes fadeIn': {}
        });
      `,
			errors: [
				{
					messageId: 'no-keyframes-at-rules',
				},
			],
		},
		{
			name: '@keyframes in cssMap',
			code: `
        import { cssMap } from '@compiled/react';

        cssMap({
          success: {
            '@keyframes fadeIn': {}
          }
        });
      `,
			errors: [
				{
					messageId: 'no-keyframes-at-rules',
				},
			],
		},
	],
});
