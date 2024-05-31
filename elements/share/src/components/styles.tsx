import React from 'react';

import Button from '@atlaskit/button/custom-theme-button';
import { type CustomThemeButtonProps } from '@atlaskit/button/types';

export const MAX_PICKER_HEIGHT = 102;

const StyledButton = React.forwardRef<HTMLElement, CustomThemeButtonProps>(
  (props, ref) => (
    // TODO: (from codemod) CustomThemeButton will be deprecated. Please consider migrating to Pressable or Anchor Primitives with custom styles.
    <Button ref={ref} {...props} />
  ),
);

export default StyledButton;
