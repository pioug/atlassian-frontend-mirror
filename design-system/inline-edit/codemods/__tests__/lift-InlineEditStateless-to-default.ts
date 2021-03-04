import { createTransformer } from '@atlaskit/codemod-utils';

import liftInlineEditStatelessToDefault from '../migrates/lift-InlineEditStateless-to-default';

const transformer = createTransformer([liftInlineEditStatelessToDefault]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('lift InlineEditStateless to default', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from "react";
    import { InlineEditableTextfield } from "@atlaskit/inline-edit";

    export default () => (
      <InlineEditableTextfield />
    );
    `,
    `
    import React from "react";
    import { InlineEditableTextfield } from "@atlaskit/inline-edit";

    export default () => (
      <InlineEditableTextfield />
    );
    `,
    'should not do anything other than stateless',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from "react";
    import { InlineEditStateless } from "@atlaskit/inline-edit";

    export default () => (
      <InlineEditStateless />
    );
    `,
    `
    import React from "react";
    import InlineEditStateless from "@atlaskit/inline-edit";

    export default () => (
      <InlineEditStateless />
    );
    `,
    'should lift the stateless to default',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from "react";
    import { InlineEditStateless as InlineEdit } from "@atlaskit/inline-edit";

    export default () => (
      <InlineEdit />
    );
    `,
    `
    import React from "react";
    import InlineEdit from "@atlaskit/inline-edit";

    export default () => (
      <InlineEdit />
    );
    `,
    'should lift the stateless to default with alias',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from "react";
    import { InlineEditableTextfield as InlineEdit } from "@atlaskit/inline-edit";

    export default () => (
      <InlineEdit />
    );
    `,
    `
    import React from "react";
    import { InlineEditableTextfield as InlineEdit } from "@atlaskit/inline-edit";

    export default () => (
      <InlineEdit />
    );
    `,
    'should not lift the InlineEditableTextfield to default with alias',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from "react";
    import InlineEdit, { InlineEditStateless } from "@atlaskit/inline-edit";

    export default () => (
      <Container>
        <InlineEdit />
        <InlineEditStateless />
      </Container>
    );
    `,
    `
    /* TODO: (from codemod) We could not automatically convert this code to the new API.

    This file uses \`InlineEdit\` and \`InlineEditStateless\` at the same time. We've merged these two types since version 12.0.0, and please use the merged version instead.
     */
    import React from "react";
    import InlineEdit, { InlineEditStateless } from "@atlaskit/inline-edit";

    export default () => (
      <Container>
        <InlineEdit />
        <InlineEditStateless />
      </Container>
    );
    `,
    'should add comments when cannot convert',
  );
});
