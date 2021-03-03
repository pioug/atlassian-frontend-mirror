import { createTransformer } from '@atlaskit/codemod-utils';

import addCommentsWhenValidateFound from '../migrates/add-comments-when-validate-found';

const transformer = createTransformer([addCommentsWhenValidateFound]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('wrapEditViewWithInlineDialog prop', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from "react";
    import InlineEdit from "@atlaskit/inline-edit";

    export default () => (
      <InlineEdit
        defaultValue={editValue}
        label="Inline edit"
        editView={fieldProps => <Textfield {...fieldProps} autoFocus />}
        readView={() => (
          <ReadViewContainer data-testid="read-view">
            {editValue || 'Click to enter value'}
          </ReadViewContainer>
        )}
        onConfirm={value => setEditValue(value)}
      />
    );
    `,
    `
    import React from "react";
    import InlineEdit from "@atlaskit/inline-edit";

    export default () => (
      <InlineEdit
        defaultValue={editValue}
        label="Inline edit"
        editView={fieldProps => <Textfield {...fieldProps} autoFocus />}
        readView={() => (
          <ReadViewContainer data-testid="read-view">
            {editValue || 'Click to enter value'}
          </ReadViewContainer>
        )}
        onConfirm={value => setEditValue(value)}
      />
    );
    `,
    'should not do anything particular',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from "react";
    import InlineEdit from "@atlaskit/inline-edit";

    export default () => (
      <InlineEdit
        defaultValue={editValue}
        label="Inline edit"
        editView={fieldProps => <Textfield {...fieldProps} autoFocus />}
        readView={() => (
          <ReadViewContainer data-testid="read-view">
            {editValue || 'Click to enter value'}
          </ReadViewContainer>
        )}
        onConfirm={value => setEditValue(value)}
        validate={() => {}}
      />
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

    const MyEditView = (
      <InlineEdit
        editView={({ errorMessage, isInvalid, ...props }) => (
          <InlineDialog content={errorMessage} isOpen={isInvalid}>
            <Textfield {...props} />
          </InlineDialog>
        )}
      />
    );
    \`\`\`
     */
    import React from "react";
    import InlineEdit from "@atlaskit/inline-edit";

    export default () => (
      <InlineEdit
        defaultValue={editValue}
        label="Inline edit"
        editView={fieldProps => <Textfield {...fieldProps} autoFocus />}
        readView={() => (
          <ReadViewContainer data-testid="read-view">
            {editValue || 'Click to enter value'}
          </ReadViewContainer>
        )}
        onConfirm={value => setEditValue(value)}
        validate={() => {}}
      />
    );
    `,
    'add comment when validate function is defined',
  );
});
