/** @jsx jsx */
import styled from '@emotion/styled';
import { fontSize, fontSizeSmall } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const WhatsNewTypeTitle = styled.span`
  text-decoration: none;
  color: ${token('color.text.subtlest', colors.N300)};
  font-size: ${fontSize()}px;
  vertical-align: middle;
  padding-left: ${token('space.050', '4px')};
  line-height: ${token('font.lineHeight.200', '20px')};
  white-space: normal;
  overflow-x: hidden;
`;

export const WhatsNewIconContainer = styled.div`
  display: block;
  padding-bottom: ${token('space.100', '8px')};
`;

export const WhatsNewTitleText = styled.span`
  text-decoration: none;
  color: ${token('color.text', colors.N800)};
  font-size: ${fontSize()}px;
  font-weight: 600;
  white-space: normal;
  overflow-x: hidden;
  padding-bottom: ${token('space.100', '8px')};
  display: block;
`;

export const WhatsNewRelatedLinksTitleText = styled.span`
  text-decoration: none;
  color: ${token('color.text', colors.N800)};
  font-size: ${fontSizeSmall()}px;
  font-weight: 600;
  white-space: normal;
  overflow-x: hidden;
  padding-bottom: ${token('space.100', '8px')};
  display: block;
`;

export const RelatedLinkContainer = styled.div`
  margin-bottom: ${token('space.100', '8px')};
`;

export const ExternalLinkIconContainer = styled.div`
  display: inline-block;
  vertical-align: middle;
  padding-left: ${token('space.050', '4px')};
`;
