import { createRemoveFuncFor } from '../utils';

export const removeFullWidth = createRemoveFuncFor(
  '@atlaskit/checkbox',
  'Checkbox',
  'isFullWidth',
);

export const removeOverrides = createRemoveFuncFor(
  '@atlaskit/checkbox',
  'Checkbox',
  'overrides',
  `This file uses the @atlaskit/checkbox \`overrides\` prop
  which has now been removed due to its poor performance characteristics. We have not
  replaced overrides with an equivalent API and the overrides pattern exposes internal
  implementation detail as public API and makes it harder for you to upgrade. The appearance
  of Checkbox will have likely changed.`,
);

export const removeTheme = createRemoveFuncFor(
  '@atlaskit/checkbox',
  'Checkbox',
  'theme',
  `This file uses the @atlaskit/checkbox \`theme\` prop which
  has now been removed due to its poor performance characteristics. We have not replaced
  theme with an equivalent API due to minimal usage of the \`theme\` prop. However if you
  were using theme to customise the size of the checkbox there is now a \`size\` prop.
  The appearance of Checkbox will have likely changed.`,
);
