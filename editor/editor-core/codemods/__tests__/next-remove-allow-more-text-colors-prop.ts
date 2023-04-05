jest.autoMockOff();
import { createTransformer } from '../utils';
import { removeAllowMoreColorsProp } from '../migrates/next-remove-allow-more-text-colors-prop';
// This stays as require() since changing to import will trigger a linter error
const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;
const transformer = createTransformer('@atlaskit/editor-core', [
  removeAllowMoreColorsProp,
]);
describe('remove `allowMoreTextColors` field from `allowTextColor` Editor prop.', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import { Editor } from '@atlaskit/editor-core';
    export default () => <Editor
      allowTextColor = {
        {
          allowMoreTextColors: true,
          defaultColour: {color: 'red', label: 'red'}
        }
      }
      allowStatus={true}
    />
    `, // -----
    `
    import React from 'react';
    import { Editor } from '@atlaskit/editor-core';
    export default () => <Editor
      allowTextColor = {
        {
          defaultColour: {color: 'red', label: 'red'}
        }
      }
      allowStatus={true}
    />
    `, // -----
    'remove allowMoreTextColors field if it exists',
  );
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import { Editor } from '@atlaskit/editor-core';
    export default () => <Editor
      appearance="full-page"
      allowTextColor = {
        {
          allowMoreTextColors: true,
        }
      }
    />
    `, // -----
    `
    import React from 'react';
    import { Editor } from '@atlaskit/editor-core';
    export default () => <Editor
      appearance="full-page"
      allowTextColor={true}
    />
    `, // -----
    'set allowTextColor prop value to `true` if allowMoreTextColors is its only field',
  );
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import { Editor as MyEditor } from '@atlaskit/editor-core';
    export default () => <Editor
      appearance="full-page"
      allowTextColor = {
        {
          allowMoreTextColors: true,
          defaultColour: {color: 'red', label: 'red'}
        }
      }
    />
    `, // -----
    `
    import React from 'react';
    import { Editor as MyEditor } from '@atlaskit/editor-core';
    export default () => <Editor
      appearance="full-page"
      allowTextColor = {
        {
          defaultColour: {color: 'red', label: 'red'}
        }
      }
    />
    `, // -----
    'remove allowMoreTextColors prop prop when Editor is renamed',
  );
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    const Editor = (props) => {
      <div>{props.children}</div>
    };
    export default () => <Editor
      appearance="full-page"
      allowTextColor = {
        {
          allowMoreTextColors: true,
          defaultColour: {color: 'red', label: 'red'}
        }
      }
    />
    `, // -----
    `
    import React from 'react';
    const Editor = (props) => {
      <div>{props.children}</div>
    };
    export default () => <Editor
      appearance="full-page"
      allowTextColor = {
        {
          allowMoreTextColors: true,
          defaultColour: {color: 'red', label: 'red'}
        }
      }
    />
    `, // -----
    'only remove allowMoreTextColors prop for Editor from @atlaskit/editor-core',
  );
});
