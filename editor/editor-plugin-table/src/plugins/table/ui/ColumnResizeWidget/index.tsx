/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';

import Tooltip from '@atlaskit/tooltip';

import { TableCssClassName } from '../../types';
import messages from '../messages';

type Props = {
  startIndex: number;
  endIndex: number;
  includeTooltip?: boolean;
};

export const ColumnResizeWidget: React.FC<Props> = ({
  startIndex,
  endIndex,
  includeTooltip,
}) => {
  const { formatMessage } = useIntl();

  if (!includeTooltip) {
    return (
      <div
        className={TableCssClassName.RESIZE_HANDLE_DECORATION}
        data-start-index={startIndex}
        data-end-index={endIndex}
      />
    );
  }

  return (
    <Tooltip
      content={formatMessage(messages.adjustColumns)}
      hideTooltipOnClick
      hideTooltipOnMouseDown
      position="mouse"
      mousePosition="auto-start"
    >
      {(tooltipProps) => (
        <div
          className={TableCssClassName.RESIZE_HANDLE_DECORATION}
          data-start-index={startIndex}
          data-end-index={endIndex}
          {...tooltipProps}
        />
      )}
    </Tooltip>
  );
};
