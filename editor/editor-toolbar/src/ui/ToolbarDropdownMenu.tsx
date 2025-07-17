import React, { type ReactNode } from 'react';

import DropdownMenu from '@atlaskit/dropdown-menu';

import { type IconComponent, type ToolbarButtonGroupLocation } from '../types';

import { ToolbarButton } from './ToolbarButton';

type ToolbarDropdownMenuProps = {
	icon: IconComponent;
	label: string;
	children?: ReactNode;
	groupLocation?: ToolbarButtonGroupLocation;
};

export const ToolbarDropdownMenu = ({
	icon,
	label,
	groupLocation,
	children,
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
					testId={triggerProps.testId}
					icon={icon}
					label={label}
					groupLocation={groupLocation}
				/>
			)}
		>
			{children}
		</DropdownMenu>
	);
};
