import { createRemoveFuncWithDefaultSpecifierFor } from '../utils';

const comment = `
We could not automatically convert this code to the new API.

This file uses \`Tabs\`’s \`component\` prop. This has been removed as part of moving to
a compositional API.

To create a custom tab (replacement for \`Item\` component) refer to the docs at
https://atlassian.design/components/tabs/examples#customizing-tab

To create a custom tab panel (replacement for \`Content\` component) refer to the docs at
https://atlassian.design/components/tabs/examples#customizing-tab-panel
`;

export const removeComponentsProp = createRemoveFuncWithDefaultSpecifierFor(
  '@atlaskit/tabs',
  'components',
  comment,
);
