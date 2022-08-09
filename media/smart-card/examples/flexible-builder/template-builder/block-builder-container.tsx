/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React, { useCallback, useState } from 'react';
import Button from '@atlaskit/button/standard-button';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import DragHandlerIcon from '@atlaskit/icon/glyph/drag-handler';
import { token } from '@atlaskit/tokens';
import { BlockName } from '../constants';

const containerStyles = css`
  border-radius: 0.25rem;
  box-shadow: ${token(
    'elevation.shadow.raised',
    '0px 1px 1px #091E4240, 0px 0px 1px #091E424F',
  )};
  padding: 0.5rem;
`;

const headerStyles = css`
  display: flex;
  align-items: center;

  h5 {
    flex: 2 0 auto;
    margin-top: initial;
  }
`;

const contentStyles = css`
  border-top: 1px solid ${token('color.border', '#091E4224')};
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
`;

const BlockBuilderContainer: React.FC<{
  name: BlockName;
  onRemove: (position: number) => void;
  position: number;
  removable: boolean;
}> = ({ children, name, onRemove, position, removable = true }) => {
  const [open, setOpen] = useState<boolean>(false);
  const handleExpand = useCallback(() => setOpen(!open), [open]);
  const handleOnRemove = useCallback(() => onRemove(position), [
    onRemove,
    position,
  ]);

  return (
    <div css={containerStyles}>
      <div css={headerStyles}>
        <DragHandlerIcon label="" />
        <h5>{name}</h5>
        <Button
          iconBefore={<ChevronDownIcon label="Expand/collapse" />}
          onClick={handleExpand}
          spacing="compact"
        />
      </div>
      {open && (
        <div css={contentStyles}>
          {children}
          {removable && (
            <Button
              shouldFitContainer
              appearance="danger"
              onClick={handleOnRemove}
            >
              Delete
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
export default BlockBuilderContainer;
