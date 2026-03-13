import React from 'react';

import Button, { type CustomThemeButtonOwnProps } from '@atlaskit/button/custom-theme-button';
import { type BaseProps, type CustomThemeButtonProps } from '@atlaskit/button/types';

export const MAX_PICKER_HEIGHT = 102;

const StyledButton: React.ForwardRefExoticComponent<
	Omit<BaseProps, 'overlay'> & CustomThemeButtonOwnProps & React.RefAttributes<HTMLElement>
> = React.forwardRef<HTMLElement, CustomThemeButtonProps>((props, ref) => (
	// TODO: (from codemod) CustomThemeButton will be deprecated. Please consider migrating to Pressable or Anchor Primitives with custom styles.
	<Button ref={ref} {...props} />
));

export default StyledButton;
