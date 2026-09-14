import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { ButtonItem } from '@atlaskit/side-navigation/button-item';
import { Header } from '@atlaskit/side-navigation/header';
import { LoadingItems } from '@atlaskit/side-navigation/loading-items';
import { NavigationContent } from '@atlaskit/side-navigation/navigation-content';
import { NavigationHeader } from '@atlaskit/side-navigation/navigation-header';
import { Section } from '@atlaskit/side-navigation/section';
import { SideNavigation } from '@atlaskit/side-navigation/side-navigation';
import { SkeletonItem } from '@atlaskit/side-navigation/skeleton-item';

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
