import { createRemoveFuncWithDefaultSpecifierFor } from '../utils';

const comment = `
We could not automatically convert this code to the new API.

This file uses \`Tabs\`’s \`isSelectedTest\` prop. This has been removed as it is a second way
to make \`Tabs\` controlled and is not needed.

You will have to change your usage of \`tabs\` to use the \`selected\` prop.
This is documented at https:atlassian.design/components/tabs/examples#controlled
`;

export const removeIsSelectedTestProp = createRemoveFuncWithDefaultSpecifierFor(
  '@atlaskit/tabs',
  'isSelectedTest',
  comment,
);
