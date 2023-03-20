jest.autoMockOff();

import { createTransformer } from '../utils';
import { renameEditorToMigrationComponent } from '../migrates/rename-editor-to-editor-migration-component';
// This stays as require() since changing to import will trigger a linter error
const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

const transformer = createTransformer('@atlaskit/editor-core', [
  renameEditorToMigrationComponent,
]);

describe('Update Editor to EditorMigrationComponent', () => {
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
    import { EditorMigrationComponent as Editor } from '@atlaskit/editor-core';

    export default () => (
      <Editor />
    );
    `, // -----
    'update editor component',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import { Editor as AkEditor } from '@atlaskit/editor-core';

    export default () => (
      <AkEditor />
    );
    `, // -----
    `
    import React from 'react';
    import { EditorMigrationComponent as AkEditor } from '@atlaskit/editor-core';

    export default () => (
      <AkEditor />
    );
    `, // -----
    'update editor component to keep same local name',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import { Editor as AkEditor, ContextPanel } from '@atlaskit/editor-core';

    export default () => (
      <AkEditor />
    );
    `, // -----
    `
    import React from 'react';
    import { EditorMigrationComponent as AkEditor, ContextPanel } from '@atlaskit/editor-core';

    export default () => (
      <AkEditor />
    );
    `, // -----
    'update editor component to not modify other components',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import { ContextPanel } from '@atlaskit/editor-core';

    export default () => (
      <div />
    );
    `, // -----
    `
    import React from 'react';
    import { ContextPanel } from '@atlaskit/editor-core';

    export default () => (
      <div />
    );
    `, // -----
    'nothing should change if there is no editor',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import SomethingElse, { Editor } from 'cool-package'
    import { Editor as AkEditor } from '@atlaskit/editor-core';

    export default () => (
      <AkEditor>
        <Editor />
      </AkEditor>
    );
    `, // -----
    `
    import React from 'react';
    import SomethingElse, { Editor } from 'cool-package'
    import { EditorMigrationComponent as AkEditor } from '@atlaskit/editor-core';

    export default () => (
      <AkEditor>
        <Editor />
      </AkEditor>
    );
    `, // -----
    'should not change named exports from other packages that are called Editor',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import Editor from 'cool-package'
    import { Editor as AkEditor } from '@atlaskit/editor-core';

    export default () => (
      <AkEditor>
        <Editor />
      </AkEditor>
    );
    `, // -----
    `
    import React from 'react';
    import Editor from 'cool-package'
    import { EditorMigrationComponent as AkEditor } from '@atlaskit/editor-core';

    export default () => (
      <AkEditor>
        <Editor />
      </AkEditor>
    );
    `, // -----
    'should not change exports from other packages that has a default export of Editor',
  );
});
