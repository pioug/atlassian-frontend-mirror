// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
jest.autoMockOff();

import { createTransformer } from '@atlaskit/codemod-utils';

import replacePositionToPlacement from '../migrates/replace-position-to-placement';

const transformer = createTransformer([replacePositionToPlacement]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('replace position to placement', () => {
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
    'should not change anything when position is not used',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from "react";
    import DropdownMenu from "@material/dropdown-menu";

    export default () => (
      <DropdownMenu trigger="Click to open" triggerType="button" position="top left">
      </DropdownMenu>
    );
    `,
    `
    import React from "react";
    import DropdownMenu from "@material/dropdown-menu";

    export default () => (
      <DropdownMenu trigger="Click to open" triggerType="button" position="top left">
      </DropdownMenu>
    );
    `,
    'should not change position if the package is not from atlassian design system',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from "react";
    import DropdownMenu from "@atlaskit/dropdown-menu";

    export default () => (
      <DropdownMenu trigger="Click to open" triggerType="button" position="top left">
      </DropdownMenu>
    );
    `,
    `
    import React from "react";
    import DropdownMenu from "@atlaskit/dropdown-menu";

    export default () => (
      <DropdownMenu trigger="Click to open" triggerType="button" placement="top-start">
      </DropdownMenu>
    );
    `,
    'should change position to placement and its value to align with enums defined in popper',
  );
});
