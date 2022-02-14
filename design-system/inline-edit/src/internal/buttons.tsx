/** @jsx jsx */

import { css, jsx } from '@emotion/core';

import Button from '@atlaskit/button/standard-button';
import ConfirmIcon from '@atlaskit/icon/glyph/check';
import CancelIcon from '@atlaskit/icon/glyph/cross';
import { DN50A, DN60A, N0, N50A, N60A } from '@atlaskit/theme/colors';
import { ThemeModes } from '@atlaskit/theme/types';
import { token } from '@atlaskit/tokens';

import { fontSize, gridSize } from './constants';

const buttonsContainerStyles = css({
  display: 'flex',
  marginTop: gridSize - 2,
  position: 'absolute',
  top: '100%',
  right: 0,
  flexShrink: 0,
});

const buttonWrapperElevationDarkStyles = css({
  boxShadow: token(
    'elevation.shadow.overlay',
    `0 4px 8px -2px ${DN50A}, 0 0 1px ${DN60A}`,
  ),
});

const buttonWrapperElevationLightStyles = css({
  boxShadow: token(
    'elevation.shadow.overlay',
    `0 4px 8px -2px ${N50A}, 0 0 1px ${N60A}`,
  ),
});

const buttonWrapperBaseStyles = css({
  boxSizing: 'border-box',
  width: gridSize * 4,
  zIndex: 200,
  backgroundColor: token('elevation.surface.overlay', N0),
  borderRadius: gridSize / 2 - 1,
  fontSize: fontSize,
  '&:last-child': {
    marginLeft: gridSize / 2,
  },
});

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
  return (
    <div css={buttonsContainerStyles}>
      <div
        css={[
          buttonWrapperBaseStyles,
          mode === 'light'
            ? buttonWrapperElevationLightStyles
            : buttonWrapperElevationDarkStyles,
        ]}
      >
        <Button
          aria-label={confirmButtonLabel}
          type="submit"
          iconBefore={<ConfirmIcon label={confirmButtonLabel} size="small" />}
          shouldFitContainer
          onMouseDown={onMouseDown}
        />
      </div>
      <div
        css={[
          buttonWrapperBaseStyles,
          mode === 'light'
            ? buttonWrapperElevationLightStyles
            : buttonWrapperElevationDarkStyles,
        ]}
      >
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
