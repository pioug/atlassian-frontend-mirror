import React, { Fragment, useState } from 'react';

import Button from '@atlaskit/button/new';
import AppIcon from '@atlaskit/icon/core/app';
import WorkIcon from '@atlaskit/icon/core/folder-closed';
import LanguageIcon from '@atlaskit/icon/core/globe';
import QueueIcon from '@atlaskit/icon/core/pages';
import CustomerIcon from '@atlaskit/icon/core/person';
import SettingsIcon from '@atlaskit/icon/core/settings';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Inline, Text } from "@atlaskit/primitives/compiled";
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
import {
	PopoverContent,
	PopoverProvider,
	PopoverTarget,
	SpotlightActions,
	SpotlightBody,
	SpotlightCard,
	SpotlightControls,
	SpotlightDismissControl,
	SpotlightFooter,
	SpotlightHeader,
	SpotlightHeadline,
	SpotlightPrimaryAction,
	SpotlightSecondaryAction,
	SpotlightStepCount,
} from '@atlaskit/spotlight';

import AppFrame from './common/app-frame';
import SampleFooter from './common/sample-footer';
import SampleHeader from './common/sample-header';

const LanguageSettings = () => {
	return (
		<NestingItem
			iconBefore={<LanguageIcon spacing="spacious" label="" />}
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

const BasicExample = (): React.JSX.Element => {
	const [currentStep, setCurrentStep] = useState<number | undefined>();
	const dismiss = () => setCurrentStep(undefined);

	return (
		<Inline alignBlock="stretch" space="space.100">
			<AppFrame shouldHideAppBar>
				<SideNavigation label="project" testId="side-navigation">
					<NavigationHeader>
						<SampleHeader />
					</NavigationHeader>
					<NestableNavigationContent initialStack={[]}>
						<Section>
							<PopoverProvider>
								<PopoverTarget>
									<ButtonItem iconBefore={<WorkIcon spacing="spacious" label="" />}>
										Your work
									</ButtonItem>
								</PopoverTarget>
								<PopoverContent
									dismiss={dismiss}
									placement="right-end"
									isVisible={currentStep === 0}
								>
									<SpotlightCard>
										<SpotlightHeader>
											<SpotlightHeadline>Button Item</SpotlightHeadline>
											<SpotlightControls>
												<SpotlightDismissControl onClick={dismiss} />
											</SpotlightControls>
										</SpotlightHeader>
										<SpotlightBody>
											<Text as="p" testId="buttonItemSpotlightMessage">
												Check out this cool thing
											</Text>
										</SpotlightBody>
										<SpotlightFooter>
											<SpotlightStepCount>1 of 5</SpotlightStepCount>
											<SpotlightActions>
												<SpotlightPrimaryAction onClick={() => setCurrentStep(1)}>
													Next
												</SpotlightPrimaryAction>
											</SpotlightActions>
										</SpotlightFooter>
									</SpotlightCard>
								</PopoverContent>
							</PopoverProvider>

							<PopoverProvider>
								<PopoverTarget>
									<LinkItem
										href="https://www.atlassian.design"
										iconBefore={<CustomerIcon spacing="spacious" label="" />}
									>
										Your customers
									</LinkItem>
								</PopoverTarget>
								<PopoverContent
									dismiss={dismiss}
									placement="right-end"
									isVisible={currentStep === 1}
								>
									<SpotlightCard>
										<SpotlightHeader>
											<SpotlightHeadline>Link Item</SpotlightHeadline>
											<SpotlightControls>
												<SpotlightDismissControl onClick={dismiss} />
											</SpotlightControls>
										</SpotlightHeader>
										<SpotlightBody>
											<Text as="p" testId="linkItemSpotlightMessage">
												Check out this cool thing
											</Text>
										</SpotlightBody>
										<SpotlightFooter>
											<SpotlightStepCount>2 of 5</SpotlightStepCount>
											<SpotlightActions>
												<SpotlightSecondaryAction onClick={() => setCurrentStep(0)}>
													Back
												</SpotlightSecondaryAction>
												<SpotlightPrimaryAction onClick={() => setCurrentStep(2)}>
													Next
												</SpotlightPrimaryAction>
											</SpotlightActions>
										</SpotlightFooter>
									</SpotlightCard>
								</PopoverContent>
							</PopoverProvider>

							<PopoverProvider>
								<PopoverTarget>
									<NestingItem
										id="dropbox"
										iconBefore={<AppIcon spacing="spacious" label="" />}
										title="Dropbox"
										isDisabled
									>
										<Fragment />
									</NestingItem>
								</PopoverTarget>
								<PopoverContent
									dismiss={dismiss}
									placement="right-end"
									isVisible={currentStep === 2}
								>
									<SpotlightCard>
										<SpotlightHeader>
											<SpotlightHeadline>Disabled Item</SpotlightHeadline>
											<SpotlightControls>
												<SpotlightDismissControl onClick={dismiss} />
											</SpotlightControls>
										</SpotlightHeader>
										<SpotlightBody>
											<Text as="p" testId="disabledItemSpotlightMessage">
												Check out this cool thing
											</Text>
										</SpotlightBody>
										<SpotlightFooter>
											<SpotlightStepCount>3 of 5</SpotlightStepCount>
											<SpotlightActions>
												<SpotlightSecondaryAction onClick={() => setCurrentStep(1)}>
													Back
												</SpotlightSecondaryAction>
												<SpotlightPrimaryAction onClick={() => setCurrentStep(3)}>
													Next
												</SpotlightPrimaryAction>
											</SpotlightActions>
										</SpotlightFooter>
									</SpotlightCard>
								</PopoverContent>
							</PopoverProvider>

							<PopoverProvider>
								<PopoverTarget>
									<NestingItem
										id="3"
										iconBefore={<SettingsIcon spacing="spacious" label="" />}
										title="Settings"
									>
										<Section>
											<LanguageSettings />
										</Section>
									</NestingItem>
								</PopoverTarget>
								<PopoverContent
									dismiss={dismiss}
									placement="right-end"
									isVisible={currentStep === 3}
								>
									<SpotlightCard>
										<SpotlightHeader>
											<SpotlightHeadline>Nesting Item</SpotlightHeadline>
											<SpotlightControls>
												<SpotlightDismissControl onClick={dismiss} />
											</SpotlightControls>
										</SpotlightHeader>
										<SpotlightBody>
											<Text as="p" testId="nestingItemSpotlightMessage">
												Check out this cool thing
											</Text>
										</SpotlightBody>
										<SpotlightFooter>
											<SpotlightStepCount>4 of 5</SpotlightStepCount>
											<SpotlightActions>
												<SpotlightSecondaryAction onClick={() => setCurrentStep(2)}>
													Back
												</SpotlightSecondaryAction>
												<SpotlightPrimaryAction onClick={() => setCurrentStep(4)}>
													Next
												</SpotlightPrimaryAction>
											</SpotlightActions>
										</SpotlightFooter>
									</SpotlightCard>
								</PopoverContent>
							</PopoverProvider>

							<PopoverProvider>
								<PopoverTarget>
									<NestingItem
										id="queues"
										isSelected
										title="Queues view"
										iconBefore={<QueueIcon spacing="spacious" label="" />}
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
								</PopoverTarget>
								<PopoverContent
									dismiss={dismiss}
									placement="right-end"
									isVisible={currentStep === 4}
								>
									<SpotlightCard>
										<SpotlightHeader>
											<SpotlightHeadline>Selected Nesting Item</SpotlightHeadline>
											<SpotlightControls>
												<SpotlightDismissControl onClick={dismiss} />
											</SpotlightControls>
										</SpotlightHeader>
										<SpotlightBody>
											<Text as="p" testId="selectedNestingItemSpotlightMessage">
												Check out this cool thing
											</Text>
										</SpotlightBody>
										<SpotlightFooter>
											<SpotlightStepCount>5 of 5</SpotlightStepCount>
											<SpotlightActions>
												<SpotlightSecondaryAction onClick={() => setCurrentStep(3)}>
													Back
												</SpotlightSecondaryAction>
												<SpotlightPrimaryAction onClick={dismiss}>Finish</SpotlightPrimaryAction>
											</SpotlightActions>
										</SpotlightFooter>
									</SpotlightCard>
								</PopoverContent>
							</PopoverProvider>
						</Section>
					</NestableNavigationContent>
					<NavigationFooter>
						<SampleFooter />
					</NavigationFooter>
				</SideNavigation>
			</AppFrame>
			<Box padding="space.200">
				<Button id="show-spotlight" onClick={() => setCurrentStep(0)} appearance="default">
					Show spotlight
				</Button>
			</Box>
		</Inline>
	);
};
export default BasicExample;
