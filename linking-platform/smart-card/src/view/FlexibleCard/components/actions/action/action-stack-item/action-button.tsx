import { xcss } from '@atlaskit/primitives';
import { Box, Inline } from '@atlaskit/primitives';
import Spinner from '@atlaskit/spinner';
import React, { useCallback } from 'react';
import { getPrimitivesInlineSpaceBySize } from '../../../utils';
import ActionIcon from '../action-icon';
import type { ActionStackItemProps } from './types';
import type { TriggerProps } from '@atlaskit/tooltip';
import { token } from '@atlaskit/tokens';

const buttonStyles = xcss({
  all: 'unset',
  cursor: 'pointer',
  padding: 'space.050',
  width: '100%',
  ':focus:not(:focus-visible)': {
    outline: 'none',
  },
  ':focus': {
    outlineColor: 'color.border.focused',
    // xcss outlineOffset does not support space.negative.025
    // @ts-ignore-next-line TS2322: Type "var(--ds-space-negative-025)" is not assignable to type
    outlineOffset: token('space.negative.025'),
    outlineStyle: 'solid',
    outlineWidth: 'border.width.outline',
  },
  ':hover': {
    backgroundColor: 'color.background.neutral.subtle.hovered',
  },
  ':active': {
    backgroundColor: 'color.background.neutral.subtle.pressed',
  },
});

const contentStyles = xcss({
  color: 'color.text',
  // Replace with font token once it becomes stable (currently alpha)
  // font: 'font.body.small',
  fontSize: '12px',
  fontStyle: 'normal',
  fontWeight: '400',
  lineHeight: '20px',
});

const ActionButton = ({
  content,
  icon: iconOption,
  isDisabled,
  isLoading,
  onClick: onClickCallback,
  size,
  space: spaceOption,
  testId,
  tooltipProps,
  xcss,
}: ActionStackItemProps & { tooltipProps?: TriggerProps }) => {
  const space = spaceOption ?? getPrimitivesInlineSpaceBySize(size);

  const onClick = useCallback(() => {
    if (!isDisabled && !isLoading && onClickCallback) {
      onClickCallback();
    }
  }, [isDisabled, isLoading, onClickCallback]);

  const icon =
    iconOption && isLoading ? (
      <ActionIcon
        asStackItemIcon={true}
        icon={<Spinner testId={`${testId}-loading`} />}
        size={size}
      />
    ) : (
      iconOption
    );

  return (
    <Box
      as="button"
      xcss={[buttonStyles, xcss]}
      {...tooltipProps}
      onClick={onClick}
      testId={testId}
    >
      <Inline alignBlock="center" grow="fill" space={space}>
        {icon}
        <Box xcss={contentStyles}>{content}</Box>
      </Inline>
    </Box>
  );
};

export default ActionButton;
