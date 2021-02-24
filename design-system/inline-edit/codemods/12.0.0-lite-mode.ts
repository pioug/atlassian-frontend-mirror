import { createTransformer } from '@atlaskit/codemod-utils';

import addCommentsWhenValidateFound from './migrates/add-comments-when-validate-found';
import liftInlineEditableTextField from './migrates/lift-InlineEditableTextField-to-its-entry-point';
import spreadErrorMessage from './migrates/spread-errorMessage-out-of-fieldProps';

const transformer = createTransformer([
  addCommentsWhenValidateFound,
  liftInlineEditableTextField,
  spreadErrorMessage,
]);

export default transformer;
