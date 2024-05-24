import Tooltip from '@atlaskit/tooltip';
import React from 'react';
import type { ActionStackItemProps } from './types';
import ActionButton from './action-button';

const ActionStackItem = ({
  content,
  tooltipMessage,
  tooltipOnHide,
  hideTooltipOnMouseDown,
  hideTooltip,
  ...props
}: ActionStackItemProps) =>
  hideTooltip ? (
    <ActionButton {...props} content={content} />
  ) : (
    <Tooltip
      content={tooltipMessage || content}
      onHide={tooltipOnHide}
      hideTooltipOnMouseDown={hideTooltipOnMouseDown}
    >
      {(tooltipProps) => (
        <ActionButton
          {...props}
          content={content}
          tooltipProps={tooltipProps}
        />
      )}
    </Tooltip>
  );

export default ActionStackItem;
