/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type ReactNode, useEffect, useRef, useState } from 'react';

import { jsx } from '@compiled/react';
import invariant from 'tiny-invariant';

import { cssMap } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import StarUnstarredIcon from '@atlaskit/icon/core/star-unstarred';
import { ConfluenceIcon } from '@atlaskit/logo';
import { Main } from '@atlaskit/navigation-system/layout/main';
import { Panel } from '@atlaskit/navigation-system/layout/panel';
import { PanelSplitter } from '@atlaskit/navigation-system/layout/panel-splitter';
import { Root } from '@atlaskit/navigation-system/layout/root';
import {
	SideNav,
	SideNavContent,
	SideNavFooter,
	SideNavToggleButton,
} from '@atlaskit/navigation-system/layout/side-nav';
import { TopNav, TopNavStart } from '@atlaskit/navigation-system/layout/top-nav';
import { AppLogo, AppSwitcher } from '@atlaskit/navigation-system/top-nav-items';
import {
	draggable,
	dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { Stack } from '@atlaskit/primitives/compiled';
import { ButtonMenuItem } from '@atlaskit/side-nav-items/button-menu-item';
import { MenuList } from '@atlaskit/side-nav-items/menu-list';
import { token } from '@atlaskit/tokens';

import { WithResponsiveViewport } from './utils/example-utils'

const headingStyles = cssMap({
	root: {
		paddingInline: token('space.300'),
		paddingBlockStart: token('space.300'),
	},
});

const dropTargetStyles = cssMap({
	root: {
		borderWidth: token('border.width'),
		borderStyle: 'dashed',
		borderColor: token('color.border.accent.purple'),
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
		borderRadius: token('radius.small'),
	},
	isOver: {
		backgroundColor: token('color.background.accent.purple.subtle.hovered'),
	},
});

function DropTarget({ children, testId }: { children: ReactNode; testId: string }) {
	const ref = useRef<HTMLDivElement | null>(null);
	const [state, setState] = useState<'idle' | 'is-over'>('idle');

	useEffect(() => {
		const element = ref.current;
		invariant(element);
		return dropTargetForElements({
			element,
			onDragStart() {
				setState('is-over');
			},
			onDragEnter() {
				setState('is-over');
			},
			onDragLeave() {
				setState('idle');
			},
			onDrop() {
				setState('idle');
			},
		});
	}, []);

	return (
		<div
			data-testid={testId}
			data-state={state}
			css={[dropTargetStyles.root, state === 'is-over' && dropTargetStyles.isOver]}
			ref={ref}
		>
			{children}
		</div>
	);
}

export default function SidebarExample(): JSX.Element {
	const buttonRef = useRef<HTMLButtonElement | null>(null);

	useEffect(() => {
		const button = buttonRef.current;
		invariant(button);
		return draggable({
			element: button,
			onGenerateDragPreview() {
				console.log('preview');
			},
			onDragStart() {
				console.log('dragstart');
			},
		});
	}, []);

	return (
		<WithResponsiveViewport>
			<Root>
				<TopNav>
					<TopNavStart
						sideNavToggleButton={
							<SideNavToggleButton
								testId="side-nav-toggle-button"
								collapseLabel="Collapse sidebar"
								expandLabel="Expand sidebar"
								defaultCollapsed
							/>
						}
					>
						<AppSwitcher label="Switch apps" />
						<AppLogo href="" icon={ConfluenceIcon} name="Confluence" label="Home page" />
					</TopNavStart>
				</TopNav>
				<SideNav defaultCollapsed testId="side-nav">
					<SideNavContent>
						<MenuList>
							<ButtonMenuItem
								ref={buttonRef}
								elemBefore={<StarUnstarredIcon color="currentColor" label="" />}
								testId="draggable-menu-item-button"
							>
								Draggable MenuItemButton
							</ButtonMenuItem>
						</MenuList>
					</SideNavContent>
					<SideNavFooter>
						<DropTarget testId="side-nav-drop-target">Sidebar drop target</DropTarget>
					</SideNavFooter>
					<PanelSplitter label="Resize side nav" />
				</SideNav>
				<Main id="main-container">
					<Stack space="space.100" xcss={headingStyles.root}>
						<Heading size="small">Main</Heading>
					</Stack>
				</Main>
				<Panel>
					<Stack space="space.100" xcss={headingStyles.root}>
						<Heading size="small">Panel</Heading>
						<DropTarget testId="panel-drop-target">Panel drop target</DropTarget>
					</Stack>
				</Panel>
			</Root>
		</WithResponsiveViewport>
	);
}
