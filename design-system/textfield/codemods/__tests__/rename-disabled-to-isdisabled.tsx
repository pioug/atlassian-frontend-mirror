jest.autoMockOff();

import { createTransformer } from '@atlaskit/codemod-utils';

import { renameDisabledToIsDisabled } from '../migrations/rename-disabled-to-isdisabled';

const transformer = createTransformer([renameDisabledToIsDisabled]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('Rename `disabled` prop to `isDisabled`', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import Textfield from '@atlaskit/textfield';

    const SimpleTextfield = () => {
      return <Textfield disabled />;
    }
  `,
    `
    import React from 'react';
    import Textfield from '@atlaskit/textfield';

    const SimpleTextfield = () => {
      return <Textfield isDisabled />;
    }
  `,
    'should rename single line disabled to isDisabled',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import Textfield from '@atlaskit/textfield';

    const SimpleTextfield = () => {
      return (
        <Textfield
          name="basic"
          aria-label="default text field"
          disabled
        />
      );
    }
  `,
    `
    import React from 'react';
    import Textfield from '@atlaskit/textfield';

    const SimpleTextfield = () => {
      return (
        <Textfield
          name="basic"
          aria-label="default text field"
          isDisabled
        />
      );
    }
  `,
    'should rename multiline disabled to isDisabled',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import Textfield from '@atlaskit/textfield';

    const SimpleTextfield = () => {
      const disabled = true;

      return (
        <Textfield
          name="basic"
          aria-label="default text field"
          disabled={disabled}
        />
      );
    }
  `,
    `
    import React from 'react';
    import Textfield from '@atlaskit/textfield';

    const SimpleTextfield = () => {
      const disabled = true;

      return (
        <Textfield
          name="basic"
          aria-label="default text field"
          isDisabled={disabled}
        />
      );
    }
  `,
    'should rename disabled to isDisabled with indirection',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import AkTextfield from '@atlaskit/textfield';

    const SimpleTextfield = () => {
      const disabled = true;

      return (
        <AkTextfield
          name="basic"
          aria-label="default text field"
          disabled={disabled}
        />
      );
    }
  `,
    `
    import React from 'react';
    import AkTextfield from '@atlaskit/textfield';

    const SimpleTextfield = () => {
      const disabled = true;

      return (
        <AkTextfield
          name="basic"
          aria-label="default text field"
          isDisabled={disabled}
        />
      );
    }
  `,
    'should rename disabled to isDisabled with indirection and different default import',
  );
});
