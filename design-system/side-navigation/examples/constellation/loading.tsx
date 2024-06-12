import React from 'react';

import {
	ButtonItem,
	Header,
	LoadingItems,
	NavigationContent,
	NavigationHeader,
	Section,
	SideNavigation,
	SkeletonItem,
} from '../../src';
import AppFrame from '../common/app-frame';

const LoadingExample = () => {
	return (
		<AppFrame shouldHideAppBar>
			<SideNavigation label="settings">
				<NavigationContent>
					<LoadingItems
						isLoading
						fallback={
							<>
								<NavigationHeader>
									<Header description="Next-gen software">Concise Systems</Header>
								</NavigationHeader>
								<SkeletonItem />
								<SkeletonItem hasAvatar />
								<SkeletonItem hasIcon isShimmering />
								<SkeletonItem isShimmering />
							</>
						}
					>
						<Section title="Project settings">
							<ButtonItem>Details</ButtonItem>
						</Section>
					</LoadingItems>
				</NavigationContent>
			</SideNavigation>
		</AppFrame>
	);
};

export default LoadingExample;
