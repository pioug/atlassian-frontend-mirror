/** @jsx jsx */
import { useMemo } from 'react';

import { jsx } from '@emotion/core';

import Button from '@atlaskit/button/standard-button';
import ConfirmIcon from '@atlaskit/icon/glyph/check';
import CancelIcon from '@atlaskit/icon/glyph/cross';
import { ThemeModes } from '@atlaskit/theme/types';

import { buttonsContainerStyles, getButtonStyles } from './styles';

interface ButtonsProp {
  mode: ThemeModes;
  confirmButtonLabel: string;
  cancelButtonLabel: string;
  onMouseDown: () => void;
  onCancelClick: (event: React.MouseEvent<HTMLElement>) => void;
}
const Buttons = ({
  mode,
  confirmButtonLabel,
  cancelButtonLabel,
  onMouseDown,
  onCancelClick,
}: ButtonsProp) => {
  const buttonStyles = useMemo(() => getButtonStyles(mode), [mode]);

  return (
    <div css={buttonsContainerStyles}>
      <Button
        aria-label={confirmButtonLabel}
        type="submit"
        iconBefore={<ConfirmIcon label={confirmButtonLabel} size="small" />}
        shouldFitContainer
        css={buttonStyles}
        onMouseDown={onMouseDown}
      />
      <Button
        aria-label={cancelButtonLabel}
        iconBefore={<CancelIcon label={cancelButtonLabel} size="small" />}
        onClick={onCancelClick}
        shouldFitContainer
        css={buttonStyles}
        onMouseDown={onMouseDown}
      />
    </div>
  );
};

export default Buttons;
