import { createTransformer } from '@atlaskit/codemod-utils';

import addCommentsWhenValidateFound from './migrates/add-comments-when-validate-found';
import liftInlineEditableTextField from './migrates/lift-InlineEditableTextField-to-its-entry-point';
import elevateComponentToDefault from './migrates/lift-InlineEditStateless-to-default';
import spreadErrorMessage from './migrates/spread-errorMessage-out-of-fieldProps';

const transformer = createTransformer([
  addCommentsWhenValidateFound,
  liftInlineEditableTextField,
  elevateComponentToDefault,
  spreadErrorMessage,
]);

export default transformer;
