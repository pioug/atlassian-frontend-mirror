/** @jsx jsx */
import styled from '@emotion/styled';
import { fontSize, fontSizeSmall } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';
import { fontFallback } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

export const WhatsNewTypeTitle = styled.span({
  textDecoration: 'none',
  color: token('color.text.subtlest', colors.N300),
  font: token('font.body', fontFallback.body.medium),
  verticalAlign: 'middle',
  paddingLeft: token('space.050', '4px'),
  whiteSpace: 'normal',
  overflowX: 'hidden',
});

export const WhatsNewIconContainer = styled.div({
  display: 'block',
  paddingBottom: token('space.100', '8px'),
});

export const WhatsNewTitleText = styled.span({
  textDecoration: 'none',
  color: token('color.text', colors.N800),
  fontSize: `${fontSize()}px`,
  fontWeight: 600,
  whiteSpace: 'normal',
  overflowX: 'hidden',
  paddingBottom: token('space.100', '8px'),
  display: 'block',
});

export const WhatsNewRelatedLinksTitleText = styled.span({
  textDecoration: 'none',
  color: token('color.text', colors.N800),
  fontSize: `${fontSizeSmall()}px`,
  fontWeight: 600,
  whiteSpace: 'normal',
  overflowX: 'hidden',
  paddingBottom: token('space.100', '8px'),
  display: 'block',
});

export const RelatedLinkContainer = styled.div({
  marginBottom: token('space.100', '8px'),
});

export const ExternalLinkIconContainer = styled.div({
  display: 'inline-block',
  verticalAlign: 'middle',
  paddingLeft: token('space.050', '4px'),
});
