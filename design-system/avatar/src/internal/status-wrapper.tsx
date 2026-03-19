/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC } from 'react';

import { cssMap, jsx } from '@compiled/react';

import AvatarStatus, { type StatusProps } from '../status';
import { type AppearanceType, type IndicatorSizeType } from '../types';

const styles = cssMap({
  root: {
    position: 'absolute',
  },
});

const iconSizeMap = cssMap({
  small: {
    height: '12px',
    width: '12px',
  },
  medium: {
    height: '14px',
    width: '14px',
  },
  large: {
    height: '15px',
    width: '15px',
  },
  xlarge: {
    height: '18px',
    width: '18px',
  },
});

const circleIconOffsetMap = cssMap({
  small: { insetInlineEnd: 0, insetBlockStart: 0 },
  medium: { insetInlineEnd: 0, insetBlockStart: 0 },
  large: { insetInlineEnd: '1px', insetBlockStart: '1px' },
  xlarge: { insetInlineEnd: '7px', insetBlockStart: '7px' },
});
const squareIconOffsetMap = cssMap({
  root: { insetInlineEnd: 0, insetBlockStart: 0 },
});
const hexagonIconOffsetMap = cssMap({
  small: { insetInlineEnd: '-1px', insetBlockStart: '-1px' },
  medium: { insetInlineEnd: '-1px', insetBlockStart: '-1px' },
  large: { insetInlineEnd: '-4px', insetBlockStart: '4px' },
  xlarge: { insetInlineEnd: '-5px', insetBlockStart: '17px' },
});

interface StatusWrapperProps extends StatusProps {
  appearance: AppearanceType;
  size: IndicatorSizeType;
  testId?: string;
}

/**
 * __Status wrapper__
 *
 * A status wrapper is used internally to position status on top of the avatar.
 */
const StatusWrapper: FC<StatusWrapperProps> = ({
  size,
  status,
  appearance,
  borderColor,
  children,
  testId,
}) => {
  return (
    <span
      aria-hidden="true"
      data-testid={testId && `${testId}--status`}
      css={[
        styles.root,
        iconSizeMap[size],
        circleIconOffsetMap[size],
        appearance === 'square' && squareIconOffsetMap.root,
        appearance === 'hexagon' && hexagonIconOffsetMap[size],
      ]}
    >
      <AvatarStatus borderColor={borderColor} status={!children ? status : undefined}>
        {children}
      </AvatarStatus>
    </span>
  );
};

export default StatusWrapper;
