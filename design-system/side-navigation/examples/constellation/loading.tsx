import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import {
	ButtonItem,
	Header,
	LoadingItems,
	NavigationContent,
	NavigationHeader,
	Section,
	SideNavigation,
	SkeletonItem,
} from '@atlaskit/side-navigation';

import AppFrame from '../common/app-frame';

const LoadingExample = (): React.JSX.Element => {
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
