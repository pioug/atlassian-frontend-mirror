/** @jsx jsx */
import {
  FocusEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
} from 'react';

import { css, jsx } from '@emotion/react';

import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import { token } from '@atlaskit/tokens';

import { cssVar } from '../../../constants';

type RemoveButtonProps = {
  'aria-label'?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onFocus?: FocusEventHandler<HTMLButtonElement>;
  onBlur?: FocusEventHandler<HTMLButtonElement>;
  onKeyPress?: KeyboardEventHandler<HTMLButtonElement>;
  onMouseOver?: MouseEventHandler<HTMLButtonElement>;
  onMouseOut?: MouseEventHandler<HTMLButtonElement>;
  testId?: string;
};

const baseStyles = css({
  display: 'flex',
  height: '16px',
  margin: token('space.0', '0px'),
  padding: token('space.0', '0px'),
  position: 'absolute',
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
  right: 0,
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'center',
  appearance: 'none',
  backgroundColor: 'transparent',
  border: 'none',
  borderRadius: `var(${cssVar.borderRadius})`,
  // Once legacy theming is dropped, this can be changed to 'inherit'
  color: `var(${cssVar.color.removeButton.default})`,
  cursor: 'pointer',
  pointerEvents: 'auto',
  '&::-moz-focus-inner': {
    margin: token('space.0', '0px'),
    padding: token('space.0', '0px'),
    border: 0,
  },
  ':hover': {
    // Once legacy theming is dropped, this can be changed to 'cssVar.color.text.default'
    color: `var(${cssVar.color.removeButton.hover})`,
  },
});

const focusRingStyles = css({
  '&:focus': {
    boxShadow: `0 0 0 2px var(${cssVar.color.focusRing}) inset`,
    outline: 'none',
  },
});

const RemoveButton = ({
  'aria-label': ariaLabel,
  onClick,
  onFocus,
  onBlur,
  onKeyPress,
  onMouseOver,
  onMouseOut,
  testId,
}: RemoveButtonProps) => {
  return (
    <button
      css={[baseStyles, focusRingStyles]}
      tabIndex={0}
      aria-label={ariaLabel}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyPress={onKeyPress}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      type="button"
      data-testid={testId}
    >
      <EditorCloseIcon label="close tag" size="small" />
    </button>
  );
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default RemoveButton;
