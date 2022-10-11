/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/core';
import { AnalyticsEvent, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import Button from '@atlaskit/button/standard-button';
import Tooltip from '@atlaskit/tooltip';
import EmojiAddIcon from '@atlaskit/icon/glyph/emoji-add';
import * as styles from './styles';

/**
 * Test id for the tooltip
 */
export const RENDER_TOOLTIP_TRIGGER_TESTID = 'render-tooltip-trigger';

export interface TriggerProps {
  /**
   * Optional Event handler when the button to open the picker is clicked
   * @param e Mouse Dom event
   * @param analyticsEvent atlaskit analytics event payload of the button
   */
  onClick?: (
    e: React.MouseEvent<HTMLElement>,
    analyticsEvent: AnalyticsEvent,
  ) => void;
  /**
   * apply "miniMode" className to the button
   */
  miniMode?: boolean;
  /**
   * Enable/Disable the button to be clickable (defaults to false)
   */
  disabled?: boolean;
  /**
   * Tooltip content for trigger button
   */
  tooltipContent: React.ReactNode;
}

/**
 * Render an emoji button to open the reactions select picker
 */
export const Trigger = React.forwardRef(
  (props: TriggerProps, ref: React.Ref<HTMLButtonElement>) => {
    const { onClick, miniMode, tooltipContent, disabled = false } = props;

    const handleMouseDown = (
      e: React.MouseEvent<HTMLElement>,
      analyticsEvent: UIAnalyticsEvent,
    ) => {
      if (onClick && !disabled) {
        onClick(e, analyticsEvent);
      }
    };

    return (
      <Tooltip
        testId={RENDER_TOOLTIP_TRIGGER_TESTID}
        content={tooltipContent}
        position="top"
      >
        <Button
          css={styles.triggerStyle({ miniMode, disabled })}
          appearance="subtle"
          onClick={handleMouseDown}
          aria-disabled={disabled}
          iconBefore={<EmojiAddIcon size="small" label="Add reaction" />}
          spacing="none"
          ref={ref}
        />
      </Tooltip>
    );
  },
);
