import React, { type ReactNode } from 'react';

import DropdownMenu from '@atlaskit/dropdown-menu';

import { ToolbarDropdownItem } from './ToolbarDropdownItem';

type ToolbarNestedDropdownMenuProps = {
	elemBefore: ReactNode;
	elemAfter: ReactNode;
	text?: string;
	children?: ReactNode;
	isDisabled?: boolean;
	testId?: string;
};

export const ToolbarNestedDropdownMenu = ({
	elemBefore,
	text,
	elemAfter,
	children,
	isDisabled,
	testId,
}: ToolbarNestedDropdownMenuProps) => {
	return (
		<DropdownMenu<HTMLButtonElement>
			placement="right-start"
			trigger={(triggerProps) => (
				<ToolbarDropdownItem
					elemBefore={elemBefore}
					elemAfter={elemAfter}
					isSelected={triggerProps.isSelected}
					onClick={triggerProps.onClick}
					testId={testId}
					triggerRef={triggerProps.triggerRef}
					hasNestedDropdownMenu={true}
					isDisabled={isDisabled}
				>
					{text}
				</ToolbarDropdownItem>
			)}
		>
			{children}
		</DropdownMenu>
	);
};
