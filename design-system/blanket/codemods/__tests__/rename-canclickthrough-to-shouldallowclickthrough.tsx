import { createTransformer } from '@atlaskit/codemod-utils';

import { renameCanClickThrough } from '../migrations/rename-canclickthrough-to-shouldallowclickthrough';

const transformer = createTransformer([renameCanClickThrough]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('Blanket codemods', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import Blanket from '@atlaskit/blanket';

    const App = () => {
      return (
        <Blanket
          canClickThrough
        />
      );
    }
    `,
    `
    import React from 'react';
    import Blanket from '@atlaskit/blanket';

    const App = () => {
      return (
        <Blanket
          shouldAllowClickThrough
        />
      );
    }
    `,
    `should rename the "canClickThrough" prop to "shouldAllowClickThrough" prop`,
  );
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import Blanket from '@atlaskit/blanket';

    const App = () => {
      return (
        <Blanket
          canClickThrough={true}
        />
      );
    }
    `,
    `
    import React from 'react';
    import Blanket from '@atlaskit/blanket';

    const App = () => {
      return (
        <Blanket
          shouldAllowClickThrough={true}
        />
      );
    }
    `,
    `should rename the "canClickThrough" prop to "shouldAllowClickThrough" prop`,
  );
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import Blanket from '@atlaskit/blanket';

    const App = () => {
      return (
        <Blanket
          isTinted={false}
          canClickThrough={true}
          testId="blanket"
        />
      );
    }
    `,
    `
    import React from 'react';
    import Blanket from '@atlaskit/blanket';

    const App = () => {
      return (
        <Blanket
          isTinted={false}
          shouldAllowClickThrough={true}
          testId="blanket"
        />
      );
    }
    `,
    `should rename only "canClickThrough" prop and leave other props unaffected`,
  );
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import Blanket from '@atlaskit/blanket';
    const shouldAllowClickThrough = false;
    const App = () => {
      return (
        <Blanket
          isTinted={false}
          canClickThrough={shouldAllowClickThrough}
          testId="blanket"
        />
      );
    }
    `,
    `
    import React from 'react';
    import Blanket from '@atlaskit/blanket';
    const shouldAllowClickThrough = false;
    const App = () => {
      return (
        <Blanket
          isTinted={false}
          shouldAllowClickThrough={shouldAllowClickThrough}
          testId="blanket"
        />
      );
    }
    `,
    `should rename the "canClickThrough" prop when its value is a variable`,
  );
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import Blanket from '@atlaskit/blanket';
    const shouldAllowClickThrough = false;
    const App = () => {
      return (
        <Blanket
          isTinted={false}
          canClickThrough={true && shouldAllowClickThrough || false}
          testId="blanket"
        />
      );
    }
    `,
    `
    import React from 'react';
    import Blanket from '@atlaskit/blanket';
    const shouldAllowClickThrough = false;
    const App = () => {
      return (
        <Blanket
          isTinted={false}
          shouldAllowClickThrough={true && shouldAllowClickThrough || false}
          testId="blanket"
        />
      );
    }
    `,
    `should rename the "canClickThrough" prop when its value is a complex expression`,
  );
});
