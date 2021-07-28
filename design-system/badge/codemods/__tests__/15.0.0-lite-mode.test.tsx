import transformer from '../15.0.0-lite-mode';

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('badge codemod', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import Badge from '@atlaskit/badge';

    const App = () => {
      return (
        <Badge
          appearance={{ backgroundColor: 'red' }}
        >
         {10}
        </Badge>
      );
    }
    `,
    `
    import React from 'react';
    import Badge from '@atlaskit/badge';

    const App = () => {
      return (
        <Badge
          style={{
            backgroundColor: { backgroundColor: 'red' }["backgroundColor"],
            color: { backgroundColor: 'red' }["textColor"]
          }}
        >
         {10}
        </Badge>
      );
    }
    `,
    `should move object appearance values to style prop`,
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import Badge from '@atlaskit/custom-badge';

    const App = () => {
      return (
        <Badge
          appearance={{ backgroundColor: 'red' }}
        >
         {10}
        </Badge>
      );
    }
    `,
    `
    import React from 'react';
    import Badge from '@atlaskit/custom-badge';

    const App = () => {
      return (
        <Badge
          appearance={{ backgroundColor: 'red' }}
        >
         {10}
        </Badge>
      );
    }
    `,
    `should should not make modifications when not imported from "@atlaskit/badge"`,
  );
});
