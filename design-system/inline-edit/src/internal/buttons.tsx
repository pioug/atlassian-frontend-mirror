/** @jsx jsx */

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/standard-button';
import ConfirmIcon from '@atlaskit/icon/glyph/check';
import CancelIcon from '@atlaskit/icon/glyph/cross';
import {
  B400,
  B75,
  DN50A,
  DN60,
  DN60A,
  DN70,
  N0,
  N20A,
  N30A,
  N50A,
  N60A,
} from '@atlaskit/theme/colors';
import { ThemeModes } from '@atlaskit/theme/types';
import { token } from '@atlaskit/tokens';

import { fontSize } from './constants';

const buttonsContainerStyles = css({
  display: 'flex',
  marginTop: token('space.075', '6px'),
  position: 'absolute',
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  top: '100%',
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  right: 0,
  flexShrink: 0,
});

const buttonWrapperElevationDarkStyles = css({
  boxShadow: token(
    'elevation.shadow.overlay',
    `0 4px 8px -2px ${DN50A}, 0 0 1px ${DN60A}`,
  ),
  // These buttons are floating, so they need an override to overlay interaction states
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  '& > button': {
    backgroundColor: token('elevation.surface.overlay', DN70),
  },
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  '& > button:hover': {
    backgroundColor: token('elevation.surface.overlay.hovered', DN60),
  },
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  '& > button:active': {
    backgroundColor: token('elevation.surface.overlay.pressed', B75),
    color: token('color.text', B400),
  },
});

const buttonWrapperElevationLightStyles = css({
  boxShadow: token(
    'elevation.shadow.overlay',
    `0 4px 8px -2px ${N50A}, 0 0 1px ${N60A}`,
  ),
  // These buttons are floating, so they need an override to overlay interaction states
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  '& > button': {
    backgroundColor: token('elevation.surface.overlay', N20A),
  },
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  '& > button:hover': {
    backgroundColor: token('elevation.surface.overlay.hovered', N30A),
  },
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  '& > button:active': {
    backgroundColor: token(
      'elevation.surface.overlay.pressed',
      'rgba(179, 212, 255, 0.6)',
    ),
    color: token('color.text', B400),
  },
});

const buttonWrapperBaseStyles = css({
  boxSizing: 'border-box',
  width: token('space.400', '32px'),
  zIndex: 200,
  backgroundColor: token('elevation.surface.overlay', N0),
  borderRadius: token('border.radius', '3px'),
  fontSize: fontSize,
  '&:last-child': {
    marginLeft: token('space.050', '4px'),
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
