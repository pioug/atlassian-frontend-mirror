/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@compiled/react';

import DropdownMenu, { type CustomTriggerProps } from '@atlaskit/dropdown-menu';
import { ToolbarButton, ToolbarTooltip } from '@atlaskit/editor-toolbar';

/**
 * A compact dropdown button for paste options, styled like floating toolbar buttons.
 * Renders as a ToolbarButton with an icon and dropdown caret that opens a
 * dropdown menu below. Used when AI actions are not visible and the paste
 * options menu is the only content.
 */
export const PasteOptionsDropdownButton = ({
	children,
	elemBefore,
	elemAfter,
	label,
	testId,
	tooltipContent,
}: {
	children?: React.ReactNode;
	elemAfter: React.ReactNode;
	elemBefore: React.ReactNode;
	label: string;
	testId?: string;
	tooltipContent?: string;
}) => {
	const trigger = useCallback(
		(triggerProps: CustomTriggerProps<HTMLButtonElement>) => {
			const button = (
				<ToolbarButton
					ref={triggerProps.triggerRef}
					isSelected={triggerProps.isSelected}
					aria-expanded={triggerProps['aria-expanded']}
					aria-haspopup={triggerProps['aria-haspopup']}
					onClick={triggerProps.onClick}
					testId={testId}
					iconBefore={elemBefore}
					label={label}
				>
					{elemAfter}
				</ToolbarButton>
			);

			if (tooltipContent) {
				return (
					<ToolbarTooltip content={tooltipContent} position="top">
						{button}
					</ToolbarTooltip>
				);
			}

			return button;
		},
		[testId, elemBefore, elemAfter, label, tooltipContent],
	);

	return (
		<DropdownMenu<HTMLButtonElement> placement="bottom-start" trigger={trigger}>
			{children}
		</DropdownMenu>
	);
};
