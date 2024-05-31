/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';

import { triggerWrapperStyles } from '@atlaskit/editor-common/styles';
import { ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import MoreIcon from '@atlaskit/icon/glyph/editor/more';

type MoreButtonProps = {
	label: string;
	isReducedSpacing: boolean;
	isSelected: boolean;
	isDisabled: boolean;
	'aria-expanded': React.AriaAttributes['aria-expanded'];
	onClick?: (event: React.MouseEvent<HTMLElement>) => void;
	onKeyDown?: (event: React.KeyboardEvent) => void;
};

export const MoreButton = React.memo(
	({
		label,
		'aria-expanded': ariaExpanded,
		isReducedSpacing,
		isSelected,
		isDisabled,
		onClick,
		onKeyDown,
	}: MoreButtonProps) => {
		return (
			<ToolbarButton
				disabled={isDisabled}
				selected={isSelected}
				onClick={onClick}
				onKeyDown={onKeyDown}
				spacing={isReducedSpacing ? 'none' : 'default'}
				title={label}
				iconBefore={
					// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
					<div css={triggerWrapperStyles}>
						<MoreIcon label="" />
					</div>
				}
				aria-expanded={ariaExpanded}
				aria-label={label}
				aria-haspopup
			/>
		);
	},
);
