/** @jsx jsx */
import { jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';

import {
  startColumnResizing,
  ToolTipContent,
} from '@atlaskit/editor-common/keymaps';
import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import Tooltip from '@atlaskit/tooltip';

import { TableCssClassName } from '../../types';

type Props = {
  startIndex: number;
  endIndex: number;
  includeTooltip?: boolean;
};

export const ColumnResizeWidget = ({
  startIndex,
  endIndex,
  includeTooltip,
}: Props) => {
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
      content={
        <ToolTipContent
          description={formatMessage(messages.adjustColumns)}
          keymap={startColumnResizing}
        />
      }
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
