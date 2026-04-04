import React, { forwardRef } from 'react';

import { cssMap } from '@atlaskit/css';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import CheckIcon from '@atlaskit/icon/core/check-mark';
import { Flex } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const iconSpacingStyles = cssMap({
	space050: {
		paddingBlock: token('space.050'),
		paddingInline: token('space.050'),
	},
});

// CustomComponent should be wrapped in `forwardRef` to avoid accessibility issues when controlling keyboard focus.
const CustomComponent: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<React.PropsWithChildren<{}>> & React.RefAttributes<HTMLAnchorElement>
> = forwardRef<HTMLAnchorElement, React.PropsWithChildren<{}>>(({ children, ...props }, ref) => (
	// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
	<a {...props} ref={ref}>
		{children}
	</a>
));

export default (): React.JSX.Element => (
	<DropdownMenu trigger="Filter cities" shouldRenderToParent>
		<DropdownItemGroup>
			<DropdownItem>Not visible</DropdownItem>
			<DropdownItem>Adelaide</DropdownItem>
			<DropdownItem href="/hello-there" title="A place west of Sydney">
				Perth
			</DropdownItem>
			<DropdownItem
				href="#test"
				// @ts-expect-error - Added during @types/react@~18.3.24 upgrade.
				component={CustomComponent}
			>
				Custom link component
			</DropdownItem>
			<DropdownItem description="It's a popular destination in Australia">Melbourne</DropdownItem>
			<DropdownItem target="_blank" href="http://atlassian.com" description="Opens in a new window">
				Darwin
			</DropdownItem>
			<DropdownItem description="Sydney, capital of New South Wales and one of Australia's largest cities, is best known for its harbourfront Sydney Opera House, with a distinctive sail-like design. Massive Darling Harbour and the smaller Circular Quay port are hubs of waterside life, with the arched Harbour Bridge and esteemed Royal Botanic Garden nearby. Sydney Tower’s outdoor platform, the Skywalk, offers 360-degree views of the city and suburbs.">
				Sydney, capital of New South Wales and one of Australia's largest cities.
			</DropdownItem>
			<DropdownItem
				elemAfter={
					<Flex xcss={iconSpacingStyles.space050}>
						<CheckIcon label="" />
					</Flex>
				}
			>
				Canberra
			</DropdownItem>
			<DropdownItem
				elemBefore={
					<Flex xcss={iconSpacingStyles.space050}>
						<CheckIcon label="" />
					</Flex>
				}
			>
				Hobart
			</DropdownItem>
			<DropdownItem
				elemBefore={
					<Flex xcss={iconSpacingStyles.space050}>
						<CheckIcon label="" />
					</Flex>
				}
				elemAfter={
					<Flex xcss={iconSpacingStyles.space050}>
						<CheckIcon label="" />
					</Flex>
				}
			>
				Gold Coast
			</DropdownItem>
			<DropdownItem isSelected>Newcastle</DropdownItem>
			<DropdownItem isDisabled>Cairns</DropdownItem>
			<DropdownItem>Brisbane</DropdownItem>
		</DropdownItemGroup>
	</DropdownMenu>
);
