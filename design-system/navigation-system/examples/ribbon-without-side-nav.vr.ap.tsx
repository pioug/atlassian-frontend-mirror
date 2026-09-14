/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';

import { cssMap, jsx } from '@compiled/react';

import { CustomerServiceManagementIcon } from '@atlaskit/logo';
import { UNSAFE_Ribbon as Ribbon } from '@atlaskit/navigation-system/experimental/ribbon';
import {
	Main,
	UNSAFE_MAIN_BLOCK_START_FOR_LEGACY_PAGES_ONLY,
	UNSAFE_MAIN_INLINE_START_FOR_LEGACY_PAGES_ONLY,
} from '@atlaskit/navigation-system/layout/main';
import { Root } from '@atlaskit/navigation-system/layout/root';
import {
	TopNav,
	TopNavEnd,
	TopNavMiddle,
	TopNavStart,
} from '@atlaskit/navigation-system/layout/top-nav';
import {
	AppLogo,
	AppSwitcher,
	CreateButton,
	Help,
	Profile,
	Settings,
} from '@atlaskit/navigation-system/top-nav-items';
import { Show, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { WithResponsiveViewport } from './utils/example-utils';
import { MockRibbon } from './utils/mock-ribbon';
import { MockSearch } from './utils/mock-search';

const fixedHeaderStyles = cssMap({
	root: {
		position: 'fixed',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		insetBlockStart: UNSAFE_MAIN_BLOCK_START_FOR_LEGACY_PAGES_ONLY,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		insetInlineStart: UNSAFE_MAIN_INLINE_START_FOR_LEGACY_PAGES_ONLY,
		insetInlineEnd: 0,
		height: 64,
		borderBlockEndColor: token('color.border'),
		borderBlockEndWidth: token('border.width'),
		borderBlockEndStyle: 'solid',
		backgroundColor: token('elevation.surface'),
		display: 'flex',
		alignItems: 'center',
		paddingInline: token('space.200'),
		color: token('color.text.subtle'),
		gap: token('space.075'),
		boxSizing: 'border-box',
	},
});

export default function RibbonWithoutSideNavExample(): React.JSX.Element {
	return (
		<WithResponsiveViewport>
			<Root UNSAFE_dangerouslyHoistSlotSizes>
				<Ribbon width="4rem">
					<MockRibbon />
				</Ribbon>
				<TopNav>
					<TopNavStart sideNavToggleButton={null}>
						<Show below="md">
							<AppSwitcher label="Switch apps" />
						</Show>
						<AppLogo
							href=""
							icon={CustomerServiceManagementIcon}
							name="Customer Service Management"
							label="Home page"
						/>
					</TopNavStart>
					<TopNavMiddle>
						<MockSearch />
						<CreateButton>Create</CreateButton>
					</TopNavMiddle>
					<TopNavEnd>
						<Help label="Help" />
						<Settings label="Settings" />
						<Profile label="Profile" />
					</TopNavEnd>
				</TopNav>
				<Main>
					<div css={fixedHeaderStyles.root}>
						<Text size="medium" weight="medium">
							Header using legacy CSS variables for fixed positioning
						</Text>
					</div>
				</Main>
			</Root>
		</WithResponsiveViewport>
	);
}
