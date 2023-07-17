/** @jsx jsx */
import { jsx } from '@emotion/react';

import { editIconStyles } from '@atlaskit/editor-common/styles';
import EditIcon from '@atlaskit/icon/glyph/edit';

/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
export const SmallerEditIcon = () => {
  return (
    <div css={editIconStyles}>
      <EditIcon label="edit" />
    </div>
  );
};
/* eslint-enable @atlaskit/design-system/consistent-css-prop-usage */
