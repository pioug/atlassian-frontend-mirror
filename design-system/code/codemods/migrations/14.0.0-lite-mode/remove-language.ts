import { createRemoveFuncFor } from '../../utils/helpers';

const comment = `
We could not automatically convert this code to the new API.

This file uses \`Code\`’s \`language\` prop. The support for syntax highlighting has
been removed to make \`Code\` lighter, quicker and more composable. If you need syntax
highlighting it is still available in \`CodeBlock\`.
`;

const removeLanguageProp = createRemoveFuncFor(
  '@atlaskit/code',
  'Code',
  'language',
  comment,
);

export default removeLanguageProp;
