/** @jsx jsx */
import styled from '@emotion/styled';
import * as colors from '@atlaskit/theme/colors';
import { fontFallback } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

type ArticlesListItemWrapperProps = {
  styles: any;
};

export const ArticlesListItemWrapper = styled.a<ArticlesListItemWrapperProps>(
  {
    position: 'relative',
    boxSizing: 'border-box',
    padding: token('space.100', '8px'),
    display: 'block',
    textDecoration: 'none',
    cursor: 'pointer',
    color: token('color.text.subtlest', colors.N200),
    borderRadius: '3px',
    backgroundColor: token('color.background.neutral.subtle', 'transparent'),

    '&:hover, &:focus, &:visited, &:active': {
      textDecoration: 'none',
      outline: 'none',
      outlineOffset: 'none',
    },

    '&:focus': {
      boxShadow: `${token(
        'color.border.focused',
        colors.B100,
      )} 0px 0px 0px 2px inset`,
    },

    '&:hover': {
      backgroundColor: token(
        'color.background.neutral.subtle.hovered',
        colors.N30,
      ),
    },

    '&:active': {
      backgroundColor: token(
        'color.background.neutral.subtle.pressed',
        colors.B50,
      ),
    },
  },
  (props: any) => props.styles,
);

export const ArticlesListItemContainer = styled.div({
  width: '100%',
  whiteSpace: 'nowrap',
  display: 'flex',
});

export const ArticlesListItemTitleSection = styled.div({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
});

export const ArticlesListItemTypeTitle = styled.div({
  font: token('font.body.small', fontFallback.body.small),
  fontWeight: token('font.weight.bold', 'bold'),
  color: token('color.text.subtlest', colors.N200),
});

export const ArticlesListItemLinkIcon = styled.span({
  alignSelf: 'auto',
  paddingInlineStart: token('space.050', '4px'),
  verticalAlign: 'middle',
});

export const ArticlesListItemTitleText = styled.p({
  textDecoration: 'none',
  color: token('color.text', colors.N800),
  font: token('font.heading.xsmall', fontFallback.heading.xsmall),
  display: 'inline-block',
  whiteSpace: 'normal',
  overflow: 'hidden',
  marginBottom: token('space.100', '4px'),
});

export const ArticlesListItemDescription = styled.p({
  display: 'block',
  lineHeight: '20px',
  color: token('color.text.subtle', colors.N400),
  margin: 0,
  paddingBottom: token('space.025', '2px'),
});

export const ArticlesListItemSource = styled.div({
  display: 'flex',
  alignItems: 'center',
  font: token('font.heading.xxsmall', fontFallback.heading.xxsmall),
  color: token('color.text.subtlest', colors.N400A),
  padding: `${token('space.050', '4px')} 0`,
  fontWeight: token('font.weight.bold', 'bold'),
  textTransform: 'uppercase',
});

export const ArticlesListItemTrustFactor = styled.div({
  display: 'flex',
  alignItems: 'center',
  font: token('font.body.small', fontFallback.body.small),
  color: token('color.text.subtlest', colors.N400A),
  paddingTop: token('space.025', '2px'),
});

export const ArticlesListItemViewCount = styled.span({
  paddingRight: token('space.100', '8px'),
});

export const ArticlesListItemHelpfulCount = styled.span({
  display: 'inline-flex',
  paddingRight: token('space.100', '8px'),
});

export const ArticlesListItemLastModified = styled.div({
  font: token('font.body.small', fontFallback.body.small),
  color: token('color.text.subtlest', colors.N400A),
  padding: `${token('space.050', '4px')} 0`,
});
