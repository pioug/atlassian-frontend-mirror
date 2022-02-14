jest.autoMockOff();

import { renameToggleStatelessToToggle } from '../migrates/rename-togglestateless-to-toggle';
import { createTransformer } from '../utils';

const transformer = createTransformer('@atlaskit/toggle', [
  renameToggleStatelessToToggle,
]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('Change ToggleStateless to Toggle', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import ToggleStateless from '@atlaskit/toggle';

    export default () => (
      <ToggleStateless size="large" isChecked />
    );
    `,
    `
    import React from 'react';
    import Toggle from '@atlaskit/toggle';

    export default () => (
      <Toggle size="large" isChecked />
    );
    `,
    'change ToggleStateless to Toggle',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import Toggle from '@material-ui/toggle';
    import ToggleStateless from '@atlaskit/toggle';

    export default () => (
      <ToggleStateless size="large" isChecked />
    );
    `,
    `
    import React from 'react';
    import Toggle from '@material-ui/toggle';
    import DSToggle from '@atlaskit/toggle';

    export default () => (
      <DSToggle size="large" isChecked />
    );
    `,
    'change ToggleStateless to DSToggle when name get conflict',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import ToggleStateless from '@atlaskit/toggle';

    export default () => (
      <>
        <section>
          <ToggleStateless size="large" isChecked />
        </section>
        <section>
          <ToggleStateless size="large" isChecked isDisabled />
        </section>
      </>
    );
    `,
    `
    import React from 'react';
    import Toggle from '@atlaskit/toggle';

    export default () => (
      <>
        <section>
          <Toggle size="large" isChecked />
        </section>
        <section>
          <Toggle size="large" isChecked isDisabled />
        </section>
      </>
    );
    `,
    'change ToggleStateless to Toggle',
  );
});
