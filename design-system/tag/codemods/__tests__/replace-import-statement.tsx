jest.autoMockOff();

import { replaceImportStatement } from '../migrates/replace-import-statements';
import { createTransformer } from '../utils';

const transformer = createTransformer('@atlaskit/tag', [
  replaceImportStatement,
]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('Update entry point for importing', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
      import React from "react";
      import Tag from "@atlaskit/tag";

      export default () => <Tag text="Removable button"/>;
    `,
    `
      import React from "react";
      import Tag from "@atlaskit/tag/removable-tag";

      export default () => <Tag text="Removable button"/>;
    `,
    'should change entry point for importing',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
      import React from "react";
      import Tag, { TagColor } from "@atlaskit/tag";

      export default () => <Tag text="Removable button"/>;
    `,
    `
      import React from "react";
      import Tag from "@atlaskit/tag/removable-tag";
      import { TagColor } from "@atlaskit/tag";

      export default () => <Tag text="Removable button"/>;
    `,
    'should change entry point for importing with multiple import entities',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
      import React from "react";
      import AKTag, { TagColor } from "@atlaskit/tag";

      export default () => <AKTag text="Removable button"/>;
    `,
    `
      import React from "react";
      import AKTag from "@atlaskit/tag/removable-tag";
      import { TagColor } from "@atlaskit/tag";

      export default () => <AKTag text="Removable button"/>;
    `,
    'should change entry point for importing with multiple import entities with alias',
  );
});
