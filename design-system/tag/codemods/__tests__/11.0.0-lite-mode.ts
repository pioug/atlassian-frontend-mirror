jest.autoMockOff();

import transformer from '../11.0.0-lite-mode';

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('Update isRemovable prop', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
      import React from "react";
      import AKTag, { TagColor } from "@atlaskit/tag";

      export default () => <AKTag text="Removable button" removeButtonText="Remove" />;
    `,
    `
      import React from "react";
      import AKTag from "@atlaskit/tag/removable-tag";
      import { TagColor } from "@atlaskit/tag";

      export default () => <AKTag text="Removable button" isRemovable removeButtonLabel="Remove" />;
    `,
    'should apply all 3 migrates',
  );
});
