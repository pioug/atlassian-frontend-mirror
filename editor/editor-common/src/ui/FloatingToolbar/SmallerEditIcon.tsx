/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import EditIcon from '@atlaskit/icon/glyph/edit';

const editIconStyles = css`
  width: 20px;
`;

/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
export const SmallerEditIcon = () => {
  return (
    <div css={editIconStyles}>
      <EditIcon label="edit" />
    </div>
  );
};
/* eslint-enable @atlaskit/design-system/consistent-css-prop-usage */
