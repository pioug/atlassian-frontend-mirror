jest.autoMockOff();

import { elevateStatelessToDefault } from '../migrates/elevate-stateless-to-default';
import { createTransformer } from '../utils';

const transformer = createTransformer('@atlaskit/toggle', [
  elevateStatelessToDefault,
]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('Merge Toggle and ToggleStateless', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import Toggle from '@atlaskit/toggle';

    export default () => (
      <Toggle size="large" defaultChecked />
    );
    `,
    `
    import React from 'react';
    import Toggle from '@atlaskit/toggle';

    export default () => (
      <Toggle size="large" defaultChecked />
    );
    `,
    'nothing would change if Toggle is used',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import { ToggleStateless } from '@atlaskit/toggle';

    export default () => (
      <ToggleStateless size="large" isChecked />
    );
    `,
    `
    import React from 'react';
    import ToggleStateless from '@atlaskit/toggle';

    export default () => (
      <ToggleStateless size="large" isChecked />
    );
    `,
    'change to new Toggle when ToggleStateless is used',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import { ToggleStateless as Toggle } from '@atlaskit/toggle';

    export default () => (
      <Toggle size="large" isChecked />
    );
    `,
    `
    import React from 'react';
    import Toggle from '@atlaskit/toggle';

    export default () => (
      <Toggle size="large" isChecked />
    );
    `,
    'change to new Toggle when ToggleStateless is used, with alias',
  );
});
