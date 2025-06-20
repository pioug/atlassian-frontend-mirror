/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useLayoutEffect, useRef } from 'react';

import { cssMap, jsx } from '@compiled/react';

import Heading from '@atlaskit/heading';
import MegaphoneIcon from '@atlaskit/icon/core/megaphone';
import { MenuList } from '@atlaskit/navigation-system';
import { Main } from '@atlaskit/navigation-system/layout/main';
import { Root } from '@atlaskit/navigation-system/layout/root';
import {
	SideNav,
	SideNavContent,
	SideNavFooter,
	SideNavHeader,
	SideNavToggleButton,
} from '@atlaskit/navigation-system/layout/side-nav';
import {
	TopNav,
	TopNavEnd,
	TopNavMiddle,
	TopNavStart,
} from '@atlaskit/navigation-system/layout/top-nav';
import { ButtonMenuItem } from '@atlaskit/navigation-system/side-nav-items/button-menu-item';
import { CreateButton, Settings } from '@atlaskit/navigation-system/top-nav-items';
import { token } from '@atlaskit/tokens';

import { WithResponsiveViewport } from './utils/example-utils';

const headingStyles = cssMap({
	root: {
		paddingInline: token('space.300'),
		paddingBlockStart: token('space.300'),
	},
});

const stickyContentStyles = cssMap({
	root: {
		position: 'sticky',
		insetBlockStart: token('space.0'),
		backgroundColor: token('color.background.accent.blue.subtle'),
		// A z-index is required to ensure the sticky content is rendered above the rest of the side nav content, as they are added to the DOM after the sticky content.
		zIndex: 1,
	},
});

const normalContentStyles = cssMap({
	root: {
		backgroundColor: token('color.background.accent.red.subtle'),
		// Large height is added to simulate a lot of content within the side nav content slot, to ensure we can scroll this element past the sticky content.
		height: '200vh',
	},
});

export function SideNavContentScrollWithStickyVR() {
	return <SideNavContentScrollWithSticky shouldTestScroll />;
}

function SideNavContentScrollWithSticky({
	shouldTestScroll = false,
}: {
	shouldTestScroll?: boolean;
}) {
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	useLayoutEffect(() => {
		if (!shouldTestScroll) {
			return;
		}

		scrollContainerRef.current?.scrollTo({ top: 10000 });
	}, [shouldTestScroll]);

	return (
		<WithResponsiveViewport>
			<Root>
				<TopNav>
					<TopNavStart>
						<SideNavToggleButton
							testId="side-nav-toggle-button"
							collapseLabel="Collapse sidebar"
							expandLabel="Expand sidebar"
						/>
					</TopNavStart>
					<TopNavMiddle>
						<CreateButton>Create</CreateButton>
					</TopNavMiddle>
					<TopNavEnd>
						<Settings label="Settings" />
					</TopNavEnd>
				</TopNav>
				<SideNav>
					<SideNavHeader>
						<Heading size="xsmall">Settings</Heading>
					</SideNavHeader>

					<SideNavContent ref={scrollContainerRef}>
						<div css={stickyContentStyles.root}>Sticky content</div>
						<div
							css={normalContentStyles.root}
							/**
							 * Resolves a11y scanner warnings about scrollable region not being focusable.
							 * Realistic usage would have real focusable content, such as in the composition examples.
							 * Taking a shortcut here because these examples are for VRs and not meant to be realistic content.
							 */
							// eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
							tabIndex={0}
						>
							Normal content
						</div>
					</SideNavContent>

					<SideNavFooter>
						<MenuList>
							<ButtonMenuItem elemBefore={<MegaphoneIcon label="" color="currentColor" />}>
								Give feedback on the new navigation
							</ButtonMenuItem>
						</MenuList>
					</SideNavFooter>
				</SideNav>

				<Main>
					<div css={headingStyles.root}>
						<Heading size="small">Board settings</Heading>
					</div>
				</Main>
			</Root>
		</WithResponsiveViewport>
	);
}

export default SideNavContentScrollWithSticky;
