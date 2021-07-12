/** @jsx jsx */
import styled from '@emotion/styled';
import { fontSize, fontSizeSmall, gridSize } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';
export const WhatsNewTypeTitle = styled.span`
  text-decoration: none;
  color: ${colors.N300};
  font-size: ${fontSize()}px;
  vertical-align: middle;
  padding-left: ${gridSize() / 2}px;
  line-height: ${gridSize() * 2.5}px;
  white-space: normal;
  overflow-x: hidden;
`;

export const WhatsNewIconContainer = styled.div`
  display: block;
  padding-bottom: ${gridSize()}px;
`;

export const WhatsNewTitleText = styled.span`
  text-decoration: none;
  color: ${colors.N800};
  font-size: ${fontSize()}px;
  font-weight: 600;
  white-space: normal;
  overflow-x: hidden;
  padding-bottom: ${gridSize()}px;
  display: block;
`;

export const WhatsNewRelatedLinksTitleText = styled.span`
  text-decoration: none;
  color: ${colors.N800};
  font-size: ${fontSizeSmall()}px;
  font-weight: 600;
  white-space: normal;
  overflow-x: hidden;
  padding-bottom: ${gridSize()}px;
  display: block;
`;

export const RelatedLinkContainer = styled.div`
  margin-bottom: ${gridSize()}px;
`;

export const ExternalLinkIconContainer = styled.div`
  display: inline-block;
  vertical-align: middle;
  padding-left: ${gridSize() / 2}px;
`;
