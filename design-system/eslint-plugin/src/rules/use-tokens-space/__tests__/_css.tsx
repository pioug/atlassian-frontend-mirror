import outdent from 'outdent';

import { Tests } from '../../__tests__/utils/_types';

const error =
  'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.';

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
      width: 8px;
    \`;
  `,
  outdent`
    // ignores multi-values
    import { css } from '@emotion/react';

    const containerStyles = css({ 
      padding: '8px 12px',
    });
  `,
  outdent`
    // ignores 0 (to match ensure-design-token-usage)
    import { css } from '@compiled/react';

    const containerStyles = css({ 
      padding: '0px',
      margin: 0,
      paddingBlock: '0rem',
      paddingInline: '0em',
    });
  `,
  outdent`
    // ignores already tokenised values
    import { css } from '@compiled/react';
    import { token } from '@atlaskit/tokens';

    const containerStyles = css({ 
      padding: token('space.100'),
    });
  `,
  outdent`
    // ignores CSS global values
    import { css } from '@compiled/react';
    import { token } from '@atlaskit/tokens';

    const containerStyles = css({ 
      padding: 'unset',
      margin: 'auto',
    });
  `,
  outdent`
    // ignores CSS vars
    import { css } from '@compiled/react';
    import { token } from '@atlaskit/tokens';

    const containerStyles = css({ 
      padding: 'var(--grid)',
    });
  `,
  outdent`
    // ignores complicated values
    import { css } from '@compiled/react';

    const gridSize = '8px';
    const containerStyles = css({
      paddingBottom: (padding) => \`\${padding}px\`,
      marginTop: padding ? '8px' : '16px',
      margin: gridSize,
      marginBottom: \`\${gridSize}\`,
      marginTop: "calc(-1 * 8px)",
    });
  `,
];

const invalid = [
  {
    code: outdent`
      // it suggests token for css call with tokenisable entry
      import { css } from '@emotion/react';

      const paddingStyles = css({ padding: '8px' });
    `,
    output: outdent`
      // it suggests token for css call with tokenisable entry
      import { token } from '@atlaskit/tokens';
      import { css } from '@emotion/react';

      const paddingStyles = css({ padding: token('space.100', '8px') });
    `,
    errors: [error],
  },

  {
    code: outdent`
      // raises a violation with no fixes for non-tokenisable values
      import { css } from '@emotion/react';
      const containerStyles = css({ padding: '9px' });
    `,
    errors: [error],
  },

  {
    code: outdent`
      // reports on css array syntax
      import { css } from '@emotion/react';
      const paddingStyles = css([{ padding: '8px' }]);
    `,
    errors: [error],
    output: outdent`
      // reports on css array syntax
      import { token } from '@atlaskit/tokens';
      import { css } from '@emotion/react';
      const paddingStyles = css([{ padding: token('space.100', '8px') }]);
    `,
  },

  {
    code: outdent`
      // it suggests token for css call with numbers
      import { css } from '@emotion/react';
      const paddingStyles = css({ padding: 8 });
    `,
    errors: [error],
    output: outdent`
      // it suggests token for css call with numbers
      import { token } from '@atlaskit/tokens';
      import { css } from '@emotion/react';
      const paddingStyles = css({ padding: token('space.100', '8') });
    `,
  },

  {
    code: outdent`
      // it suggests token valid negative values
      import { css } from '@emotion/react';
      const containerStyles = css({
        padding: '-8px',
      });
    `,
    errors: [error],
    output: outdent`
      // it suggests token valid negative values
      import { token } from '@atlaskit/tokens';
      import { css } from '@emotion/react';
      const containerStyles = css({
        padding: token('space.negative.100', '-8px'),
      });
    `,
  },

  {
    code: outdent`
      // handles nested styles
      import { css } from '@emotion/react';
      const containerStyles = css({
        '* >': {
          margin: '8px',
        }
      });
    `,
    errors: [error],

    output: outdent`
      // handles nested styles
      import { token } from '@atlaskit/tokens';
      import { css } from '@emotion/react';
      const containerStyles = css({
        '* >': {
          margin: token('space.100', '8px'),
        }
      });
    `,
  },
];

export const tests: Tests = {
  valid,
  invalid,
};
