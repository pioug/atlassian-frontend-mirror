/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ComponentType, useState } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';

import CardEntrance from './benchmarks/01-card-entrance';
import DismissibleCardExit from './benchmarks/02-dismissible-card-exit';
import ExpandableSidePanel from './benchmarks/03-expandable-side-panel';
import RemoveListItem from './benchmarks/04-remove-list-item';
import ReplaceKeyedContent from './benchmarks/05-replace-keyed-content';
import SemanticListItems from './benchmarks/06-semantic-list-items';
import TableRows from './benchmarks/07-table-rows';
import PopupPresence from './benchmarks/08-popup-presence';
import StaggerList from './benchmarks/09-stagger-list';
import StaggerGrid from './benchmarks/10-stagger-grid';
import NotificationList from './benchmarks/11-notification-list';
import AccordionHeight from './benchmarks/12-accordion-height';
import ToolbarWidth from './benchmarks/13-toolbar-width';
import CardDimensions from './benchmarks/14-card-dimensions';
import PersistentSidebar from './benchmarks/15-persistent-sidebar';
import CustomEntryExit from './benchmarks/16-custom-entry-exit';
import ThirdPartyChart from './benchmarks/17-third-party-chart';
import InteractiveTile from './benchmarks/18-interactive-tile';
import ReplayMotion from './benchmarks/19-replay-motion';
import LegacyFadeIn from './benchmarks/20-legacy-fade-in';
import LegacySlideIn from './benchmarks/21-legacy-slide-in';
import LegacyZoomIn from './benchmarks/22-legacy-zoom-in';
import LegacyShrinkOut from './benchmarks/23-legacy-shrink-out';

const benchmarks: { label: string; Component: ComponentType }[] = [
	{ label: '01 · Card entrance', Component: CardEntrance },
	{ label: '02 · Dismissible card exit', Component: DismissibleCardExit },
	{ label: '03 · Expandable side panel', Component: ExpandableSidePanel },
	{ label: '04 · Remove a list item', Component: RemoveListItem },
	{ label: '05 · Replace keyed content', Component: ReplaceKeyedContent },
	{ label: '06 · Semantic list items', Component: SemanticListItems },
	{ label: '07 · Table rows', Component: TableRows },
	{ label: '08 · Popup presence', Component: PopupPresence },
	{ label: '09 · Stagger a list', Component: StaggerList },
	{ label: '10 · Stagger a grid', Component: StaggerGrid },
	{ label: '11 · Notification list', Component: NotificationList },
	{ label: '12 · Accordion height', Component: AccordionHeight },
	{ label: '13 · Toolbar width', Component: ToolbarWidth },
	{ label: '14 · Card dimensions', Component: CardDimensions },
	{ label: '15 · Persistent sidebar', Component: PersistentSidebar },
	{ label: '16 · Custom entry and exit', Component: CustomEntryExit },
	{ label: '17 · Third-party chart', Component: ThirdPartyChart },
	{ label: '18 · Interactive tile', Component: InteractiveTile },
	{ label: '19 · Replay motion', Component: ReplayMotion },
	{ label: '20 · Legacy FadeIn migration', Component: LegacyFadeIn },
	{ label: '21 · Legacy SlideIn migration', Component: LegacySlideIn },
	{ label: '22 · Legacy ZoomIn migration', Component: LegacyZoomIn },
	{ label: '23 · Legacy ShrinkOut migration', Component: LegacyShrinkOut },
];

const styles = cssMap({
	controls: {
		maxWidth: '360px',
		paddingBlockStart: token('space.200'),
		paddingInlineStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
	},
});

export default function MotionBenchmarksExample(): JSX.Element {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const SelectedBenchmark = benchmarks[selectedIndex].Component;

	return (
		<Stack>
			<div css={styles.controls}>
				<Stack space="space.100">
					<Text weight="semibold">Benchmark</Text>
					<DropdownMenu shouldRenderToParent trigger={benchmarks[selectedIndex].label}>
						<DropdownItemGroup>
							{benchmarks.map((benchmark, index) => (
								<DropdownItem
									key={benchmark.label}
									isSelected={index === selectedIndex}
									onClick={() => setSelectedIndex(index)}
								>
									{benchmark.label}
								</DropdownItem>
							))}
						</DropdownItemGroup>
					</DropdownMenu>
				</Stack>
			</div>
			<SelectedBenchmark />
		</Stack>
	);
}
