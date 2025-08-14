import React, { type ReactNode, useCallback } from 'react';

import DropdownMenu, { type OnOpenChangeArgs } from '@atlaskit/dropdown-menu';

import { useToolbarUI } from '../hooks/ui-context';
import { type ToolbarButtonGroupLocation } from '../types';

import { ToolbarButton } from './ToolbarButton';
import { ToolbarDropdownMenuProvider, useToolbarDropdownMenu } from './ToolbarDropdownMenuContext';

type ToolbarDropdownMenuProps = {
	iconBefore: React.ReactNode;
	children?: ReactNode;
	groupLocation?: ToolbarButtonGroupLocation;
	isDisabled?: boolean;
	testId?: string;
	label?: string;
	isOpen?: boolean;
	onOpenChange?: (args: OnOpenChangeArgs) => void;
};

const ToolbarDropdownMenuContent = ({
	iconBefore,
	groupLocation,
	children,
	isDisabled,
	testId,
	label,
}: ToolbarDropdownMenuProps) => {
	const { onDropdownOpenChanged } = useToolbarUI();
	const { closeMenu, isOpen, openMenu } = useToolbarDropdownMenu();

	const handleOpenChange = useCallback(
		(args: OnOpenChangeArgs) => {
			onDropdownOpenChanged(args);
			if (!args.isOpen) {
				closeMenu();
			}
		},
		[closeMenu, onDropdownOpenChanged],
	);

	const handleClick = useCallback(() => {
		if (!isOpen) {
			openMenu();
		} else {
			closeMenu();
		}
	}, [closeMenu, openMenu, isOpen]);

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
					onClick={(e) => {
						handleClick();
						triggerProps.onClick && triggerProps.onClick(e);
					}}
					onFocus={triggerProps.onFocus}
					testId={testId}
					iconBefore={iconBefore}
					groupLocation={groupLocation}
					isDisabled={isDisabled}
					label={label}
				/>
			)}
			onOpenChange={handleOpenChange}
			isOpen={isOpen}
		>
			{children}
		</DropdownMenu>
	);
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
		<ToolbarDropdownMenuProvider>
			<ToolbarDropdownMenuContent
				iconBefore={iconBefore}
				groupLocation={groupLocation}
				isDisabled={isDisabled}
				testId={testId}
				label={label}
			>
				{children}
			</ToolbarDropdownMenuContent>
		</ToolbarDropdownMenuProvider>
	);
};
