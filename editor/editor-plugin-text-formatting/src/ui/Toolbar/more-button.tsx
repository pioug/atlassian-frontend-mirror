/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { triggerWrapperStyles } from '@atlaskit/editor-common/styles';
import { ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/migration/show-more-horizontal--editor-more';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

type MoreButtonProps = {
	'aria-expanded': React.AriaAttributes['aria-expanded'];
	isDisabled: boolean;
	isReducedSpacing: boolean;
	isSelected: boolean;
	label: string;
	onClick?: (event: React.MouseEvent<HTMLElement>) => void;
	onKeyDown?: (event: React.KeyboardEvent) => void;
};

const MoreIconStyle = css({
	display: 'flex',
	alignItems: 'center',
	height: token('space.300', '24px'),
});

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
					// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/platform/ensure-feature-flag-prefix -- Ignored via go/DSP-18766
					<div css={fg('platform-visual-refresh-icons') ? MoreIconStyle : triggerWrapperStyles}>
						{
							<ShowMoreHorizontalIcon
								label=""
								color="currentColor"
								spacing="spacious"
								size="small"
							/>
						}
					</div>
				}
				aria-expanded={ariaExpanded}
				aria-label={label}
				aria-haspopup
			/>
		);
	},
);
