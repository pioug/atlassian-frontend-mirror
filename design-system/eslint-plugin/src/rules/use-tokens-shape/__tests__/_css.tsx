import outdent from 'outdent';

import { type Tests } from '../../__tests__/utils/_types';

const error =
	'The use of shape tokens is preferred over the direct application of border radius and border width properties.';

const valid: string[] = [
	outdent`
    // ignores styles that don't contain fixable properties
    import { css } from '@emotion/react';

    const containerStyles = css({
      display: 'block',
      width: '8px',
    });
  `,
	outdent`
    // ignores styles that use template literal syntax
    import { css } from '@emotion/react';

    const containerStyles = css\`
      display: block;
      border-radius: 8px;
    \`;
  `,
	outdent`
    // ignores multi-values
    import { css } from '@emotion/react';

    const containerStyles = css({
      borderRadius: '8px 12px',
    });
  `,
	outdent`
    // ignores 0
    import { css } from '@compiled/react';

    const containerStyles = css({
      borderRadius: '0px',
        borderWidth: 0,
        borderRadius: '0rem',
        borderWidth: '0em',
    });
  `,
	outdent`
    // ignores already tokenised values
    import { css } from '@compiled/react';
    import { token } from '@atlaskit/tokens';

    const containerStyles = css({
      borderRadius: token('radius.small'),
      borderWidth: token('border.width.outline'),
    });
  `,
	outdent`
    // ignores CSS global values
    import { css } from '@compiled/react';
    import { token } from '@atlaskit/tokens';

    const containerStyles = css({
      borderRadius: 'unset',
      borderWidth: 'initial',
    });
  `,
	outdent`
    // ignores CSS vars
    import { css } from '@compiled/react';
    import { token } from '@atlaskit/tokens';

    const containerStyles = css({
      borderRadius: 'var(--border-radius)',
    });
  `,
	outdent`
    // ignores complicated values
    import { css } from '@compiled/react';

    const gridSize = '8px';
    const containerStyles = css({
      borderWidth: (width) => \`\${width}px\`,
      borderRadius: borderRadius,
      borderRadius: \`\${borderRadius}\`,
      borderWidth: "calc(-1 * 8px)",
    });
  `,
];

const invalid = [
	{
		code: outdent`
      // it suggests token for css call with tokenisable entry - radius
      import { css } from '@emotion/react';

      const paddingStyles = css({
        borderRadius: '3px',
      });
    `,
		output: outdent`
      // it suggests token for css call with tokenisable entry - radius
      import { token } from '@atlaskit/tokens';
      import { css } from '@emotion/react';

      const paddingStyles = css({
        borderRadius: token('radius.small'),
      });
    `,
		errors: [error],
	},

	{
		code: outdent`
      // it suggests token for css call with tokenisable entry - border width
      import { css } from '@emotion/react';

      const paddingStyles = css({
        borderWidth: '1px',
      });
    `,
		output: outdent`
      // it suggests token for css call with tokenisable entry - border width
      import { token } from '@atlaskit/tokens';
      import { css } from '@emotion/react';

      const paddingStyles = css({
        borderWidth: token('border.width'),
      });
    `,
		errors: [error],
	},

	{
		code: outdent`
      // raises a violation with no fixes for non-tokenisable values
      import { css } from '@emotion/react';
      const containerStyles = css({ borderRadius: '9px' });
    `,
		errors: [error],
	},

	{
		code: outdent`
      // reports on css array syntax
      import { css } from '@emotion/react';
      const borderStyles = css([{ borderRadius: '3px' }]);
    `,
		errors: [error],
		output: outdent`
      // reports on css array syntax
      import { token } from '@atlaskit/tokens';
      import { css } from '@emotion/react';
      const borderStyles = css([{ borderRadius: token('radius.small') }]);
    `,
	},

	{
		code: outdent`
      // it suggests token for css call with numbers
      import { css } from '@emotion/react';
      const containerStyles = css({ borderRadius: 6 });
    `,
		errors: [error],
		output: outdent`
      // it suggests token for css call with numbers
      import { token } from '@atlaskit/tokens';
      import { css } from '@emotion/react';
      const containerStyles = css({ borderRadius: token('radius.medium') });
    `,
	},

	{
		code: outdent`
      // handles nested styles - radius
      import { css } from '@emotion/react';
      const containerStyles = css({
        '* >': {
          borderRadius: '8px',
        }
      });
    `,
		errors: [error],

		output: outdent`
      // handles nested styles - radius
      import { token } from '@atlaskit/tokens';
      import { css } from '@emotion/react';
      const containerStyles = css({
        '* >': {
          borderRadius: token('radius.large'),
        }
      });
    `,
	},

	{
		code: outdent`
      // handles nested styles - border width
      import { css } from '@emotion/react';
      const containerStyles = css({
        '* >': {
          borderRightWidth: '1px',
        }
      });
    `,
		errors: [error],

		output: outdent`
      // handles nested styles - border width
      import { token } from '@atlaskit/tokens';
      import { css } from '@emotion/react';
      const containerStyles = css({
        '* >': {
          borderRightWidth: token('border.width'),
        }
      });
    `,
	},
];

export const tests: Tests = {
	valid,
	invalid,
};
