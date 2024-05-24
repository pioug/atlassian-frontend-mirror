import outdent from 'outdent';

import { type Tests } from '../../__tests__/utils/_types';
import { noRawSpacingValues as error } from '../index';

const valid: string[] = [
  outdent`
    // ignores valid styles
    import { xcss } from '@atlaskit/primitives';

    const containerStyles = xcss({
      display: 'block',
      width: '8px',
    });
  `,

  outdent`
    // ignores 0
    import { xcss } from '@atlaskit/primitives';

    const containerStyles = xcss({
      margin: '0',
    });
  `,
  outdent`
    // ignores already tokenised values
    import { xcss } from '@atlaskit/primitives';
    import { token } from '@atlaskit/tokens';

    const containerStyles = xcss({
      margin: 'space.100',
    });
  `,
  outdent`
    // ignores xcss global values
    import { xcss } from '@atlaskit/primitives';

    const containerStyles = xcss({
      padding: 'unset',
      margin: 'auto',
    });
  `,

  outdent`
    // ignores complicated values
    import { xcss } from '@atlaskit/primitives';

    const gridSize = '8px';
    const containerStyles = xcss({
      paddingBottom: (padding) => \`\${padding}\`,
      marginTop: padding ? 'space.100' : 'space.200',
      margin: gridSize,
      marginBottom: \`\${gridSize}\`,
    });
  `,
];

const invalid = [
  {
    code: outdent`
    // ignores multi-values
    import { xcss } from '@atlaskit/primitives';

    const containerStyles = xcss({
      padding: '8px 12px',
    });
  `,
    errors: [error],
  },
  {
    code: outdent`
      // it raises a violation for xcss call with hardcoded pixel value
      import { xcss } from '@atlaskit/primitives';

      const paddingStyles = xcss({ padding: '8px' });
    `,
    errors: [error],
  },

  {
    code: outdent`
      // raises a violation with no fixes for non-tokenisable values
      import { xcss } from '@atlaskit/primitives';
      const containerStyles = xcss({ padding: '9px' });
    `,
    errors: [error],
  },

  {
    code: outdent`
      // reports on xcss array syntax
      import { xcss } from '@atlaskit/primitives';
      const paddingStyles = xcss([{ padding: '8px' }]);
    `,
    errors: [error],
  },

  {
    code: outdent`
      // it suggests token valid negative values
      import { xcss } from '@atlaskit/primitives';
      const containerStyles = xcss({
        padding: '-8px',
      });
    `,
    errors: [error],
  },

  {
    code: outdent`
      // handles nested styles
      import { xcss } from '@atlaskit/primitives';
      const containerStyles = xcss({
        ':hover': {
          margin: '8px',
        }
      });
    `,
    errors: [error],
  },
];

export const tests: Tests = {
  valid,
  invalid,
};
