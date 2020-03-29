import { ComponentType } from 'react';
import { withTheme } from '@atlaskit/theme/components';
import styled from 'styled-components';
import CustomComponentProxy from '../components/CustomComponentProxy';

// This is necessary because we don't know what DOM element the custom component will render.
export default (styles: (props: any) => any) => {
  const StyledCustomComponent = withTheme(
    styled(CustomComponentProxy)`
      &,
      &:hover,
      &:active,
      &:focus {
        ${styles}
      }
    `,
  );
  const StyledButton = withTheme(styled.button`
    ${styles};
  `);
  const StyledLink = withTheme(styled.a`
    a& {
      ${styles};
    }
  `);
  const StyledSpan = withTheme(styled.span`
    ${styles};
  `);

  return function getStyled({
    component,
    href,
    onClick,
  }: {
    component?: ComponentType<any>;
    href?: string;
    onClick?: Function;
    theme?: Function;
  }) {
    let Ret = StyledSpan;

    if (component) {
      Ret = StyledCustomComponent;
    } else if (href) {
      Ret = StyledLink;
    } else if (onClick) {
      Ret = StyledButton;
    }

    return Ret;
  };
};
