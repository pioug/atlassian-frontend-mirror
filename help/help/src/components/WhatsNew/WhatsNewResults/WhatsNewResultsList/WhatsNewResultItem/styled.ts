/** @jsx jsx */
import styled from '@emotion/styled';
import { fontSize, fontSizeSmall } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

type WhatsNewResultListItemWrapperProps = {
  styles: any;
};

export const WhatsNewResultListItemWrapper =
  styled.a<WhatsNewResultListItemWrapperProps>(
    {
      position: `relative`,
      boxSizing: `border-box`,
      padding: token('space.100', '8px'),
      display: `block`,
      textDecoration: `none`,
      cursor: `pointer`,
      color: `${token('color.text.subtlest', colors.N200)}`,
      backgroundColor: `${token('color.background.neutral.subtle', colors.N0)}`,
      borderRadius: `3px`,

      '&:hover, &:focus, &:visited, &:active': {
        textDecoration: `none`,
        outline: `none`,
        outlineOffset: `none`,
      },

      '&:focus': {
        boxShadow: `${token(
          'color.border.focused',
          colors.B100,
        )} 0px 0px 0px 2px inset`,
      },

      '&:hover': {
        backgroundColor: `${token(
          'color.background.neutral.subtle.hovered',
          colors.N30,
        )}`,
      },

      '&:active': {
        backgroundColor: `${token(
          'color.background.neutral.subtle.pressed',
          colors.B50,
        )}`,
      },
    },
    (props: any) => props.styles,
  );

export const WhatsNewResultListItemTitleContainer = styled.div`
  width: 100%;
  white-space: nowrap;
  margin-bottom: ${token('space.050', '4px')};
`;

export const WhatsNewResultListItemTitleText = styled.span`
  font-size: ${fontSizeSmall()}px;
  line-height: ${fontSize()}px;
  display: inline-block;
  vertical-align: middle;
  margin: 0;
  padding-left: ${token('space.050', '4px')};
  white-space: normal;
  overflow-x: hidden;
`;

export const WhatsNewResultListItemDescription = styled.p`
  display: block;
  line-height: ${token('font.lineHeight.200', '20px')};
  color: ${token('color.text', colors.N800)};
  margin: 0;
`;
