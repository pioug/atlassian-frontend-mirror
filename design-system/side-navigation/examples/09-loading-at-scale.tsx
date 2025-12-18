import React, { useEffect, useState } from 'react';

import VideoRewindOverlayIcon from '@atlaskit/icon-lab/core/video-rewind-overlay';
import BacklogIcon from '@atlaskit/icon/core/backlog';
import BoardIcon from '@atlaskit/icon/core/board';
import ChartTrendUpIcon from '@atlaskit/icon/core/chart-trend-up';
import RoadmapIcon from '@atlaskit/icon/core/roadmap';
import SettingsIcon from '@atlaskit/icon/core/settings';
import {
	ButtonItem,
	Footer,
	HeadingItem,
	LinkItem,
	LoadingItems,
	NavigationFooter,
	NavigationHeader,
	NestableNavigationContent,
	NestingItem,
	Section,
	SideNavigation,
	SkeletonHeadingItem,
	SkeletonItem,
} from '@atlaskit/side-navigation';

import AppFrame from './common/app-frame';
import { CustomItemFooter } from './common/sample-footer';
import SampleHeader from './common/sample-header';

const LazySettingsItems = () => {
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setTimeout(() => {
			setIsLoading(false);
		}, 1000);
	}, []);

	return (
		<LoadingItems
			fallback={
				<>
					<HeadingItem>Project settings</HeadingItem>
					<SkeletonItem />
					<SkeletonItem />
					<SkeletonItem />
					<SkeletonItem />
				</>
			}
			isLoading={isLoading}
		>
			<Section title="Project settings">
				<ButtonItem>Details</ButtonItem>
				<ButtonItem>Access</ButtonItem>
				<ButtonItem>Work types</ButtonItem>
				<ButtonItem>Features</ButtonItem>
				<ButtonItem>Apps</ButtonItem>
			</Section>
		</LoadingItems>
	);
};

const SettingsItem = () => {
	return (
		<NestingItem
			iconBefore={<SettingsIcon spacing="spacious" label="" />}
			id="settings"
			title="Project settings"
		>
			<LazySettingsItems />
		</NestingItem>
	);
};

const LoadingSkeleton = (): React.JSX.Element => {
	const [isLoading, setIsLoading] = useState(true);
	const [key, setKey] = useState(0);

	const reset = (incKey: boolean = true) => {
		if (incKey) {
			setKey((prev) => prev + 1);
		}
		setIsLoading(true);

		setTimeout(() => {
			setIsLoading(false);
		}, 1000);
	};

	useEffect(() => reset(false), []);

	return (
		<AppFrame shouldHideAppBar>
			<SideNavigation key={key} label="project" testId="side-navigation">
				<NavigationHeader>
					<SampleHeader />
				</NavigationHeader>
				<NestableNavigationContent>
					<LoadingItems
						isLoading={isLoading}
						fallback={
							<>
								<SkeletonHeadingItem isShimmering />
								<SkeletonItem isShimmering hasIcon />
								<SkeletonItem isShimmering hasIcon />
								<SkeletonItem isShimmering hasIcon />
							</>
						}
					>
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
							<SettingsItem />
						</Section>
					</LoadingItems>
				</NestableNavigationContent>
				<NavigationFooter>
					<Footer
						onClick={() => reset()}
						iconBefore={<VideoRewindOverlayIcon spacing="spacious" label="" />}
						description="Will load everything again"
						component={CustomItemFooter}
					>
						Reset
					</Footer>
				</NavigationFooter>
			</SideNavigation>
		</AppFrame>
	);
};

export default LoadingSkeleton;
