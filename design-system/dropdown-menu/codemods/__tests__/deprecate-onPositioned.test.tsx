// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
jest.autoMockOff();

import { createTransformer } from '@atlaskit/codemod-utils';

import deprecateOnPositioned from '../migrates/deprecate-onPositioned';

const transformer = createTransformer([deprecateOnPositioned]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('delete onPositioned prop', () => {
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
    'should not change anything when onPositioned is not used ',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from "react";
    import DropdownMenu from "@atlaskit/dropdown-menu";

    export default () => (
      <DropdownMenu trigger="Click to open" triggerType="button" onPositioned={() => {}}>
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
    'should delete onPositioned when found it',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from "react";
    import AKDropdownMenu from "@atlaskit/dropdown-menu";

    export default () => (
      <AKDropdownMenu trigger="Click to open" triggerType="button" onPositioned={() => {}}>
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
    'should delete onPositioned when found it - named import',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from "react";
    import DropdownMenu from "@fancy-ds/dropdown-menu";

    export default () => (
      <DropdownMenu trigger="Click to open" triggerType="button" onPositioned={() => {}}>
      </DropdownMenu>
    );
    `,
    `
    import React from "react";
    import DropdownMenu from "@fancy-ds/dropdown-menu";

    export default () => (
      <DropdownMenu trigger="Click to open" triggerType="button" onPositioned={() => {}}>
      </DropdownMenu>
    );
    `,
    'should not delete onPositioned when found it - other library',
  );
});
