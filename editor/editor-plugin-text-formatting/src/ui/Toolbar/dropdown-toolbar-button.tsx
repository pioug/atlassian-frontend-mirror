/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { type ReactElement } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import {
	expandIconContainerStyle,
	triggerWrapperStyles,
	triggerWrapperStylesWithPadding,
	disableBlueBorderStyles,
} from '@atlaskit/editor-common/styles';
import { ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import ItalicIcon from '@atlaskit/icon/core/migration/text-italic--editor-italic';
import ChevronDownIcon from '@atlaskit/icon/utility/migration/chevron-down';
import { fg } from '@atlaskit/platform-feature-flags';

import { ToolbarType } from './types';

type DropdownButtonProps = {
	label: string;
	isReducedSpacing: boolean;
	isSelected: boolean;
	isDisabled: boolean;
	'aria-expanded': React.AriaAttributes['aria-expanded'];
	onClick?: (event: React.MouseEvent<HTMLElement>) => void;
	onKeyDown?: (event: React.KeyboardEvent) => void;
	toolbarType: ToolbarType;
	iconBefore?: ReactElement;
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
						// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
						fg('platform-visual-refresh-icons')
							? // eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values
								triggerWrapperStylesWithPadding
							: // eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values
								triggerWrapperStyles
					}
				>
					{iconBefore ? (
						iconBefore
					) : (
						<ItalicIcon color="currentColor" spacing="spacious" label="" />
					)}
					{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values */}
					<span css={expandIconContainerStyle}>
						<ChevronDownIcon label="" color="currentColor" LEGACY_margin="0 0 0 -8px" />
					</span>
				</div>
			}
		/>
	);
};
