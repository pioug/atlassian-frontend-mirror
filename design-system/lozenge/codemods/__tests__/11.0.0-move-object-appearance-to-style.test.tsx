import transformer from '../11.0.0-lite-mode';

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('Lozenge codemod', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import Lozenge from '@atlaskit/lozenge';

    const App = () => {
      return (
        <Lozenge
          appearance={{ backgroundColor: 'yellow', textColor: 'blue' }}
        >
          Custom
        </Lozenge>
      );
    }
    `,
    `
    import React from 'react';
    import Lozenge from '@atlaskit/lozenge';

    const App = () => {
      return (
        <Lozenge
          style={{
            backgroundColor: { backgroundColor: 'yellow', textColor: 'blue' }["backgroundColor"],
            color: { backgroundColor: 'yellow', textColor: 'blue' }["textColor"]
          }}
        >
          Custom
        </Lozenge>
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
    import Lozenge from '@atlaskit/custom-lozenge';

    const App = () => {
      return (
        <Lozenge
          appearance={{ backgroundColor: 'yellow', textColor: 'blue' }}
        >
          Custom
        </Lozenge>
      );
    }
    `,
    `
    import React from 'react';
    import Lozenge from '@atlaskit/custom-lozenge';

    const App = () => {
      return (
        <Lozenge
          appearance={{ backgroundColor: 'yellow', textColor: 'blue' }}
        >
          Custom
        </Lozenge>
      );
    }
    `,
    `should not be modified when not imported from "@atlaskit/lozenge"`,
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import Lozenge from '@atlaskit/lozenge';

    const App = () => {
      return (
        <Lozenge appearance='default'>
          Custom
        </Lozenge>
      );
    }
    `,
    `
    import React from 'react';
    import Lozenge from '@atlaskit/lozenge';

    const App = () => {
      return (
        <Lozenge appearance='default'>
          Custom
        </Lozenge>
      );
    }
    `,
    `should not be modified when appearance prop is not an object`,
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import Lozenge from '@atlaskit/lozenge';

    const App = (props) => {
      return (
        <Lozenge appearance={props.appearance}>
          Custom
        </Lozenge>
      );
    }
    `,
    `
    import React from 'react';
    import Lozenge from '@atlaskit/lozenge';

    const App = (props) => {
      return (
        <Lozenge appearance={props.appearance}>
          Custom
        </Lozenge>
      );
    }
    `,
    `should not be modified when appearance prop is dynamic`,
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import Lozenge from '@atlaskit/lozenge';

    const App = () => {
      return (
        <Lozenge
          appearance="default"
          style={{ backgroundColor: 'red' }}
        >
          Custom
        </Lozenge>
      );
    }
    `,
    `
    import React from 'react';
    import Lozenge from '@atlaskit/lozenge';

    const App = () => {
      return (
        <Lozenge
          appearance="default"
          style={{ backgroundColor: 'red' }}
        >
          Custom
        </Lozenge>
      );
    }
    `,
    `should not be modified when appearance prop is not type of object and style prop is also present`,
  );
});
