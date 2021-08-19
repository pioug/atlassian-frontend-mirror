jest.autoMockOff();

import { removeThemeProp } from '../migrations/remove-props';
import { createTransformer } from '../migrations/utils';

const transformer = createTransformer('@atlaskit/textfield', [removeThemeProp]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

const themeToDoComment = `
/* TODO: (from codemod) This file uses the @atlaskit/textfield \`theme\` prop which
    has now been removed due to its poor performance characteristics. We have not replaced
    theme with an equivalent API due to minimal usage of the \`theme\` prop.
    The appearance of TextField will have likely changed. */`;

describe('Remove prop', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import Textfield from '@atlaskit/textfield';
    import customeTheme from './theme';

    const SimpleTextfield = () => {
      return (
        <Textfield
          theme={customTheme}
        />
      );
    }
  `,
    `
    ${themeToDoComment}
    import React from 'react';
    import Textfield from '@atlaskit/textfield';
    import customeTheme from './theme';

    const SimpleTextfield = () => {
      return <Textfield />;
    }
  `,
    'should remove theme from Textfield and leave a comment',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import TextField from '@atlaskit/textfield';
    import customeTheme from './theme';

    const SimpleTextfield = () => {
      return (
        <TextField
          theme={customTheme}
        />
      );
    }
  `,
    `
    ${themeToDoComment}
    import React from 'react';
    import TextField from '@atlaskit/textfield';
    import customeTheme from './theme';

    const SimpleTextfield = () => {
      return <TextField />;
    }
  `,
    'should remove theme from TextField and leave a comment',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import Textfield from '@atlaskit/textfield';
    import customeTheme from './theme';

    const SimpleTextfield = () => {
      return (
        <div>
          <Textfield
            theme={customTheme}
          />
          <Textfield
            theme={customTheme}
          />
        </div>
      );
    }
  `,
    `
    ${themeToDoComment}
    import React from 'react';
    import Textfield from '@atlaskit/textfield';
    import customeTheme from './theme';

    const SimpleTextfield = () => {
      return (
        <div>
          <Textfield />
          <Textfield />
        </div>
      );
    }
  `,
    'should remove 2 usages of theme and add 1 comment',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import Foo from '@atlaskit/textfield';
    import customeTheme from './theme';

    const SimpleTextfield = () => {
      return (
        <Foo
          theme={customeTheme}
        />
      );
    }
  `,
    `
    ${themeToDoComment}
    import React from 'react';
    import Foo from '@atlaskit/textfield';
    import customeTheme from './theme';

    const SimpleTextfield = () => {
      return <Foo />;
    }
  `,
    'should remove theme prop when using an aliased name',
  );
});
