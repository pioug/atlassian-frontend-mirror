import React, { useState } from 'react';

import { token } from '@atlaskit/tokens';

import {
	ButtonItem,
	GoBackItem,
	Header,
	NavigationHeader,
	NestableNavigationContent,
	NestingItem,
	Section,
	SideNavigation,
} from '../src';

import AppFrame from './common/app-frame';

const BasicExample = () => {
	const [stack, setStack] = useState<string[]>(['1-0']);

	return (
		<AppFrame shouldHideAppBar>
			<div
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					display: 'grid',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					minHeight: 800,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					gap: token('space.600', '48px'),
				}}
			>
				<SideNavigation label="Controlled navigation" testId="controlled-invalid">
					<NavigationHeader>
						<Header
							description={
								<span>
									The provided stack level does not exist.
									<br />
									onUnknownNest callback is triggered with '1-0'
								</span>
							}
						>
							Controlled
						</Header>
					</NavigationHeader>
					<NestableNavigationContent
						onChange={setStack}
						stack={stack}
						onUnknownNest={(stack) => console.warn(`invalid stack: ${stack}`)}
					>
						<Section title="Top level">
							<NestingItem id="1" title="Item B">
								<Section title="Nesting level 1">
									<ButtonItem>Item B</ButtonItem>
								</Section>
							</NestingItem>
						</Section>
					</NestableNavigationContent>
				</SideNavigation>

				<SideNavigation label="Uncontrolled navigation" testId="uncontrolled-invalid">
					<NavigationHeader>
						<Header
							description={
								<span>
									'Go Back' takes us to an invalid state.
									<br />
									onUnknownNest callback is triggered with the provided stack, `1,1-1,1-2,1-3`
								</span>
							}
						>
							Uncontrolled
						</Header>
					</NavigationHeader>
					<NestableNavigationContent
						initialStack={['1', '1-1', '1-2', '1-3', '1-1']}
						onUnknownNest={(stack) => console.warn(`invalid stack: ${stack}`)}
					>
						<Section title="Top level">
							<NestingItem id="1" title="Item A">
								<NestingItem
									id="1-1"
									title="Item A-1"
									// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
									overrides={{
										GoBackItem: {
											render: (props) => (
												<GoBackItem description={'Takes us back to an invalid state.'} {...props}>
													Go back
												</GoBackItem>
											),
										},
									}}
								>
									Level 1-1
								</NestingItem>
							</NestingItem>
						</Section>
					</NestableNavigationContent>
				</SideNavigation>
			</div>
		</AppFrame>
	);
};

export default BasicExample;
