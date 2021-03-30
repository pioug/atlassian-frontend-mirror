jest.autoMockOff();

import { createTransformer } from '../utils';
import { removeConfigPanelWidthProp } from '../migrates/remove-config-panel-width-prop';
// This stays as require() since changing to import will trigger a linter error
const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

const transformer = createTransformer('@atlaskit/editor-core', [
  removeConfigPanelWidthProp,
]);

describe('Remove ContextPanel "width" prop', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import { ContextPanel } from '@atlaskit/editor-core';

    export default () => (
      <ContextPanel visible width={200}>
        Hi
      </ContextPanel>
    );
    `, // -----
    `
    import React from 'react';
    import { ContextPanel } from '@atlaskit/editor-core';

    export default () => (
      <ContextPanel visible>
        Hi
      </ContextPanel>
    );
    `, // -----
    'remove if width prop is set',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import { ContextPanel } from '@atlaskit/editor-core';

    export default () => (
      <ContextPanel visible>
        Hi
      </ContextPanel>
    );
    `, // -----
    `
    import React from 'react';
    import { ContextPanel } from '@atlaskit/editor-core';

    export default () => (
      <ContextPanel visible>
        Hi
      </ContextPanel>
    );
    `, // -----
    'remove nothing if width prop not set',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import { ContextPanel as AKContextPanel } from '@atlaskit/editor-core';

    export default () => (
      <AKContextPanel visible width={200}>
        Hi
      </AKContextPanel>
    );
    `, // -----
    `
    import React from 'react';
    import { ContextPanel as AKContextPanel } from '@atlaskit/editor-core';

    export default () => (
      <AKContextPanel visible>
        Hi
      </AKContextPanel>
    );
    `, // -----
    'remove width prop when ContextPanel is renamed',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';

    const ContextPanel = (props) => {
      <div>{props.children}</div>
    };

    export default () => (
      <ContextPanel visible width={200}>
        Hi
      </ContextPanel>
    );
    `, // -----
    `
    import React from 'react';

    const ContextPanel = (props) => {
      <div>{props.children}</div>
    };

    export default () => (
      <ContextPanel visible width={200}>
        Hi
      </ContextPanel>
    );
    `, // -----
    'only remove width for ContextPanel from @atlaskit/editor-core',
  );
});
