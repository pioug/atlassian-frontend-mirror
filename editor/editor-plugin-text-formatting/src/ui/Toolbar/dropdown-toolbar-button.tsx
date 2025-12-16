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
	disableBlueBorderStyles,
} from '@atlaskit/editor-common/styles';
import { ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import ChevronDownIcon from '@atlaskit/icon/core/migration/chevron-down';
import ItalicIcon from '@atlaskit/icon/core/text-italic';
import { fg } from '@atlaskit/platform-feature-flags';

import { ToolbarType } from './types';

type DropdownButtonProps = {
	activeIconName?: string;
	'aria-expanded': React.AriaAttributes['aria-expanded'];
	iconBefore?: React.ReactElement;
	isDisabled: boolean;
	isReducedSpacing: boolean;
	isSelected: boolean;
	label: string;
	onClick?: (event: React.MouseEvent<HTMLElement>) => void;
	onKeyDown?: (event: React.KeyboardEvent) => void;
	toolbarType: ToolbarType;
};

export const DropdownToolbarButton = ({
	label,
	isReducedSpacing,
	isDisabled,
	isSelected,
	'aria-expanded': ariaExpanded,
	onClick,
	onKeyDown,
	toolbarType,
	iconBefore,
	activeIconName,
}: DropdownButtonProps) => {
	const reducedSpacing = toolbarType === ToolbarType.FLOATING ? 'compact' : 'none';

	return (
		<ToolbarButton
			// eslint-disable-next-line @atlaskit/design-system/no-unsafe-style-overrides, @atlaskit/ui-styling-standard/no-imported-style-values
			css={disableBlueBorderStyles}
			testId={'ak-editor-selection-toolbar-format-text-button'}
			spacing={isReducedSpacing ? reducedSpacing : 'default'}
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
						fg('platform-visual-refresh-icons')
							? // eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values
								triggerWrapperStylesWithPadding
							: // eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values
								triggerWrapperStyles
					}
					data-testid={activeIconName ? `editor-toolbar__${activeIconName}` : undefined}
				>
					{iconBefore ? (
						iconBefore
					) : (
						<ItalicIcon color="currentColor" spacing="spacious" label="" />
					)}
					{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values */}
					<span css={expandIconContainerStyle}>
						<ChevronDownIcon
							label=""
							color="currentColor"
							LEGACY_margin="0 0 0 -8px"
							size="small"
						/>
					</span>
				</div>
			}
		/>
	);
};
