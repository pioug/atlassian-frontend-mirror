import { createTransformer } from '@atlaskit/codemod-utils';

import spreadErrorMessage from '../migrates/spread-errorMessage-out-of-fieldProps';

const transformer = createTransformer([spreadErrorMessage]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('spreadErrorMessage prop', () => {
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
        editView={(fieldProps) => <Textfield {...fieldProps} autoFocus />}
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
        editView={(
          {
            errorMessage,
            ...fieldProps
          }
        ) => <Textfield {...fieldProps} autoFocus />}
        readView={() => (
          <ReadViewContainer data-testid="read-view">
            {editValue || 'Click to enter value'}
          </ReadViewContainer>
        )}
        onConfirm={value => setEditValue(value)}
      />
    );
    `,
    'should spread errorMessage out',
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
        editView={props => <Textfield {...props} autoFocus />}
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
        editView={(
          {
            errorMessage,
            ...props
          }
        ) => <Textfield {...props} autoFocus />}
        readView={() => (
          <ReadViewContainer data-testid="read-view">
            {editValue || 'Click to enter value'}
          </ReadViewContainer>
        )}
        onConfirm={value => setEditValue(value)}
      />
    );
    `,
    'should spread errorMessage out - with alias',
  );
});
