/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { N500, B400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import React, { memo } from 'react';
import {
  SlideIn,
  ExitingPersistence,
  mediumDurationMs,
} from '@atlaskit/motion';
// eslint-disable-next-line @atlaskit/design-system/no-banned-imports
import usePreviousValue from '@atlaskit/ds-lib/use-previous-value';

export const counterTestId = 'counter-container';

export const countStyle = css({
  fontSize: 11, // TODO: nice to have a theme level token for fontSize
  color: token('color.text.subtlest', N500),
  overflow: 'hidden',
  position: 'relative',
  padding: '4px 8px 4px 0',
  lineHeight: '14px',
});

export const highlightStyle = css({
  color: token('color.text.selected', B400),
  fontWeight: 600,
});

export const containerStyle = css({
  display: 'flex',
  flexDirection: 'column',
});

export type Props = {
  value: number;
  highlight?: boolean;
  limit?: number;
  overLimitLabel?: string;
  className?: string;
  animationDuration?: number;
};

export const Counter: React.FC<Props> = memo(
  ({
    highlight = false,
    limit = 100,
    overLimitLabel = '99+',
    className,
    value,
    animationDuration = mediumDurationMs,
  }) => {
    const hasReachedLimit = (value: number) => limit && value >= limit;

    const getLabel = (value: number): string => {
      if (hasReachedLimit(value)) {
        return overLimitLabel || '';
      } else if (value === 0) {
        return '';
      } else {
        return value.toString();
      }
    };

    const previousValue = usePreviousValue(value);
    const label = getLabel(value);
    const increase = previousValue ? previousValue < value : false;

    return (
      <div
        className={className}
        css={countStyle}
        style={{ width: label.length * 7 }}
      >
        <ExitingPersistence>
          <SlideIn
            enterFrom={increase ? 'bottom' : 'top'}
            key={value}
            duration={animationDuration}
          >
            {(motion, direction) => (
              <div
                ref={motion.ref}
                css={[
                  containerStyle,
                  css({
                    position: direction === 'exiting' ? 'absolute' : undefined,
                  }),
                ]}
                className={motion.className}
                data-testid={counterTestId}
              >
                <div css={highlight && highlightStyle} key={value}>
                  {label}
                </div>
              </div>
            )}
          </SlideIn>
        </ExitingPersistence>
      </div>
    );
  },
);
