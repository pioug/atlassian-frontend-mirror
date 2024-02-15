import styled from '@emotion/styled';
import { B400, N200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

// By default buttons will hide overflow and ellipsis content instead of wrapping.
// This basically turns the button back into inline content
export const IconStyledButton = styled.span`
  &&& {
    text-align: initial;
    display: inline;
    vertical-align: baseline;
    border-radius: ${token('border.radius.100', '4px')};
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
    padding: ${token('space.025', '2px')} ${token('space.075', '6px')};
    background-clip: padding-box;
    box-decoration-break: clone;
  }
  > span {
    display: inline;
    overflow: initial;
    text-overflow: initial;
    white-space: initial;
    > span {
      overflow: initial;
      text-overflow: initial;
      white-space: initial;
    }
  }
`;

export const NoLinkAppearance = styled.span`
  color: ${token('color.text.subtlest', N200)};
  margin-left: ${token('space.050', '4px')};
`;

export const LowercaseAppearance = styled.span`
  text-transform: lowercase;
`;

export const LinkAppearance = styled.a`
  color: ${token('color.link', B400)};

  &:hover {
    text-decoration: none;
  }
`;
