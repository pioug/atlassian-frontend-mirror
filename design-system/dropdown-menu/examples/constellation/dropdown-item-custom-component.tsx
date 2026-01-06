import React, { forwardRef } from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';

// CustomComponent should be wrapped in `forwardRef` to avoid accessibility issues when controlling keyboard focus.
const CustomComponentLink: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<React.PropsWithChildren<{}>> & React.RefAttributes<HTMLAnchorElement>
> = forwardRef<HTMLAnchorElement, React.PropsWithChildren<{}>>(({ children, ...props }, ref) => (
	// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
	<a {...props} ref={ref}>
		{children}
	</a>
));

// CustomComponent should be wrapped in `forwardRef` to avoid accessibility issues when controlling keyboard focus.
const CustomComponentButton: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<React.PropsWithChildren<{}>> & React.RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, React.PropsWithChildren<{}>>(({ children, ...props }, ref) => (
	<button type="button" {...props} ref={ref}>
		{children}
	</button>
));

const DropdownItemDescriptionExample = (): React.JSX.Element => {
	return (
		<DropdownMenu trigger="Page actions" shouldRenderToParent>
			<DropdownItemGroup>
				<DropdownItem
					href="#test"
					// @ts-expect-error - Added during @types/react@~18.3.24 upgrade.
					component={CustomComponentLink}
				>
					Edit
				</DropdownItem>
				<DropdownItem
					onClick={() => console.log('button click')}
					// @ts-expect-error - Added during @types/react@~18.3.24 upgrade.
					component={CustomComponentButton}
				>
					Move
				</DropdownItem>
				<DropdownItem>Clone</DropdownItem>
				<DropdownItem>Delete</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	);
};

export default DropdownItemDescriptionExample;
