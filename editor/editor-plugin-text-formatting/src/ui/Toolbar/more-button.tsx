/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports
import { css, jsx } from '@emotion/react';

import { ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/show-more-horizontal';
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
	height: token('space.300'),
});

export const MoreButton: React.MemoExoticComponent<(props: MoreButtonProps) => jsx.JSX.Element> =
	React.memo(
		({
			label,
			'aria-expanded': ariaExpanded,
			isReducedSpacing,
			isSelected,
			isDisabled,
			onClick,
			onKeyDown,
		}: MoreButtonProps): jsx.JSX.Element => {
			return (
				<ToolbarButton
					disabled={isDisabled}
					selected={isSelected}
					onClick={onClick}
					onKeyDown={onKeyDown}
					spacing={isReducedSpacing ? 'none' : 'default'}
					title={label}
					iconBefore={
						// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
						<div css={MoreIconStyle}>
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
