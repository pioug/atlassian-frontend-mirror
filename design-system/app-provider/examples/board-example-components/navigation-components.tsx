/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type JSX, useState } from 'react';

import { jsx } from '@compiled/react';

import IconButton from '@atlaskit/button/icon/button';
import { cssMap } from '@atlaskit/css';
import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';
import EyeOpenStrikethroughIcon from '@atlaskit/icon/core/eye-open-strikethrough';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/show-more-horizontal';
import Image from '@atlaskit/image/image';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';

const iconWrapperStyles = cssMap({
	root: {
		width: '16px',
		height: '16px',
		borderRadius: token('radius.small'),
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
});

/**
 * Icon wrapper component for project menu items
 */
export const ProjectIconWrapper = ({
	color,
	imageUrl,
}: {
	color: string;
	imageUrl: string;
}): JSX.Element => (
	<Box
		xcss={iconWrapperStyles.root}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
		style={{ backgroundColor: color } as React.CSSProperties}
	>
		<Image src={imageUrl} alt="" width={12} height={12} />
	</Box>
);

/**
 * Dropdown menu component for hiding menu items
 * Closes when the dropdown closes and cursor is no longer over the element
 */
export const HideMenuDropdown = (): JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<DropdownMenu
			shouldRenderToParent
			isOpen={isOpen}
			onOpenChange={({ isOpen: newIsOpen }) => setIsOpen(newIsOpen)}
			trigger={({ triggerRef, ...props }) => (
				<IconButton
					ref={triggerRef}
					{...props}
					spacing="compact"
					appearance="subtle"
					label="More options"
					icon={(iconProps) => <ShowMoreHorizontalIcon {...iconProps} size="small" />}
				/>
			)}
			placement="right-start"
		>
			<DropdownItemGroup>
				<DropdownItem elemBefore={<EyeOpenStrikethroughIcon label="" />}>Hide</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	);
};
