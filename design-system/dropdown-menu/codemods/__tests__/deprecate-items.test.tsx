// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
jest.autoMockOff();

import { createTransformer } from '@atlaskit/codemod-utils';

import deprecateItems from '../migrates/deprecate-items';

const transformer = createTransformer([deprecateItems]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('delete items prop', () => {
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
    'should not change anything when items is not used ',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from "react";
    import DropdownMenu from "@atlaskit/dropdown-menu";

    export default () => (
      <DropdownMenu trigger="Click to open" triggerType="button" items={[]}>
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
    'should delete items when found it',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from "react";
    import AKDropdownMenu from "@atlaskit/dropdown-menu";

    export default () => (
      <AKDropdownMenu trigger="Click to open" triggerType="button" items={[]}>
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
    'should delete items when found it - named import',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from "react";
    import DropdownMenu from "@fancy-ds/dropdown-menu";

    export default () => (
      <DropdownMenu trigger="Click to open" triggerType="button" items={[]}>
      </DropdownMenu>
    );
    `,
    `
    import React from "react";
    import DropdownMenu from "@fancy-ds/dropdown-menu";

    export default () => (
      <DropdownMenu trigger="Click to open" triggerType="button" items={[]}>
      </DropdownMenu>
    );
    `,
    'should not delete items when found it - other library',
  );
});
