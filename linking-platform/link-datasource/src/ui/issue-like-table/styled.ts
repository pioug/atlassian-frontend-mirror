import styled from '@emotion/styled';

import { N40 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const ScrollableContainerHeight = 590;

export const FieldTextFontSize = '14px';

export const Table = styled.table`
  width: 100%;
`;

export const TableHeading = styled.th`
  position: relative;
  line-height: ${token('font.lineHeight.300', '16px')};
  border-right: 0.5px solid ${token('color.border', N40)};
  border-bottom: 2px solid ${token('color.border', N40)};
  height: calc(52px - ${token('space.050', '4px')} * 2 - 2px);
  vertical-align: bottom;

  &.has-column-picker:nth-last-of-type(2) {
    border-right: 0;
  }

  &:first-child {
    padding-left: ${token('space.100', '4px')};
  }

  &:last-child {
    border-right: 0;
  }

  & [data-testid='datasource-header-content--container'] {
    width: 100%;
    padding: ${token('space.100', '4px')} ${token('space.050', '2px')};
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    white-space: normal;
    overflow: hidden;
    max-height: 2.5rem;
    word-wrap: break-word;

    &:hover {
      background: ${token('color.background.input.hovered', '#F7F8F9')};
      border-radius: 3px;
    }
  }
`;
