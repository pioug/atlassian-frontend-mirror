// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
jest.autoMockOff();

import { createTransformer } from '@atlaskit/codemod-utils';

import replaceShouldAllowMultiline from '../migrates/replace-shouldAllowMultiline';

const transformer = createTransformer([replaceShouldAllowMultiline]);

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
      <DropdownMenu trigger="Click to open" triggerType="button" shouldAllowMultiline>
      </DropdownMenu>
    );
    `,
    `
    import React from "react";
    import DropdownMenu from "@atlaskit/dropdown-menu";

    export default () => (
      <DropdownMenu
        trigger="Click to open"
        triggerType="button"
        shouldTitleWrap
        shouldDescriptionWrap>
      </DropdownMenu>
    );
    `,
    'should replace shouldAllowMultiline with shouldTitleWrap and shouldDescriptionWrap - default value',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from "react";
    import DropdownMenu from "@atlaskit/dropdown-menu";

    export default () => (
      <DropdownMenu trigger="Click to open" triggerType="button" shouldAllowMultiline={false}>
      </DropdownMenu>
    );
    `,
    `
    import React from "react";
    import DropdownMenu from "@atlaskit/dropdown-menu";

    export default () => (
      <DropdownMenu
        trigger="Click to open"
        triggerType="button"
        shouldTitleWrap={false}
        shouldDescriptionWrap={false}>
      </DropdownMenu>
    );
    `,
    'should replace shouldAllowMultiline with shouldTitleWrap and shouldDescriptionWrap - with value',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from "react";
    import DropdownMenu from "@atlaskit/dropdown-menu";

    const flag = false;
    export default () => (
      <DropdownMenu trigger="Click to open" triggerType="button" shouldAllowMultiline={flag}>
      </DropdownMenu>
    );
    `,
    `
    import React from "react";
    import DropdownMenu from "@atlaskit/dropdown-menu";

    const flag = false;
    export default () => (
      <DropdownMenu
        trigger="Click to open"
        triggerType="button"
        shouldTitleWrap={flag}
        shouldDescriptionWrap={flag}>
      </DropdownMenu>
    );
    `,
    'should replace shouldAllowMultiline with shouldTitleWrap and shouldDescriptionWrap - variable',
  );
});
