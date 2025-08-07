import React, { type ReactNode } from 'react';

import DropdownMenu from '@atlaskit/dropdown-menu';

import { type ToolbarButtonGroupLocation } from '../types';

import { ToolbarButton } from './ToolbarButton';

type ToolbarDropdownMenuProps = {
	iconBefore: React.ReactNode;
	children?: ReactNode;
	groupLocation?: ToolbarButtonGroupLocation;
	isDisabled?: boolean;
	testId?: string;
	label?: string;
};

export const ToolbarDropdownMenu = ({
	iconBefore,
	groupLocation,
	children,
	isDisabled,
	testId,
	label,
}: ToolbarDropdownMenuProps) => {
	return (
		<DropdownMenu<HTMLButtonElement>
			trigger={(triggerProps) => (
				<ToolbarButton
					ref={triggerProps.triggerRef}
					isSelected={triggerProps.isSelected}
					aria-expanded={triggerProps['aria-expanded']}
					aria-haspopup={triggerProps['aria-haspopup']}
					aria-controls={triggerProps['aria-controls']}
					onBlur={triggerProps.onBlur}
					onClick={triggerProps.onClick}
					onFocus={triggerProps.onFocus}
					testId={testId}
					iconBefore={iconBefore}
					groupLocation={groupLocation}
					isDisabled={isDisabled}
					label={label}
				/>
			)}
		>
			{children}
		</DropdownMenu>
	);
};
