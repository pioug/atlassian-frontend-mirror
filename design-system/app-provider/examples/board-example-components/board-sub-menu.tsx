/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import type { JSX } from 'react';

import { jsx } from '@compiled/react';

import AvatarGroup from '@atlaskit/avatar-group/avatar-group';
import Button from '@atlaskit/button/default/button';
import IconButton from '@atlaskit/button/icon/button';
import { cssMap } from '@atlaskit/css';
import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';
import ChartTrendUpIcon from '@atlaskit/icon/core/chart-trend-up';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import CustomizeIcon from '@atlaskit/icon/core/customize';
import FilterIcon from '@atlaskit/icon/core/filter';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/show-more-horizontal';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @repo/internal/import/no-unresolved
import { AVATAR_DATA } from './constants';
import { MockSearch } from './mock-search';

const subMenuStyles = cssMap({
	subMenu: {
		paddingInline: token('space.200'),
		paddingBlock: token('space.150'),
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		gap: token('space.300'),
		position: 'relative',
		zIndex: 1,
	},
	subMenuRight: {
		display: 'flex',
		alignItems: 'center',
		gap: token('space.150'),
	},
	searchField: {
		flex: 1,
		minWidth: '0px',
		position: 'relative',
	},
	controlsGroup: {
		display: 'flex',
		alignItems: 'center',
		backgroundColor: token('color.background.neutral'),
		borderRadius: token('radius.medium'),
		overflow: 'hidden',
	},
});

export const BoardSubMenu = (): JSX.Element => (
	<Box xcss={subMenuStyles.subMenu}>
		<Inline space="space.150" alignBlock="center">
			<Box xcss={subMenuStyles.searchField}>
				<MockSearch size={200} />
			</Box>
			<AvatarGroup appearance="stack" size="small" maxCount={4} data={AVATAR_DATA} />
			<DropdownMenu
				shouldRenderToParent
				trigger={({ triggerRef, ...props }) => (
					<Button
						ref={triggerRef}
						{...props}
						iconBefore={FilterIcon}
						iconAfter={() => <ChevronDownIcon label="" size="small" />}
					>
						Filter
					</Button>
				)}
			>
				<DropdownItemGroup>
					<DropdownItem>Status</DropdownItem>
					<DropdownItem>Assignee</DropdownItem>
					<DropdownItem>Priority</DropdownItem>
					<DropdownItem>Labels</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>
		</Inline>
		<Box xcss={subMenuStyles.subMenuRight}>
			<Box xcss={subMenuStyles.controlsGroup}>
				<IconButton icon={ChartTrendUpIcon} label="Chart" appearance="subtle" />
				<IconButton icon={CustomizeIcon} label="Customize" appearance="subtle" />
				<IconButton icon={ShowMoreHorizontalIcon} label="More" appearance="subtle" />
			</Box>
			<Button>Complete sprint</Button>
		</Box>
	</Box>
);
