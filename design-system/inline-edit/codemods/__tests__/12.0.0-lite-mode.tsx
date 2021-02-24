import transformer from '../12.0.0-lite-mode';

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('apply all transforms', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from "react";
    import InlineEdit, {InlineEditableTextfield} from "@atlaskit/inline-edit";

    export default () => (
      <Container>
        <InlineEdit
          editView={fieldProps => <Textfield {...fieldProps} autoFocus />}
          validate={() => {}}
        />
        <InlineEditableTextfield />
      </Container>
    );
    `,
    `
    /* TODO: (from codemod) We could not automatically convert this code to the new API.

    This file uses \`inline-edit\`’s \`validate\` prop which previously would use \`react-loadable\` and the \`inline-dialog\` packages. Version 12.0.0 of \`inline-edit\` now no longer includes these dependencies out of the box and instead allows you to compose your own experience.

    If you are using an editable textfield you can move over to the \`@atlaskit/inline-edit/inline-editable-textfield\` instead which comes with the previous error message behavior.

    To migrate you can use the \`isInvalid\` and \`errorMessage\` props passed to \`editView\`, like so:

    \`\`\`ts
    import InlineDialog from '@atlaskit/inline-dialog';
    import InlineEdit from '@atlaskit/inline-edit';

    <InlineEdit
      editView={({ errorMessage, isInvalid, ...props }) => (
        <InlineDialog content={errorMessage} isOpen={isInvalid}>
          <Textfield {...props} />
        </InlineDialog>
      )}
    />
    \`\`\`
     */
    import React from "react";
    import InlineEditableTextfield from "@atlaskit/inline-edit/inline-editable-textfield";
    import InlineEdit from "@atlaskit/inline-edit";

    export default () => (
      <Container>
        <InlineEdit
          editView={(
            {
              errorMessage,
              ...fieldProps
            }
          ) => <Textfield {...fieldProps} autoFocus />}
          validate={() => {}}
        />
        <InlineEditableTextfield />
      </Container>
    );
    `,
    'should switch InlineEditableTextfield to a new entrypoint with default import',
  );
});
