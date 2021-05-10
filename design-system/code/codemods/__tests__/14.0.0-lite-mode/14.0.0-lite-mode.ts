import transformer from '../../14.0.0-lite-mode';

import { comment } from './remove-language';

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('all transforms should be applied', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';

    import { Code } from '@atlaskit/code';

    export default function CodeDefaultExample() {
      const text = "bolt changeset";

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
      const text = "bolt changeset";

      return (
        <p>
          To start creating a changeset, run{' '}
          <Code>bolt changeset</Code>. Then you will be prompted
          to select packages for release.
        </p>
      );
    }
    `,
    'should remove language prop if it is a string and convert text to be a child if it is a variable',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';

    import { Code as AkCode } from '@atlaskit/code';

    const language = "jsx";

    export default function CodeDefaultExample() {
      return (
        <p>
          To start creating a changeset, run{' '}
          <AkCode language={language} text="bolt changeset" />. Then you will be prompted
          to select packages for release.
        </p>
      );
    }
    `,
    `
    ${comment}
    import React from 'react';

    import { Code as AkCode } from '@atlaskit/code';

    const language = "jsx";

    export default function CodeDefaultExample() {
      return (
        <p>
          To start creating a changeset, run{' '}
          <AkCode>bolt changeset</AkCode>. Then you will be prompted
          to select packages for release.
        </p>
      );
    }
    `,
    'should remove language prop if it is a variable and text to be a child if it is a string and code is aliased',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';

    import { Code } from '@atlaskit/code';

    const language = "jsx";

    export default function CodeDefaultExample() {
      const command = "brew thefuck";
      return (
        <p>
          To start creating a changeset, run{' '}
          <Code language={jsx} text={command} testId="super-secret" />. Then you will be prompted
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
      const command = "brew thefuck";
      return (
        <p>
          To start creating a changeset, run{' '}
          <Code testId="super-secret">{command}</Code>. Then you will be prompted
          to select packages for release.
        </p>
      );
    }
    `,
    'should remove language prop if it is a variable and text to be a child and not change other props',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';

    import { Code } from '@atlaskit/code';

    const language = "jsx";

    const unrelated = () => <Code language="jsx" text={"rm -rf"} />

    export default function CodeDefaultExample() {
      const command = "brew thefuck";
      return (
        <p>
          To start creating a changeset, run{' '}
          <Code language={jsx} text={command} testId="super-secret" />. Then you will be prompted
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

    const unrelated = () => <Code>rm -rf</Code>

    export default function CodeDefaultExample() {
      const command = "brew thefuck";
      return (
        <p>
          To start creating a changeset, run{' '}
          <Code testId="super-secret">{command}</Code>. Then you will be prompted
          to select packages for release.
        </p>
      );
    }
    `,
    'should remove language prop if it is a variable and text to be a child if it is a variable with other props',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';

    import { Code } from '@atlaskit/code';

    export default function CodeDefaultExample() {
      const text = "bolt changeset";

      return (
        <p>
          To start creating a changeset, run <Code language="text" text="bolt changeset" />. All g mate.
        </p>
      );
    }
    `,
    `
    ${comment}
    import React from 'react';

    import { Code } from '@atlaskit/code';

    export default function CodeDefaultExample() {
      const text = "bolt changeset";

      return (
        <p>
          To start creating a changeset, run <Code>bolt changeset</Code>. All g mate.
        </p>
      );
    }
    `,
    'should remove language prop and convert to children if code is inline',
  );
});
