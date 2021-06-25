jest.autoMockOff();

import { createTransformer } from '../utils';
import { renameUnsafeCardProp } from '../migrates/rename-unsafe-cards-prop';

// This stays as require() since changing to import will trigger a linter error
const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

const transformer = createTransformer('@atlaskit/editor-core', [
  renameUnsafeCardProp,
]);

describe('Rename UNSAFE_cards to smartLinks', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import { Editor } from '@atlaskit/editor-core';

    export default () => (
      <Editor />
    );
    `, // -----
    `
    import React from 'react';
    import { Editor } from '@atlaskit/editor-core';

    export default () => (
      <Editor />
    );
    `, // -----
    'rename nothing if UNSAFE_cards prop not set',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import { Editor } from '@atlaskit/editor-core';

    export default () => (
      <Editor smartLinks />
    );
    `, // -----
    `
    import React from 'react';
    import { Editor } from '@atlaskit/editor-core';

    export default () => (
      <Editor smartLinks />
    );
    `, // -----
    'rename nothing if boolean prop',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import { Editor } from '@atlaskit/editor-core';

    export default () => (
      <Editor smartLinks={{ provider: Promise.resolve({})}} />
    );
    `, // -----
    `
    import React from 'react';
    import { Editor } from '@atlaskit/editor-core';

    export default () => (
      <Editor smartLinks={{ provider: Promise.resolve({})}} />
    );
    `, // -----
    'rename nothing if UNSAFE_cards not found',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import { Editor } from '@atlaskit/editor-core';

    export default () => (
      <Editor UNSAFE_cards={{ provider: Promise.resolve({}), allowEmbeds: true }} />
    );
    `, // -----
    `
    import React from 'react';
    import { Editor } from '@atlaskit/editor-core';

    export default () => (
      <Editor smartLinks={{ provider: Promise.resolve({}), allowEmbeds: true }} />
    );
    `, // -----
    'rename UNSAFE_cards to smartLinks and do not change other options',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import { Editor as AKEditor } from '@atlaskit/editor-core';

    export default () => (
      <AKEditor UNSAFE_cards={{ provider: Promise.resolve({}) }} />
    );
    `, // -----
    `
    import React from 'react';
    import { Editor as AKEditor } from '@atlaskit/editor-core';

    export default () => (
      <AKEditor smartLinks={{ provider: Promise.resolve({}) }} />
    );
    `, // -----
    'rename UNSAFE_cards to smartLinks when Editor is renamed',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';

    const Editor = (props) => {
      <pre contenteditable>{props.children}</pre>
    };

    export default () => (
      <Editor UNSAFE_cards={{ provider: Promise.resolve({}) }} />
    );
    `, // -----
    `
    import React from 'react';

    const Editor = (props) => {
      <pre contenteditable>{props.children}</pre>
    };

    export default () => (
      <Editor UNSAFE_cards={{ provider: Promise.resolve({}) }} />
    );
    `, // -----
    'rename nothing if UNSAFE_cards for Editor is not from @atlaskit/editor-core',
  );
});
