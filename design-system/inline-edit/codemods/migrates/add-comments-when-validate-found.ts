import core, { ASTPath, ImportDeclaration } from 'jscodeshift';

import {
  addCommentToStartOfFile,
  getDefaultSpecifierName,
  hasJSXAttributesByName,
} from './utils';

const commentMessage = `We could not automatically convert this code to the new API.

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
`;

const addCommentsWhenValidateFound = (j: core.JSCodeshift, source: any) => {
  const defaultSpecifier = getDefaultSpecifierName(
    j,
    source,
    '@atlaskit/inline-edit',
  );

  if (!defaultSpecifier) {
    return;
  }

  source
    .findJSXElements(defaultSpecifier)
    .forEach((element: ASTPath<ImportDeclaration>) => {
      const isValidateDefined = hasJSXAttributesByName(j, element, 'validate');
      if (isValidateDefined) {
        addCommentToStartOfFile({ j, base: source, message: commentMessage });
      }
    });
};

export default addCommentsWhenValidateFound;
