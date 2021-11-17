// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
jest.autoMockOff();

import { createTransformer } from '@atlaskit/codemod-utils';

import deprecateShouldFitContainer from '../migrates/deprecate-shouldFitContainer';

const transformer = createTransformer([deprecateShouldFitContainer]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('delete shouldFitContainer prop', () => {
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
    'should not change anything when shouldFitContainer is not used ',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from "react";
    import DropdownMenu from "@atlaskit/dropdown-menu";

    export default () => (
      <DropdownMenu trigger="Click to open" triggerType="button" shouldFitContainer>
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
    'should delete shouldFitContainer when found it',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from "react";
    import AKDropdownMenu from "@atlaskit/dropdown-menu";

    export default () => (
      <AKDropdownMenu trigger="Click to open" triggerType="button" shouldFitContainer>
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
    'should delete shouldFitContainer when found it - named import',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from "react";
    import DropdownMenu from "@fancy-ds/dropdown-menu";

    export default () => (
      <DropdownMenu trigger="Click to open" triggerType="button" shouldFitContainer>
      </DropdownMenu>
    );
    `,
    `
    import React from "react";
    import DropdownMenu from "@fancy-ds/dropdown-menu";

    export default () => (
      <DropdownMenu trigger="Click to open" triggerType="button" shouldFitContainer>
      </DropdownMenu>
    );
    `,
    'should not delete shouldFitContainer when found it - other library',
  );
});
