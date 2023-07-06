import { createRenameFuncFor } from '@atlaskit/codemod-utils';

const component = '@atlaskit/textfield';
const from = 'disabled';
const to = 'isDisabled';

export const renameDisabledToIsDisabled = createRenameFuncFor(
  component,
  from,
  to,
);
