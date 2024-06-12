import { typescriptEslintTester } from '../../__tests__/utils/_tester';
import rule from '../index';

typescriptEslintTester.run(
	'no-unsafe-values',
	// @ts-expect-error
	rule,
	{
		valid: [
			{
				name: 'literal values',
				code: `
          import { css } from '@compiled/react';

          const styles = css({
            height: '5px',
            opacity: 1
          });
        `,
			},
			{
				name: 'variables referencing literal values',
				code: `
          import { css } from '@compiled/react';

          const height = '5px';
          const opacity = 1;
          const styles = css({
            height,
            opacity
          });
        `,
			},
			{
				name: 'template strings interpolating safe values',
				code: `
          import { css } from '@compiled/react';

          const height = 5;
          const paddingBlock = 10;
          const paddingInline = 10;

          const styles = css({
            height: \`\${height}px\`,
            padding: \`\${paddingBlock}px \${paddingInline}px\`
          });
        `,
			},
			{
				name: 'base component',
				code: `
          import { styled } from '@compiled/react';
          import { BaseComponent } from './base-component';

          styled(BaseComponent)({});
        `,
			},
			{
				name: 'binary operations are allowed',
				code: `
          import { css } from '@compiled/react';

          const ITEM_HEIGHT = 40;

          const styles = css({
            height: ITEM_HEIGHT,
            width: ITEM_HEIGHT * 2,
            marginBottom: ITEM_HEIGHT + 123,
          });
        `,
			},
		],
		invalid: [],
	},
);
