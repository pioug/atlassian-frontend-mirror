jest.autoMockOff();

import { addingDefaultCheckedToStateful } from '../migrates/adding-defaultChecked-to-stateful';
import { createTransformer } from '../utils';

const transformer = createTransformer('@atlaskit/toggle', [
  addingDefaultCheckedToStateful,
]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('Add defaultChecked to stateful toggle', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import Toggle from '@atlaskit/toggle';

    export default () => (
      <Toggle size="large" />
    );
    `,
    `
    import React from 'react';
    import Toggle from '@atlaskit/toggle';

    export default () => (
      <Toggle size="large" defaultChecked={false} />
    );
    `,
    'add defaultChecked to Toggle to make it stateful - default export',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import Toggle from '@atlaskit/toggle';

    export default () => (
      <Toggle size="large" defaultChecked={true} />
    );
    `,
    `
    import React from 'react';
    import Toggle from '@atlaskit/toggle';

    export default () => (
      <Toggle size="large" defaultChecked={true} />
    );
    `,
    'do not change value of defaultChecked',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import Toggle from '@atlaskit/toggle';

    const checked = true;

    export default () => (
      <Toggle size="large" defaultChecked={checked} />
    );
    `,
    `
    import React from 'react';
    import Toggle from '@atlaskit/toggle';

    const checked = true;

    export default () => (
      <Toggle size="large" defaultChecked={checked} />
    );
    `,
    'do not change value of defaultChecked when value provided as variable',
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
    import { ToggleStateless } from '@atlaskit/toggle';

    export default () => (
      <ToggleStateless size="large" isChecked />
    );
    `,
    'do nothing to ToggleStateless',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import Toggle, { ToggleStateless } from '@atlaskit/toggle';

    export default () => (
      <>
        <Toggle size="large" />
        <ToggleStateless size="large" isChecked />
      </>
    );
    `,
    `
    import React from 'react';
    import Toggle, { ToggleStateless } from '@atlaskit/toggle';

    export default () => (
      <>
        <Toggle size="large" defaultChecked={false} />
        <ToggleStateless size="large" isChecked />
      </>
    );
    `,
    'skip ToggleStateless',
  );
});
