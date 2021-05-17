import { createTransformer } from '@atlaskit/codemod-utils';

import removeLanguageProp from '../../migrations/14.0.0-lite-mode/remove-language';

const transformer = createTransformer([removeLanguageProp]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

export const comment = `/* TODO: (from codemod) 
    We could not automatically convert this code to the new API.

    This file uses \`Code\`’s \`language\` prop. The support for syntax highlighting has
    been removed to make \`Code\` lighter, quicker and more composable. If you need syntax
    highlighting it is still available in \`CodeBlock\`. */`;

// TODO come up with a comment here
describe('remove language prop', () => {
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
          <Code language="text" text="bolt changeset" />. Then you will be prompted
          to select packages for release.
        </p>
      );
    }
    `,
    `
    ${comment}
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
    'should remove language prop if it is a string',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';

    import { Code } from '@atlaskit/code';

    const language = "jsx";

    export default function CodeDefaultExample() {
      return (
        <p>
          To start creating a changeset, run{' '}
          <Code language={language} text="bolt changeset" />. Then you will be prompted
          to select packages for release.
        </p>
      );
    }
    `,
    `
    ${comment}
    import React from 'react';

    import { Code } from '@atlaskit/code';

    const language = "jsx";

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
    'should remove language prop if it is a variable',
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
          <Code text="bolt changeset" />. Then you will be prompted
          to select packages for release.
        </p>
      );
    }
    `,
    'should not do anything if language prop is not defined',
  );
});
