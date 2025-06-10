import React, { Fragment, useState } from 'react';

import Button from '@atlaskit/button/new';
import DropboxIcon from '@atlaskit/icon/glyph/dropbox';
import WorkIcon from '@atlaskit/icon/glyph/folder';
import CustomerIcon from '@atlaskit/icon/glyph/person';
import QueueIcon from '@atlaskit/icon/glyph/queues';
import SettingsIcon from '@atlaskit/icon/glyph/settings';
import LanguageIcon from '@atlaskit/icon/glyph/world';
import {
	Spotlight,
	SpotlightManager,
	SpotlightTarget,
	SpotlightTransition,
} from '@atlaskit/onboarding';
import { Box, Inline, Text } from '@atlaskit/primitives';
import {
	ButtonItem,
	LinkItem,
	NavigationFooter,
	NavigationHeader,
	NestableNavigationContent,
	NestingItem,
	Section,
	SideNavigation,
} from '@atlaskit/side-navigation';
import { token } from '@atlaskit/tokens';

import AppFrame from './common/app-frame';
import SampleFooter from './common/sample-footer';
import SampleHeader from './common/sample-header';

const LanguageSettings = () => {
	return (
		<NestingItem
			iconBefore={<LanguageIcon label="" />}
			id="language-settings"
			title="Language settings"
		>
			<Section>
				<ButtonItem>Customize</ButtonItem>

				<NestingItem id="german-settings" title="German Settings">
					<Section>
						<ButtonItem>Hallo Welt!</ButtonItem>
					</Section>
				</NestingItem>
				<NestingItem id="english-settings" title="English Settings">
					<Section>
						<ButtonItem>Hello World!</ButtonItem>
					</Section>
				</NestingItem>
			</Section>
		</NestingItem>
	);
};

const BasicExample = () => {
	return (
		<SpotlightManager>
			<Inline alignBlock="stretch" space="space.100">
				<AppFrame shouldHideAppBar>
					<SideNavigation label="project" testId="side-navigation">
						<NavigationHeader>
							<SampleHeader />
						</NavigationHeader>
						<NestableNavigationContent initialStack={[]}>
							<Section>
								<SpotlightTarget name="buttonItem">
									<ButtonItem iconBefore={<WorkIcon label="" />}>Your work</ButtonItem>
								</SpotlightTarget>
								<SpotlightTarget name="linkItem">
									<LinkItem
										href="https://www.atlassian.design"
										iconBefore={<CustomerIcon label="" />}
									>
										Your customers
									</LinkItem>
								</SpotlightTarget>
								<SpotlightTarget name="disabledItem">
									<NestingItem
										id="dropbox"
										iconBefore={<DropboxIcon label="" />}
										title="Dropbox"
										isDisabled
									>
										<Fragment />
									</NestingItem>
								</SpotlightTarget>
								<SpotlightTarget name="nestingItem">
									<NestingItem id="3" iconBefore={<SettingsIcon label="" />} title="Settings">
										<Section>
											<LanguageSettings />
										</Section>
									</NestingItem>
								</SpotlightTarget>
								<SpotlightTarget name="selectedNestingItem">
									<NestingItem
										id="queues"
										isSelected
										title="Queues view"
										iconBefore={<QueueIcon label="" />}
									>
										<Section title="Queues">
											<ButtonItem>Untriaged</ButtonItem>
											<ButtonItem>My feature work</ButtonItem>
											<ButtonItem>My bugfix work</ButtonItem>
											<ButtonItem>Signals</ButtonItem>
											<ButtonItem>Assigned to me</ButtonItem>
										</Section>
										<Section hasSeparator>
											<ButtonItem>New queue</ButtonItem>
										</Section>
									</NestingItem>
								</SpotlightTarget>
							</Section>
						</NestableNavigationContent>
						<NavigationFooter>
							<SampleFooter />
						</NavigationFooter>
					</SideNavigation>
				</AppFrame>
				<SpotlightTransition>
					<SpotlightRenderer />
				</SpotlightTransition>
			</Inline>
		</SpotlightManager>
	);
};

const SpotlightRenderer = () => {
	const [variant, setVariant] = useState<number | undefined>();
	const variants = [
		<Spotlight
			targetBgColor={token('elevation.surface')}
			actions={[
				{
					onClick: () => setVariant(Number(variant) + 1),
					text: 'Next',
				},
			]}
			dialogPlacement="bottom left"
			heading="Button Item"
			target="buttonItem"
			key="buttonItem"
		>
			<Text as="p" testId="buttonItemSpotlightMessage">
				Check out this cool thing
			</Text>
		</Spotlight>,

		<Spotlight
			targetBgColor={token('elevation.surface')}
			actions={[
				{
					onClick: () => setVariant(Number(variant) + 1),
					text: 'Next',
				},
				{
					onClick: () => setVariant(Number(variant) - 1),
					text: 'Previous',
				},
			]}
			dialogPlacement="bottom left"
			heading="Link Item"
			target="linkItem"
			key="linkItem"
		>
			<Text as="p" testId="linkItemSpotlightMessage">
				Check out this cool thing
			</Text>
		</Spotlight>,

		<Spotlight
			targetBgColor={token('elevation.surface')}
			actions={[
				{
					onClick: () => setVariant(Number(variant) + 1),
					text: 'Next',
				},
				{
					onClick: () => setVariant(Number(variant) - 1),
					text: 'Previous',
				},
			]}
			dialogPlacement="bottom left"
			heading="Disabled Item"
			target="disabledItem"
			key="disabledItem"
		>
			<Text as="p" testId="disabledItemSpotlightMessage">
				Check out this cool thing
			</Text>
		</Spotlight>,

		<Spotlight
			targetBgColor={token('elevation.surface')}
			actions={[
				{
					onClick: () => setVariant(Number(variant) + 1),
					text: 'Next',
				},
				{
					onClick: () => setVariant(Number(variant) - 1),
					text: 'Previous',
				},
			]}
			dialogPlacement="bottom left"
			heading="Nesting Item"
			target="nestingItem"
			key="nestingItem"
		>
			<Text as="p" testId="nestingItemSpotlightMessage">
				Check out this cool thing
			</Text>
		</Spotlight>,

		<Spotlight
			targetBgColor={token('elevation.surface')}
			actions={[
				{
					onClick: () => setVariant(undefined),
					text: 'Finish',
				},
				{
					onClick: () => setVariant(Number(variant) - 1),
					text: 'Previous',
				},
			]}
			dialogPlacement="bottom left"
			heading="Selected Nesting Item"
			target="selectedNestingItem"
			key="selectedNestingItem"
		>
			<Text as="p" testId="selectedNestingItemSpotlightMessage">
				Check out this cool thing
			</Text>
		</Spotlight>,
	];

	if (variant !== undefined) {
		return variants[variant];
	}

	return (
		<Box padding="space.200">
			<Button id="show-spotlight" onClick={() => setVariant(0)} appearance="default">
				Show spotlight
			</Button>
		</Box>
	);
};
export default BasicExample;
