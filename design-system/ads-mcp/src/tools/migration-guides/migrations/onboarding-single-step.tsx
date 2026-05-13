import type { MigrationGuide } from '../types';

const additionalResources =
	'Visit https://hello.atlassian.net/wiki/spaces/DST/pages/6069774593 or https://atlassian.design/components/spotlight for more context';

export const onboardingSingleStep: MigrationGuide = {
	id: 'single-step',
	title: 'Single Step Spotlight Migration',
	description: 'Use when code ONLY has `Spotlight` from `@atlaskit/onboarding` (no JiraSpotlight)',
	fromPackage: '@atlaskit/onboarding',
	toPackage: '@atlaskit/spotlight',
	examples: [
		{
			title: 'Migrate single step spotlight',
			description:
				'Replace SpotlightTarget, and Spotlight with the new compositional @atlaskit/spotlight components',
			before: `
// file1.tsx
import React, { useState } from 'react';
import Button from '@atlaskit/button/new';
import { Spotlight } from '@atlaskit/onboarding';

const OnboardingSpotlight = () => {
  const [isSpotlightActive, setIsSpotlightActive] = useState(true);
  const start = () => setIsSpotlightActive(true);
  const end = () => setIsSpotlightActive(false);

  return (
		{isSpotlightActive && (
			<Spotlight
				dialogPlacement='bottom right'
				actions={[
					{
						onClick: end,
						text: 'Got it',
					},
				]}
				heading="Feature Heading"
				target="my-target"
			>
				This is the spotlight body content describing the feature.
			</Spotlight>
		)}
  );
};

// file2.tsx
import React from 'react';
import Button from '@atlaskit/button/new';
import { Spotlight } from '@atlaskit/onboarding';

const SomeFeature = () => {

  return (
		<SpotlightTarget name="my-target">
			<Button>Target Element</Button>
		</SpotlightTarget>
  );
};
`,
			after: `
// file2.tsx -- the Spotlight has been co-located to the targeted element.
import React, { useState } from 'react';
import Button from '@atlaskit/button/new';
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

const Spotlight = () => {
  const [isVisible, setIsVisible] = useState(false);
  const dismiss = () => setIsVisible(false);
  const done = () => setIsVisible(false);

  return (
    <PopoverProvider>
      <PopoverTarget>
        <Button onClick={() => setIsVisible(true)}>Target Element</Button>
      </PopoverTarget>
      <PopoverContent dismiss={dismiss} placement="bottom-start" isVisible={isVisible}>
        <SpotlightCard>
          <SpotlightHeader>
            <SpotlightHeadline>Feature Heading</SpotlightHeadline>
            <SpotlightControls>
              <SpotlightDismissControl />
            </SpotlightControls>
          </SpotlightHeader>
          <SpotlightBody>
            <Text>This is the spotlight body content describing the feature.</Text>
          </SpotlightBody>
          <SpotlightFooter>
            <SpotlightActions>
              <SpotlightPrimaryAction onClick={done}>Got it</SpotlightPrimaryAction>
            </SpotlightActions>
          </SpotlightFooter>
        </SpotlightCard>
      </PopoverContent>
    </PopoverProvider>
  );
};`,
			explanation: `Key changes when migrating a single step spotlight:
- Do not use this migration guide for JiraSpotlight. Use 'jira-spotlight' instead.
- PopoverProvider maintains internal Spotlight state. SpotlightManager coordinated multiple @atlaskit/onboarding usages and is no longer needed.
- Replace SpotlightTarget with PopoverTarget - wraps the element to highlight
- Replace Spotlight with PopoverContent containing SpotlightCard - controls visibility and positioning
- The 'heading' prop becomes SpotlightHeadline inside SpotlightHeader
- The 'actions' array becomes SpotlightActions with SpotlightPrimaryAction (and optionally SpotlightSecondaryAction)
- The children content moves into SpotlightBody wrapped with Text component
- Add SpotlightDismissControl inside SpotlightControls for the close button
- The 'target' and/or 'targetName' prop is replaced with PopoverTarget directly wrapping the target element
- The 'dialogPlacement' prop becomes 'placement' on PopoverContent. Mapping: "top right" → "top-start", "top center" → "top", "top left" → "top-end", "right bottom" → "right-start", "right middle" → "right-start | right-end", "right top" → "right-end", "bottom left" → "bottom-end", "bottom center" → "bottom", "bottom right" → "bottom-start", "left top" → "left-end", "left middle" → "left-start | left-end", "left bottom" → "left-start"'`,
		},
	],
	bestPractices: [
		'PopoverTarget should wrap exactly one child element that will be highlighted',
		'Always include SpotlightDismissControl for accessibility - allows users to dismiss via close button',
		'SpotlightPrimaryAction is required and wraps the main CTA button',
		'Wrap body text content in the Text component from @atlaskit/primitives/compiled',
	],
	additionalResources,
};
