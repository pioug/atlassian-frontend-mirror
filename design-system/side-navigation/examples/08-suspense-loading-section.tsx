import React, { lazy, Suspense } from 'react';

import BacklogIcon from '@atlaskit/icon/core/backlog';
import BoardIcon from '@atlaskit/icon/core/board';
import ChartTrendUpIcon from '@atlaskit/icon/core/chart-trend-up';
import RoadmapIcon from '@atlaskit/icon/core/roadmap';
import SettingsIcon from '@atlaskit/icon/core/settings';
import {
	ButtonItem,
	HeadingItem,
	LinkItem,
	NavigationHeader,
	NestableNavigationContent,
	NestingItem,
	Section,
	SideNavigation,
	SkeletonHeadingItem,
	SkeletonItem,
} from '@atlaskit/side-navigation';

import AppFrame from './common/app-frame';
import SampleHeader from './common/sample-header';

/**
 * This turns a component into a lazy component.
 * You'll want to do proper code splitting instead of forcing the async behavior!
 */
const makeLazy = <TComponent extends React.ComponentType>(component: TComponent) => {
	return lazy(() => {
		return new Promise<{ default: TComponent }>((resolve) => {
			setTimeout(() => {
				resolve({ default: component });
			}, 1000);
		});
	});
};

const LazySettingsSectionItems = makeLazy(() => {
	return (
		<Section title="Project settings">
			<ButtonItem>Details</ButtonItem>
			<ButtonItem>Access</ButtonItem>
			<ButtonItem>Work types</ButtonItem>
			<ButtonItem>Features</ButtonItem>
			<ButtonItem>Apps</ButtonItem>
		</Section>
	);
});

const LazyRootItems = makeLazy(() => {
	return (
		<Section title="My project">
			{/* eslint-disable @atlassian/a11y/anchor-is-valid */}
			<LinkItem href="#" iconBefore={<RoadmapIcon spacing="spacious" label="" />}>
				Roadmap
			</LinkItem>
			<LinkItem href="#" iconBefore={<BacklogIcon spacing="spacious" label="" />}>
				Backlog
			</LinkItem>
			<LinkItem href="#" iconBefore={<BoardIcon spacing="spacious" label="" />}>
				Board
			</LinkItem>
			<LinkItem href="#" iconBefore={<ChartTrendUpIcon spacing="spacious" label="" />}>
				Reports
			</LinkItem>
			{/* eslint-enable @atlassian/a11y/anchor-is-valid */}
			<SettingsSection />
		</Section>
	);
});

const SettingsSection = () => {
	return (
		<NestingItem
			iconBefore={<SettingsIcon spacing="spacious" label="" />}
			id="settings"
			title="Project settings"
			isSelected
		>
			<Suspense
				fallback={
					<>
						<HeadingItem>Project settings</HeadingItem>
						<SkeletonItem />
						<SkeletonItem />
						<SkeletonItem />
					</>
				}
			>
				<LazySettingsSectionItems />
			</Suspense>
		</NestingItem>
	);
};

const LoadingSkeleton = (): React.JSX.Element => {
	return (
		<AppFrame shouldHideAppBar>
			<SideNavigation label="project" testId="side-navigation">
				<NavigationHeader>
					<SampleHeader />
				</NavigationHeader>
				<NestableNavigationContent>
					<Suspense
						fallback={
							<>
								<SkeletonHeadingItem isShimmering />
								<SkeletonItem isShimmering hasIcon />
								<SkeletonItem isShimmering hasIcon />
								<SkeletonItem isShimmering hasIcon />
							</>
						}
					>
						<LazyRootItems />
					</Suspense>
				</NestableNavigationContent>
			</SideNavigation>
		</AppFrame>
	);
};

export default LoadingSkeleton;
