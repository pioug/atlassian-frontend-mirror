import { createTransformer } from '@atlaskit/codemod-utils';

import liftInlineEditableTextField from '../migrates/lift-InlineEditableTextField-to-its-entry-point';

const transformer = createTransformer([liftInlineEditableTextField]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('lift InlineEditableTextField to its own entry point', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from "react";
    import {InlineEditableTextfield} from "@atlaskit/inline-edit";

    export default () => (
      <InlineEditableTextfield />
    );
    `,
    `
    import React from "react";
    import InlineEditableTextfield from "@atlaskit/inline-edit/inline-editable-textfield";

    export default () => (
      <InlineEditableTextfield />
    );
    `,
    'should switch InlineEditableTextfield to a new entrypoint',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from "react";
    import { InlineEditStateless } from "@atlaskit/inline-edit";

    export default () => (
      <InlineEditableTextfield />
    );
    `,
    `
    import React from "react";
    import { InlineEditStateless } from "@atlaskit/inline-edit";

    export default () => (
      <InlineEditableTextfield />
    );
    `,
    'should not do it to other things',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from "react";
    import InlineEdit, {InlineEditableTextfield} from "@atlaskit/inline-edit";

    export default () => (
      <Container>
        <InlineEdit />
        <InlineEditableTextfield />
      </Container>
    );
    `,
    `
    import React from "react";
    import InlineEditableTextfield from "@atlaskit/inline-edit/inline-editable-textfield";
    import InlineEdit from "@atlaskit/inline-edit";

    export default () => (
      <Container>
        <InlineEdit />
        <InlineEditableTextfield />
      </Container>
    );
    `,
    'should switch InlineEditableTextfield to a new entrypoint with default import',
  );
});
