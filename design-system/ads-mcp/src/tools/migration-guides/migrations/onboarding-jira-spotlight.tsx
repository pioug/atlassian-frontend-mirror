import type { MigrationGuide } from '../types';

const additionalResources =
	'Visit https://hello.atlassian.net/wiki/spaces/DST/pages/6069774593 or https://atlassian.design/components/spotlight for more context';

export const onboardingJiraSpotlight: MigrationGuide = {
	id: 'jira-spotlight',
	title: 'JiraSpotlight Migration',
	description: 'Use when code contains `JiraSpotlight` import from `@atlassian/jira-spotlight`',
	fromPackage: '@atlassian/jira-spotlight',
	toPackage: '@atlaskit/spotlight',
	examples: [
		{
			title: 'Internal <JiraSpotlight /> migration',
			description:
				'Internal migrations are possible for JiraSpotlight usages which only pass simple/textual content to JiraSpotlight children',
			before: `
// file1.tsx
import { JiraSpotlight } from '@atlassian/jira-spotlight/src/ui/jira-spotlight.tsx';

export const OnboardingSpotlightWrapper = () => {
	const spotlightId = 'some-unique-identifier'
	const { dark, light } = spotlightImageUrls[spotlightId];
	const imageUrl = colorMode === 'dark' ? dark : light;

	return (
		<JiraSpotlight
			image={imageUrl}
			actions={[
				{
					onClick,
					text: formatMessage(dismiss),
				},
			]}
			heading={formatMessage(heading)}
			target={spotlightId}
			key={spotlightId}
			targetRadius={3}
			targetBgColor={token('elevation.surface')}
			messageId={spotlightId}
			messageType="transactional"
			dialogWidth={275}
		>
			{formatMessage(body)}
		</JiraSpotlight>
	);
}

// file2.tsx
import { SpotlightTarget } from '@atlaskit/onboarding';

const spotlightId = 'some-unique-identifier'

export const SomeFeature = () => {
	return (
		<SpotlightTarget name={spotlightId}>
			// Target code
		</SpotlightTarget>
	);
}
`,
			after: `
// file1.tsx
import { JiraSpotlight } from '@atlassian/jira-spotlight/src/ui/jira-spotlight.tsx';

export const OnboardingSpotlightWrapper = () => {
	const spotlightId = 'some-unique-identifier'
	const { dark, light } = spotlightImageUrls[spotlightId];
	const imageUrl = colorMode === 'dark' ? dark : light;

	return (
		<JiraSpotlight
			isMigrated // isMigrated prop passed
			image={imageUrl}
			actions={[
				{
					onClick,
					text: formatMessage(dismiss),
				},
			]}
			heading={formatMessage(heading)}
			target={spotlightId}
			key={spotlightId}
			targetRadius={3}
			targetBgColor={token('elevation.surface')}
			messageId={spotlightId}
			messageType="transactional"
			dialogWidth={275}
		>
			{formatMessage(body)}
		</JiraSpotlight>
	);
}

// file2.tsx
// Updated SpotlightTarget import statement
import { SpotlightTarget } from '@atlassian/jira-spotlight/src/ui/SpotlightTarget.tsx';

export const SomeFeature = () => {
	const spotlightId = 'some-unique-identifier'

	return (
		<SpotlightTarget name={spotlightId}>
			// Target code
		</SpotlightTarget>
	);
}
			`,
			explanation: `Key changes when migrating a JiraSpotlight:
- A JiraSpotlight and a SpotlightTarget are part of the same usage if they share a spotlightId value - Referenced in JiraSpotlight.target and SpotlightTarget.name props
- Pass isMigrated={true} to JiraSpotlight.
- Update SpotlightTarget import statment from '@atlaskit/onboarding' to '@atlassian/jira-spotlight/src/ui/SpotlightTarget.tsx';
- These changes allow switching the internal implementation to '@atlaskit/spotlight' via a feature flag.
- This internal migration is only possible for usages that don't rely too heavily on the 'children' prop, as complex values, like heading, images, etc passed to 'children' are difficult to parse.
`,
		},

		{
			title: 'Complex <JiraSpotlight /> migration',
			description:
				'Complex migrations are necessary for JiraSpotlight usages that make heavy use of the `children` prop to achieve customisation instead of relying on the `heading`, `body`, `image`, and/or `actions` props.',
			before: `
// file1.tsx
import { JiraSpotlight } from '@atlassian/jira-spotlight/src/ui/jira-spotlight.tsx';

export const OnboardingSpotlightWrapper = () => {
	const spotlightId = 'some-unique-identifier'
	const { dark, light } = spotlightImageUrls[spotlightId];
	const imageUrl = colorMode === 'dark' ? dark : light;

	return (
		<JiraSpotlight
			target={spotlightId}
			targetRadius={3}
			dialogPlacement=''
			targetBgColor={token('elevation.surface')}
			messageId={spotlightId}
			messageType="transactional"
			dialogWidth={275}
		>
			<CustomSpotlightInner>
				{imageUrl}
				{formatMessage(heading)}
				{formatMessage(body)}
				<CustomSpotlightAction>
					{formatMessage(dismiss)}
				</CustomSpotlightAction>
			</CustomSpotlightInner>
		</JiraSpotlight>
	);
}

// file2.tsx
import { SpotlightTarget } from '@atlaskit/onboarding';

const spotlightId = 'some-unique-identifier'

export const SomeFeature = () => {
	return (
		<SpotlightTarget name={spotlightId}>
			// Target code
		</SpotlightTarget>
	);
}
`,
			after: `
// file2.tsx - Spotlight code has been co-located to the targeted element
import { Text } from '@atlaskit/primitives/compiled';
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
} from '@atlaskit/spotlight';
import Image from '@atlaskit/image';
import { ChoreographedComponent } from '@atlassian/jira-spotlight/src/ui/ChoreographedComponent.tsx';

export const SomeFeature = () => {
	const { dark, light } = spotlightImageUrls[spotlightId];

	const [isSpotlightVisible, actions] = useListViewOnboarding({
		projectId: String(projectData.id),
		id: spotlightId,
	});

	return (
		<PopoverProvider>
			<PopoverTarget>{renderTrigger(isSpotlightVisible)}</PopoverTarget>
			<ChoreographedComponent messageId={spotlightId} messageType="transactional">
				<PopoverContent isVisible={isSpotlightVisible} placement="bottom-start" dismiss={onClick}>
					<SpotlightCard>
						<SpotlightHeader>
							<SpotlightHeadline>{formatMessage(heading)}</SpotlightHeadline>
							<SpotlightControls>
								<SpotlightDismissControl />
							</SpotlightControls>
						</SpotlightHeader>
						<SpotlightMedia>
							<Image src={light} srcDark={dark} alt="" />
						</SpotlightMedia>
						<SpotlightBody>
							<Text>{formatMessage(body)}</Text>
						</SpotlightBody>
						<SpotlightFooter>
							<SpotlightActions>
								<SpotlightPrimaryAction onClick={onClick}>
									{formatMessage(dismiss)}
								</SpotlightPrimaryAction>
							</SpotlightActions>
						</SpotlightFooter>
					</SpotlightCard>
				</PopoverContent>
			</ChoreographedComponent>
		</PopoverProvider>
	);
};`,
			explanation: `Key changes when migrating a single step spotlight:
- Replace JiraSpotlight with ChoreographedComponent from '@atlassian/jira-spotlight'.
- PopoverProvider maintains internal Spotlight state.
- Replace SpotlightTarget with PopoverTarget - wraps the element to highlight
- Replace Spotlight with PopoverContent containing SpotlightCard - controls visibility and positioning
- 'heading' becomes SpotlightHeadline inside SpotlightHeader
- 'actions' becomes SpotlightActions with SpotlightPrimaryAction (and optionally SpotlightSecondaryAction)
- 'body' content moves into SpotlightBody wrapped with Text component
- Add SpotlightDismissControl inside SpotlightControls for the close button
- The 'target' and/or 'targetName' prop is replaced with PopoverTarget directly wrapping the target element
- 'dialogPlacement' prop becomes 'placement' on PopoverContent. Mapping: "top right" → "top-start", "top center" → "top", "top left" → "top-end", "right bottom" → "right-start", "right middle" → "right-start | right-end", "right top" → "right-end", "bottom left" → "bottom-end", "bottom center" → "bottom", "bottom right" → "bottom-start", "left top" → "left-end", "left middle" → "left-start | left-end", "left bottom" → "left-start"'`,
		},
	],
	bestPractices: [],
	additionalResources,
};
