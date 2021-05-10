import { createTransformer } from '@atlaskit/codemod-utils';

import textToChild from '../../migrations/14.0.0-lite-mode/text-to-child';

const transformer = createTransformer([textToChild]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('make the test prop a child', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';

    import { Code } from '@atlaskit/code';

    export default function CodeDefaultExample() {
      return (
        <p>
          To start creating a changeset, run{' '}
          <Code text="bolt changeset" />. Then you will be prompted
          to select packages for release.
        </p>
      );
    }
    `,
    `
    import React from 'react';

    import { Code } from '@atlaskit/code';

    export default function CodeDefaultExample() {
      return (
        <p>
          To start creating a changeset, run{' '}
          <Code>bolt changeset</Code>. Then you will be prompted
          to select packages for release.
        </p>
      );
    }
    `,
    'should make the text prop a child if it is a string',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';

    import { Code } from '@atlaskit/code';

    const text = "bolt changeset";

    export default function CodeDefaultExample() {
      return (
        <p>
          To start creating a changeset, run{' '}
          <Code text={text} />. Then you will be prompted
          to select packages for release.
        </p>
      );
    }
    `,
    `
    import React from 'react';

    import { Code } from '@atlaskit/code';

    const text = "bolt changeset";

    export default function CodeDefaultExample() {
      return (
        <p>
          To start creating a changeset, run{' '}
          <Code>{text}</Code>. Then you will be prompted
          to select packages for release.
        </p>
      );
    }
    `,
    'should make the text prop a child if it is a variable',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';

    import { Code } from '@atlaskit/code';

    export default function CodeDefaultExample() {
      return (
        <p>
          To start creating a changeset, run{' '}
          <Code testId="hello!" text="bolt changeset" />. Then you will be prompted
          to select packages for release.
        </p>
      );
    }
    `,
    `
    import React from 'react';

    import { Code } from '@atlaskit/code';

    export default function CodeDefaultExample() {
      return (
        <p>
          To start creating a changeset, run{' '}
          <Code testId="hello!">bolt changeset</Code>. Then you will be prompted
          to select packages for release.
        </p>
      );
    }
    `,
    'should retain other props when converting to children',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';

    import { Code } from '@atlaskit/code';

    import codeProps from './code-props';

    export default function CodeDefaultExample() {
      return (
        <p>
          To start creating a changeset, run{' '}
          <Code {...codeProps} text="bolt changeset" />. Then you will be prompted
          to select packages for release.
        </p>
      );
    }
    `,
    `
    import React from 'react';

    import { Code } from '@atlaskit/code';

    import codeProps from './code-props';

    export default function CodeDefaultExample() {
      return (
        <p>
          To start creating a changeset, run{' '}
          <Code {...codeProps}>bolt changeset</Code>. Then you will be prompted
          to select packages for release.
        </p>
      );
    }
    `,
    'should retain other props that are spread when converting to children',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';

    import { Code } from '@atlaskit/code';

    const text = "bolt changeset" ;

    export default function CodeDefaultExample() {
      return (
        <p>
          To start creating a changeset, run{' '}
          <Code text={text} />. Then you will be prompted
          to select packages for release.
          If you wanna run <Code text="rm -rf"/> you can for fun
        </p>
      );
    }
    `,
    `
    import React from 'react';

    import { Code } from '@atlaskit/code';

    const text = "bolt changeset" ;

    export default function CodeDefaultExample() {
      return (
        <p>
          To start creating a changeset, run{' '}
          <Code>{text}</Code>. Then you will be prompted
          to select packages for release.
          If you wanna run <Code>rm -rf</Code> you can for fun
        </p>
      );
    }
    `,
    'should make the text prop a child with 2 usages',
  );
});
