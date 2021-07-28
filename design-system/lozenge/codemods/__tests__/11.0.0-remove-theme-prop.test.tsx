import transformer from '../11.0.0-lite-mode';

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('remove theme prop', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import Lozenge from '@atlaskit/lozenge';
    import { useTheme } from '../../theme';

    const LozengeTheme = (themeProps) => ({
      dark: { backgroundColor: 'blue', color: 'white' },
      light: { backgroundColor: 'blue', color: 'white' },
    });

    const App = () => {
      return (
        <Lozenge theme={useTheme(LozengeTheme)}>
          Custom
        </Lozenge>
      );
    }
    `,
    `
    /* TODO: (from codemod) 
    We could not automatically convert this code to the new API.

    This file uses \`Lozenge\`’s \`theme\` prop. This has been deprecated and removed. 

    You will have to change your usage to use the \`style\` prop.
    See the example on https://atlaskit.atlassian.com/examples/design-system/lozenge/with-custom-theme */
    import React from 'react';
    import Lozenge from '@atlaskit/lozenge';
    import { useTheme } from '../../theme';

    const LozengeTheme = (themeProps) => ({
      dark: { backgroundColor: 'blue', color: 'white' },
      light: { backgroundColor: 'blue', color: 'white' },
    });

    const App = () => {
      return (
        <Lozenge>
          Custom
        </Lozenge>
      );
    }
    `,
    `should remove theme if it is defined inline`,
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import Lozenge from '@atlaskit/lozenge';
    import { lozengeTheme } from '../../theme';

    const App = () => {
      return (
        <Lozenge theme={lozengeTheme}>
          Custom
        </Lozenge>
      );
    }
    `,
    `
    /* TODO: (from codemod) 
    We could not automatically convert this code to the new API.

    This file uses \`Lozenge\`’s \`theme\` prop. This has been deprecated and removed. 

    You will have to change your usage to use the \`style\` prop.
    See the example on https://atlaskit.atlassian.com/examples/design-system/lozenge/with-custom-theme */
    import React from 'react';
    import Lozenge from '@atlaskit/lozenge';
    import { lozengeTheme } from '../../theme';

    const App = () => {
      return (
        <Lozenge>
          Custom
        </Lozenge>
      );
    }
    `,
    `should remove theme if it is imported`,
  );
});
