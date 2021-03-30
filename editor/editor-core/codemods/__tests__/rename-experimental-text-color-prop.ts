jest.autoMockOff();

import { createTransformer } from '../utils';
import { renameExperimentalTextColorProp } from '../migrates/rename-experimental-text-color-prop';
// This stays as require() since changing to import will trigger a linter error
const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

const transformer = createTransformer('@atlaskit/editor-core', [
  renameExperimentalTextColorProp,
]);

describe('Rename allowTextColor.EXPERIMENTAL_allowMoreTextColors to allowMoreTextColors', () => {
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
    'rename nothing if allowTextColor prop not set',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import { Editor } from '@atlaskit/editor-core';

    export default () => (
      <Editor allowTextColor />
    );
    `, // -----
    `
    import React from 'react';
    import { Editor } from '@atlaskit/editor-core';

    export default () => (
      <Editor allowTextColor />
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
      <Editor allowTextColor={{ defaultColor: { label: 'Green', color: '#00ff00' }}} />
    );
    `, // -----
    `
    import React from 'react';
    import { Editor } from '@atlaskit/editor-core';

    export default () => (
      <Editor allowTextColor={{ defaultColor: { label: 'Green', color: '#00ff00' }}} />
    );
    `, // -----
    'rename nothing if EXPERIMENTAL_allowMoreTextColors not found',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import { Editor } from '@atlaskit/editor-core';

    export default () => (
      <Editor
        allowTextColor={
          { EXPERIMENTAL_allowMoreTextColors: true, defaultColor: { label: 'Red', color: '#ff0000' } }
        }
      />
    );
    `, // -----
    `
    import React from 'react';
    import { Editor } from '@atlaskit/editor-core';

    export default () => (
      <Editor
        allowTextColor={
          { allowMoreTextColors: true, defaultColor: { label: 'Red', color: '#ff0000' } }
        }
      />
    );
    `, // -----
    'rename EXPERIMENTAL_allowMoreTextColors to allowMoreTextColors and do not change other options',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import { Editor } from '@atlaskit/editor-core';

    const allowTextColor = { EXPERIMENTAL_allowMoreTextColors: true, defaultColor: { label: 'Red', color: '#ff0000' } };

    export default () => (
      <Editor
        allowTextColor={allowTextColor}
      />
    );
    `, // -----
    `
    import React from 'react';
    import { Editor } from '@atlaskit/editor-core';

    const allowTextColor = { allowMoreTextColors: true, defaultColor: { label: 'Red', color: '#ff0000' } };

    export default () => (
      <Editor
        allowTextColor={allowTextColor}
      />
    );
    `, // -----
    'rename EXPERIMENTAL_allowMoreTextColors to allowMoreTextColors if defined outside of Editor',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import { Editor as AKEditor } from '@atlaskit/editor-core';

    export default () => (
      <AKEditor
        allowTextColor={
          { EXPERIMENTAL_allowMoreTextColors: true, defaultColor: { label: 'Red', color: '#ff0000' } }
        }
      />
    );
    `, // -----
    `
    import React from 'react';
    import { Editor as AKEditor } from '@atlaskit/editor-core';

    export default () => (
      <AKEditor
        allowTextColor={
          { allowMoreTextColors: true, defaultColor: { label: 'Red', color: '#ff0000' } }
        }
      />
    );
    `, // -----
    'rename EXPERIMENTAL_allowMoreTextColors to allowMoreTextColors when Editor is renamed',
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
      <Editor
        allowTextColor={
          { EXPERIMENTAL_allowMoreTextColors: true }
        }
      />
    );
    `, // -----
    `
    import React from 'react';

    const Editor = (props) => {
      <pre contenteditable>{props.children}</pre>
    };

    export default () => (
      <Editor
        allowTextColor={
          { EXPERIMENTAL_allowMoreTextColors: true }
        }
      />
    );
    `, // -----
    'only rename EXPERIMENTAL_allowMoreTextColors for Editor from @atlaskit/editor-core',
  );
});
