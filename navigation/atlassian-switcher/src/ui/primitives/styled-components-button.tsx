import React from 'react';
import Button, {
  CustomThemeButtonProps,
} from '@atlaskit/button/custom-theme-button';

// This is a workaround because React.memo does not play well with styled-components
export default function StyledComponentsButton(props: CustomThemeButtonProps) {
  return <Button {...props} />;
}
