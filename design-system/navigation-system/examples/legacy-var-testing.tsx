/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type ChangeEvent, useCallback, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import Heading from '@atlaskit/heading';
import { ConfluenceIcon } from '@atlaskit/logo';
import { Aside } from '@atlaskit/navigation-system/layout/aside';
import { Main } from '@atlaskit/navigation-system/layout/main';
import { Panel } from '@atlaskit/navigation-system/layout/panel';
import { PanelSplitter } from '@atlaskit/navigation-system/layout/panel-splitter';
import { Root } from '@atlaskit/navigation-system/layout/root';
import { SideNav, SideNavToggleButton } from '@atlaskit/navigation-system/layout/side-nav';
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
	Search,
	Settings,
} from '@atlaskit/navigation-system/top-nav-items';
import { RadioGroup } from '@atlaskit/radio';
import type { OptionsPropType } from '@atlaskit/radio/types';
import { token } from '@atlaskit/tokens';

const asideStyles = cssMap({
	root: { backgroundColor: token('elevation.surface.sunken') },
	content: {
		paddingTop: token('space.300'),
		paddingRight: token('space.300'),
		paddingBottom: token('space.300'),
		paddingLeft: token('space.300'),
		borderInlineStart: `${token('border.width')} solid ${token('color.border')}`,
		height: '100%',
		boxSizing: 'border-box',
	},
});

const panelStyles = cssMap({
	content: {
		paddingTop: token('space.300'),
		paddingRight: token('space.300'),
		paddingBottom: token('space.300'),
		paddingLeft: token('space.300'),
	},
});

const legacyVarSpyStyles = cssMap({
	root: {
		position: 'fixed',
		height: 48,
		left: 0,
		bottom: 96,
		backgroundColor: token('color.background.accent.blue.bolder'),
		zIndex: 999,
	},
	leftSidebarWidth: {
		width: 'var(--leftSidebarWidth)',
	},
	rightSidebarWidth: {
		width: 'var(--rightSidebarWidth)',
	},
	rightPanelWidth: {
		width: 'var(--rightPanelWidth)',
	},
});

type LegacyVar = 'leftSidebarWidth' | 'rightSidebarWidth' | 'rightPanelWidth';

function LegacyVarSpy({ legacyVar }: { legacyVar: LegacyVar }) {
	return (
		<div
			data-testid="legacy-var-spy"
			css={[legacyVarSpyStyles.root, legacyVarSpyStyles[legacyVar]]}
		/>
	);
}

const legacyVarOptions = [
	{ name: 'legacyVar', value: 'leftSidebarWidth', label: 'SideNav' },
	{ name: 'legacyVar', value: 'rightSidebarWidth', label: 'Aside' },
	{ name: 'legacyVar', value: 'rightPanelWidth', label: 'Panel' },
] as const satisfies OptionsPropType;

export function ResizableSlots() {
	const [legacyVar, setLegacyVar] = useState<LegacyVar>(legacyVarOptions[0].value);

	const handleResizableSlotChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		setLegacyVar(event.target.value as LegacyVar);
	}, []);

	return (
		<Root UNSAFE_dangerouslyHoistSlotSizes>
			<TopNav>
				<TopNavStart>
					<SideNavToggleButton
						testId="side-nav-toggle-button"
						collapseLabel="Collapse sidebar"
						expandLabel="Expand sidebar"
					/>
					<AppSwitcher label="Switch apps" />
					<AppLogo href="" icon={ConfluenceIcon} name="Confluence" label="Home page" />
				</TopNavStart>
				<TopNavMiddle>
					<Search label="Search" />
					<CreateButton>Create</CreateButton>
				</TopNavMiddle>
				<TopNavEnd>
					<Help label="Help" />
					<Settings label="Settings" />
				</TopNavEnd>
			</TopNav>

			{legacyVar === 'leftSidebarWidth' && (
				<SideNav label="Side navigation" defaultWidth={320} id="side-nav" testId="side-nav">
					<Heading size="small">SideNav</Heading>
					<PanelSplitter
						label="Resize sidebar"
						testId="side-nav-slot-panel-splitter" // testId is used in integration tests
					/>
				</SideNav>
			)}

			<Main id="main-container">
				<Heading size="small">Main</Heading>

				<RadioGroup
					options={legacyVarOptions}
					onChange={handleResizableSlotChange}
					value={legacyVar}
				/>

				<LegacyVarSpy legacyVar={legacyVar} />
			</Main>

			{legacyVar === 'rightSidebarWidth' && (
				<Aside xcss={asideStyles.root} defaultWidth={400} id="aside">
					<div css={asideStyles.content}>
						<Heading size="small">Aside</Heading>
					</div>
					<PanelSplitter
						label="Resize aside"
						testId="aside-slot-panel-splitter" // testId is used in integration tests
					/>
				</Aside>
			)}

			{legacyVar === 'rightPanelWidth' && (
				<Panel defaultWidth={350} id="panel" testId="panel">
					<div css={panelStyles.content}>
						<Heading size="small">Panel</Heading>
					</div>
					<PanelSplitter
						label="Resize panel"
						testId="panel-slot-panel-splitter" // testId is used in integration tests
					/>
				</Panel>
			)}
		</Root>
	);
}

export default ResizableSlots;
