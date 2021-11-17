// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
jest.autoMockOff();

import { createTransformer } from '@atlaskit/codemod-utils';

import deprecateOnItemActivated from '../migrates/deprecate-onItemActivated';

const transformer = createTransformer([deprecateOnItemActivated]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('delete onItemActivated prop', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from "react";
    import DropdownMenu from "@atlaskit/dropdown-menu";

    export default () => (
      <DropdownMenu trigger="Click to open" triggerType="button">
      </DropdownMenu>
    );
    `,
    `
    import React from "react";
    import DropdownMenu from "@atlaskit/dropdown-menu";

    export default () => (
      <DropdownMenu trigger="Click to open" triggerType="button">
      </DropdownMenu>
    );
    `,
    'should not change anything when onItemActivated is not used ',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from "react";
    import DropdownMenu from "@atlaskit/dropdown-menu";

    export default () => (
      <DropdownMenu trigger="Click to open" triggerType="button" onItemActivated={() => {}}>
      </DropdownMenu>
    );
    `,
    `
    import React from "react";
    import DropdownMenu from "@atlaskit/dropdown-menu";

    export default () => (
      <DropdownMenu trigger="Click to open" triggerType="button">
      </DropdownMenu>
    );
    `,
    'should delete onItemActivated when found it',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from "react";
    import AKDropdownMenu from "@atlaskit/dropdown-menu";

    export default () => (
      <AKDropdownMenu trigger="Click to open" triggerType="button" onItemActivated={() => {}}>
      </AKDropdownMenu>
    );
    `,
    `
    import React from "react";
    import AKDropdownMenu from "@atlaskit/dropdown-menu";

    export default () => (
      <AKDropdownMenu trigger="Click to open" triggerType="button">
      </AKDropdownMenu>
    );
    `,
    'should delete onItemActivated when found it - named import',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from "react";
    import DropdownMenu from "@fancy-ds/dropdown-menu";

    export default () => (
      <DropdownMenu trigger="Click to open" triggerType="button" onItemActivated={() => {}}>
      </DropdownMenu>
    );
    `,
    `
    import React from "react";
    import DropdownMenu from "@fancy-ds/dropdown-menu";

    export default () => (
      <DropdownMenu trigger="Click to open" triggerType="button" onItemActivated={() => {}}>
      </DropdownMenu>
    );
    `,
    'should not delete onItemActivated when found it - other library',
  );
});
