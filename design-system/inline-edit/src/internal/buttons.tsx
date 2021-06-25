/** @jsx jsx */
import { useMemo } from 'react';

import { jsx } from '@emotion/core';

import Button from '@atlaskit/button/standard-button';
import ConfirmIcon from '@atlaskit/icon/glyph/check';
import CancelIcon from '@atlaskit/icon/glyph/cross';
import { ThemeModes } from '@atlaskit/theme/types';

import { buttonsContainerStyles, getButtonWrapperStyles } from './styles';

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
  const buttonWrapperStyles = useMemo(() => getButtonWrapperStyles(mode), [
    mode,
  ]);

  return (
    <div css={buttonsContainerStyles}>
      <div css={buttonWrapperStyles}>
        <Button
          aria-label={confirmButtonLabel}
          type="submit"
          iconBefore={<ConfirmIcon label={confirmButtonLabel} size="small" />}
          shouldFitContainer
          onMouseDown={onMouseDown}
        />
      </div>
      <div css={buttonWrapperStyles}>
        <Button
          aria-label={cancelButtonLabel}
          iconBefore={<CancelIcon label={cancelButtonLabel} size="small" />}
          onClick={onCancelClick}
          shouldFitContainer
          onMouseDown={onMouseDown}
        />
      </div>
    </div>
  );
};

export default Buttons;
