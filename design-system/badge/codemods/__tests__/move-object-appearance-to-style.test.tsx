import { createTransformer } from '@atlaskit/codemod-utils';

import { moveObjectAppearanceToStyle } from '../internal/move-object-appearance-to-style';

const transformer = createTransformer([moveObjectAppearanceToStyle]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('#moveObjectAppearanceToStyle', () => {
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
    import Badge from '@atlaskit/badge';

    const App = () => {
      return (
        <Badge
          appearance="default"
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
          appearance="default"
        >
         {10}
        </Badge>
      );
    }
    `,
    `should not make modifications when appearance prop is not type of object`,
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import Badge from '@atlaskit/badge';

    const App = (props) => {
      return (
        <Badge
          appearance={props.appearance}
        >
         {10}
        </Badge>
      );
    }
    `,
    `
    import React from 'react';
    import Badge from '@atlaskit/badge';

    const App = (props) => {
      return (
        <Badge
          appearance={props.appearance}
        >
         {10}
        </Badge>
      );
    }
    `,
    `should not make modifications when appearance prop is dynamic`,
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import Badge from '@atlaskit/badge';

    const App = () => {
      return (
        <Badge
          style={{ backgroundColor: 'red' }}
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
          style={{ backgroundColor: 'red' }}
        >
         {10}
        </Badge>
      );
    }
    `,
    `should not make modifications when appearance prop is not present`,
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import Badge from '@atlaskit/badge';

    const App = () => {
      return (
        <Badge
          appearance="default"
          style={{ backgroundColor: 'red' }}
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
          appearance="default"
          style={{ backgroundColor: 'red' }}
        >
         {10}
        </Badge>
      );
    }
    `,
    `should not make modifications when appearance prop is not type of object and style prop is also present`,
  );
});
