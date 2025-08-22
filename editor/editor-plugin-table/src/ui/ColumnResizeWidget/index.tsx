/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';

import { startColumnResizing, ToolTipContent } from '@atlaskit/editor-common/keymaps';
import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import Tooltip from '@atlaskit/tooltip';

import { TableCssClassName } from '../../types';

type Props = {
	endIndex: number;
	includeTooltip?: boolean;
	startIndex: number;
};

export const ColumnResizeWidget = ({ startIndex, endIndex, includeTooltip }: Props) => {
	const { formatMessage } = useIntl();

	if (!includeTooltip) {
		return (
			<div
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
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
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className={TableCssClassName.RESIZE_HANDLE_DECORATION}
					data-start-index={startIndex}
					data-end-index={endIndex}
					// Ignored via go/ees005
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...tooltipProps}
				/>
			)}
		</Tooltip>
	);
};
