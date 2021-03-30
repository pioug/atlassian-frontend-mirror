import Button from '@atlaskit/button/standard-button';
import EmojiAddIcon from '@atlaskit/icon/glyph/emoji-add';
import cx from 'classnames';
import React from 'react';
import { style } from 'typestyle';

export interface Props {
  onClick: Function;
  miniMode?: boolean;
  disabled?: boolean;
}

const triggerStyle = style({
  width: '32px',
  height: '32px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  lineHeight: '16px',
  $nest: {
    '&.miniMode': {
      width: '24px',
      height: '24px',
    },
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

    const classNames = cx(triggerStyle, { miniMode });

    return (
      <Button
        className={classNames}
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
