import React from 'react';
import styled from 'styled-components';
import BoardIcon from '@atlaskit/icon/glyph/board';
import IssueIcon from '@atlaskit/icon/glyph/issue';
import FilterIcon from '@atlaskit/icon/glyph/filter';
import { gridSize } from '@atlaskit/theme';
import { ContentType } from '../model/Result';

const IconWrapper = styled.div`
  width: ${(7 * gridSize()) / 2}px;
  height: ${(7 * gridSize()) / 2}px;
  align-items: center;
  display: flex;
`;

const getIconComponent = (contentType: ContentType) => {
  switch (contentType) {
    case ContentType.JiraIssue:
      return IssueIcon;
    case ContentType.JiraBoard:
      return BoardIcon;
    case ContentType.JiraFilter:
      return FilterIcon;
    default:
      return null;
  }
};

export const getDefaultAvatar = (contentType: ContentType) => {
  const IconComponent = getIconComponent(contentType);
  return IconComponent ? (
    <IconWrapper>
      <IconComponent label={contentType || ''} size="medium" />
    </IconWrapper>
  ) : null;
};
