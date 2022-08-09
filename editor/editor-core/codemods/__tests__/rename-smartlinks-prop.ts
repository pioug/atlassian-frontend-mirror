jest.autoMockOff();

import { createTransformer } from '../utils';
import { renameSmartLinksProp } from '../migrates/rename-smartlinks-prop';

// This stays as require() since changing to import will trigger a linter error
const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

const transformer = createTransformer('@atlaskit/editor-core', [
  renameSmartLinksProp,
]);

describe('Rename smartLinks to inside linking prop', () => {
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
    'rename nothing if smartLinks prop not set',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import { Editor } from '@atlaskit/editor-core';

    export default () => (
      <Editor linking />
    );
    `, // -----
    `
    import React from 'react';
    import { Editor } from '@atlaskit/editor-core';

    export default () => (
      <Editor linking />
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
      <Editor linking={{ smartLinks: { provider: Promise.resolve({}) } }} />
    );
    `, // -----
    `
    import React from 'react';
    import { Editor } from '@atlaskit/editor-core';

    export default () => (
      <Editor linking={{ smartLinks: { provider: Promise.resolve({}) } }} />
    );
    `, // -----
    'rename nothing if smartLinks not found',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import { Editor } from '@atlaskit/editor-core';

    export default () => (
      <Editor smartLinks={{ provider: Promise.resolve({}), allowEmbeds: true }} linking={{ linkPicker: {} }} />
    );
    `, // -----
    `
    import React from 'react';
    import { Editor } from '@atlaskit/editor-core';

    export default () => (
      <Editor smartLinks={{ provider: Promise.resolve({}), allowEmbeds: true }} linking={{ linkPicker: {} }} />
    );
    `, // -----
    'rename nothing if linking prop already exists',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import { Editor } from '@atlaskit/editor-core';

    export default () => (
      <Editor smartLinks={{ provider: Promise.resolve({}), allowEmbeds: true }} linking={{ smartLinks: { provider: Promise.resolve({}) } }} />
    );
    `, // -----
    `
    import React from 'react';
    import { Editor } from '@atlaskit/editor-core';

    export default () => (
      <Editor smartLinks={{ provider: Promise.resolve({}), allowEmbeds: true }} linking={{ smartLinks: { provider: Promise.resolve({}) } }} />
    );
    `, // -----
    'rename nothing if linking prop already exists with smartLinks key',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import { Editor } from '@atlaskit/editor-core';

    export default () => (
      <Editor smartLinks={{ provider: Promise.resolve({}), allowEmbeds: true }} />
    );
    `, // -----
    `
    import React from 'react';
    import { Editor } from '@atlaskit/editor-core';

    export default () => (
      <Editor linking={{
        smartLinks: {
          provider: Promise.resolve({}),
          allowEmbeds: true
        }
      }} />
    );
    `, // -----
    'rename smartLinks to key inside linking and do not change other options',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import { Editor as AKEditor } from '@atlaskit/editor-core';

    export default () => (
      <AKEditor smartLinks={{ provider: Promise.resolve({}) }} />
    );
    `, // -----
    `
    import React from 'react';
    import { Editor as AKEditor } from '@atlaskit/editor-core';

    export default () => (
      <AKEditor linking={{
        smartLinks: {
          provider: Promise.resolve({})
        }
      }} />
    );
    `, // -----
    'rename smartLinks to key inside linking when Editor is renamed',
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
      <Editor smartLinks={{ provider: Promise.resolve({}) }} />
    );
    `, // -----
    `
    import React from 'react';

    const Editor = (props) => {
      <pre contenteditable>{props.children}</pre>
    };

    export default () => (
      <Editor smartLinks={{ provider: Promise.resolve({}) }} />
    );
    `, // -----
    'rename nothing if smartLinks for Editor is not from @atlaskit/editor-core',
  );
});
