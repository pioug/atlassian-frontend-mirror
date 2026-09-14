import React from 'react';

import PremiumIcon from '@atlaskit/icon/core/premium';
import ProjectIcon from '@atlaskit/icon/core/project';
import Link from '@atlaskit/link/link';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { Footer } from '@atlaskit/side-navigation/footer';
import { Header } from '@atlaskit/side-navigation/header';
import { NavigationContent } from '@atlaskit/side-navigation/navigation-content';
import { NavigationFooter } from '@atlaskit/side-navigation/navigation-footer';
import { NavigationHeader } from '@atlaskit/side-navigation/navigation-header';
import { SideNavigation } from '@atlaskit/side-navigation/side-navigation';

import AppFrame from '../common/app-frame';

const Example = (): React.JSX.Element => {
	return (
		<AppFrame shouldHideAppBar>
			<SideNavigation label="project" testId="side-navigation">
				<NavigationHeader>
					<Header
						component={({ children, ...props }) => (
							<>
								{/* eslint-disable-next-line @atlaskit/design-system/no-html-anchor */}
								<a href="https://atlassian.design/" {...props}>
									{children}
								</a>
							</>
						)}
						iconBefore={<ProjectIcon label="" />}
						description="Next-gen software"
					>
						Concise Systems
					</Header>
				</NavigationHeader>
				<NavigationContent> </NavigationContent>
				<NavigationFooter>
					<Footer
						useDeprecatedApi={false}
						iconBefore={<PremiumIcon label="" />}
						description={
							<div>
								<Link href="https://www.atlassian.design">Give feedback</Link> {' ∙ '}
								<Link href="https://www.atlassian.design">About this project</Link>
							</div>
						}
					>
						You're in a next gen-project
					</Footer>
				</NavigationFooter>
			</SideNavigation>
		</AppFrame>
	);
};

export default Example;
