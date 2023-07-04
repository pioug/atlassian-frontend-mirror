/** @jsx jsx */
import { jsx } from '@emotion/react';
import EditIcon from '@atlaskit/icon/glyph/edit';
import { editIconStyles } from './styled';
export const SmallerEditIcon = () => {
  return (
    <div css={editIconStyles}>
      <EditIcon label="edit" />
    </div>
  );
};
