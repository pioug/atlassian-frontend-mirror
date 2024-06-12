import React, { forwardRef } from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../../src';

// CustomComponent should be wrapped in `forwardRef` to avoid accessibility issues when controlling keyboard focus.
const CustomComponentLink = forwardRef<HTMLAnchorElement, React.PropsWithChildren<{}>>(
	({ children, ...props }, ref) => (
		<a {...props} ref={ref}>
			{children}
		</a>
	),
);

// CustomComponent should be wrapped in `forwardRef` to avoid accessibility issues when controlling keyboard focus.
const CustomComponentButton = forwardRef<HTMLButtonElement, React.PropsWithChildren<{}>>(
	({ children, ...props }, ref) => (
		<button type="button" {...props} ref={ref}>
			{children}
		</button>
	),
);

const DropdownItemDescriptionExample = () => {
	return (
		<DropdownMenu trigger="Page actions" shouldRenderToParent>
			<DropdownItemGroup>
				<DropdownItem href="#test" component={CustomComponentLink}>
					Edit
				</DropdownItem>
				<DropdownItem onClick={() => console.log('button click')} component={CustomComponentButton}>
					Move
				</DropdownItem>
				<DropdownItem>Clone</DropdownItem>
				<DropdownItem>Delete</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	);
};

export default DropdownItemDescriptionExample;
