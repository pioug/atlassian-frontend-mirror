/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import {
	expandIconContainerStyle,
	triggerWrapperStyles,
	triggerWrapperStylesWithPadding,
} from '@atlaskit/editor-common/styles';
import { ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import BoldIcon from '@atlaskit/icon/core/migration/text-bold--editor-bold';
import ChevronDownIcon from '@atlaskit/icon/utility/migration/chevron-down';
import { fg } from '@atlaskit/platform-feature-flags';

type BoldButtonProps = {
	label: string;
	isReducedSpacing: boolean;
	isSelected: boolean;
	isDisabled: boolean;
	'aria-expanded': React.AriaAttributes['aria-expanded'];
	onClick?: (event: React.MouseEvent<HTMLElement>) => void;
	onKeyDown?: (event: React.KeyboardEvent) => void;
};

export const BoldToolbarButton = ({
	label,
	isReducedSpacing,
	isDisabled,
	isSelected,
	'aria-expanded': ariaExpanded,
	onClick,
	onKeyDown,
}: BoldButtonProps) => {
	return (
		<ToolbarButton
			testId={'ak-editor-selection-toolbar-format-text-button'}
			spacing={isReducedSpacing ? 'none' : 'default'}
			disabled={isDisabled}
			selected={isSelected}
			aria-label={label}
			aria-expanded={ariaExpanded}
			aria-haspopup
			title={label}
			onClick={onClick}
			onKeyDown={onKeyDown}
			iconBefore={
				<div
					css={
						// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-registration
						fg('platform-visual-refresh-icons')
							? // eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values
								triggerWrapperStylesWithPadding
							: // eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values
								triggerWrapperStyles
					}
				>
					<BoldIcon color="currentColor" spacing="spacious" label="" />
					{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values */}
					<span css={expandIconContainerStyle}>
						<ChevronDownIcon label="" color="currentColor" LEGACY_margin="0 0 0 -8px" />
					</span>
				</div>
			}
		/>
	);
};
