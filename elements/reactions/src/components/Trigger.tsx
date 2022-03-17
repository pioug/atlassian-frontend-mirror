/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import Button from '@atlaskit/button/standard-button';
import EmojiAddIcon from '@atlaskit/icon/glyph/emoji-add';
import React from 'react';

export interface Props {
  onClick: Function;
  miniMode?: boolean;
  disabled?: boolean;
}

const triggerStyle = css({
  width: '32px',
  height: '32px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  lineHeight: '16px',

  '&.miniMode': {
    width: '24px',
    height: '24px',
  },
});

export const Trigger = React.forwardRef(
  (props: Props, ref: React.Ref<HTMLButtonElement>) => {
    const { miniMode, disabled = false } = props;

    const handleMouseDown = () => {
      if (props.onClick) {
        props.onClick();
      }
    };

    return (
      <Button
        className={miniMode ? 'miniMode' : ''}
        css={triggerStyle}
        appearance="subtle"
        onClick={handleMouseDown}
        isDisabled={disabled}
        iconBefore={<EmojiAddIcon size="small" label="Add reaction" />}
        spacing="none"
        ref={ref}
      ></Button>
    );
  },
);
