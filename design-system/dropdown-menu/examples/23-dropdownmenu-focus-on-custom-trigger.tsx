import React, { forwardRef, useCallback, useRef } from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import mergeRefs from '@atlaskit/ds-lib/merge-refs';

const CustomComponent = forwardRef<HTMLButtonElement, React.PropsWithChildren<{}>>(
	({ children, ...props }, ref) => (
		<button {...props} type="button" role="menuitem" ref={ref}>
			{children}
		</button>
	),
);

export default () => {
	const triggerRef = useRef<HTMLButtonElement>(null);

	const handleDropdownItemClick = useCallback(
		(
			originalOnClick?: (event: React.MouseEvent<Element> | React.KeyboardEvent<Element>) => void,
		) => {
			return (event: React.MouseEvent<Element> | React.KeyboardEvent<Element>) => {
				if (originalOnClick) {
					originalOnClick(event);
				}

				if (triggerRef.current) {
					triggerRef.current.focus();
				}
			};
		},
		[triggerRef],
	);

	return (
		<DropdownMenu
			trigger={(props) => (
				<button type="button" ref={mergeRefs([props.triggerRef, triggerRef])} {...props}>
					Page actions
				</button>
			)}
			onOpenChange={(e) => console.log('dropdown opened', e)}
			testId="dropdown"
			shouldRenderToParent
		>
			<DropdownItemGroup>
				<DropdownItem
					component={CustomComponent}
					onClick={handleDropdownItemClick(() => console.log('Move clicked'))}
				>
					Move
				</DropdownItem>
				<DropdownItem onClick={handleDropdownItemClick(() => console.log('Clone clicked'))}>
					Clone
				</DropdownItem>
				<DropdownItem onClick={handleDropdownItemClick(() => console.log('Delete clicked'))}>
					Delete
				</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	);
};
