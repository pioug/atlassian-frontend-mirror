import { createRemoveFuncWithDefaultSpecifierFor } from '../../utils';

const comment = `
We could not automatically convert this code to the new API.

This file uses \`Lozenge\`’s \`theme\` prop. This has been deprecated and removed. 

You will have to change your usage to use the \`style\` prop.
See the example on https://atlaskit.atlassian.com/examples/design-system/lozenge/with-custom-theme
`;

const removeThemeProp = createRemoveFuncWithDefaultSpecifierFor(
  '@atlaskit/lozenge',
  'theme',
  comment,
);

export default removeThemeProp;
