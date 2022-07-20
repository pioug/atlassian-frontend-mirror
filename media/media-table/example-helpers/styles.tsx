import { css } from '@emotion/react';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { colors } from '@atlaskit/theme';

export const ROW_HIGHLIGHT_CLASSNAME = 'media-table-row-highlighted';
export const ROW_CLASSNAME = 'media-table-row';

export const exampleWrapperStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;

  .${ROW_HIGHLIGHT_CLASSNAME} {
    background-color: ${colors.Y50};

    &:hover {
      background-color: ${colors.Y75};
    }
  }
`;

export const greenOnHoverStyles = css`
  background-color: red;
  height: 8px;
  width: 8px;

  .${ROW_CLASSNAME}:hover & {
    background-color: green;
  }
`;
