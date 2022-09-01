/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/core';
import {
  SlideIn,
  ExitingPersistence,
  mediumDurationMs,
} from '@atlaskit/motion';
// eslint-disable-next-line @atlaskit/design-system/no-banned-imports
import usePreviousValue from '@atlaskit/ds-lib/use-previous-value';
import * as styles from './styles';

/**
 * Test id for wrapper div
 */
export const RENDER_COUNTER_TESTID = 'counter-container';

/**
 * Test id for container div
 */
export const RENDER_COUNTER_WRAPPER_TESTID = 'counter-wrapper';

export interface CounterProps {
  /**
   * Count of emoji been selected
   */
  value: number;
  /**
   * Has the emoji been selected by given user (defaults to false)
   */
  highlight?: boolean;
  /**
   * Max threshold of selections to show before having a label (defaults to 1000)
   */
  limit?: number;
  /**
   * Label to show when the value surpasses the limit value (defaults to "1k+")
   */
  overLimitLabel?: string;
  /**
   * Optional wrapper class name
   */
  className?: string;
  /**
   * Duration in ms of how long the motion will take (defaults to "mediumDurationMs" from '@atlaskit/motion')
   */
  animationDuration?: number;
}

/**
 * Display reaction count next to the emoji button
 */
export const Counter: React.FC<CounterProps> = ({
  highlight = false,
  limit = 1000,
  overLimitLabel = '1k+',
  className,
  value,
  animationDuration = mediumDurationMs,
}) => {
  const hasReachedLimit = (value: number) => limit && value >= limit;

  const getLabel = (value: number) => {
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
      data-testid={RENDER_COUNTER_WRAPPER_TESTID}
      css={[styles.countStyle, { width: label.length * 7 }]}
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
                styles.containerStyle,
                css({
                  position: direction === 'exiting' ? 'absolute' : undefined,
                }),
              ]}
              className={motion.className}
              data-testid={RENDER_COUNTER_TESTID}
            >
              <div css={highlight && styles.highlightStyle} key={value}>
                {label}
              </div>
            </div>
          )}
        </SlideIn>
      </ExitingPersistence>
    </div>
  );
};
