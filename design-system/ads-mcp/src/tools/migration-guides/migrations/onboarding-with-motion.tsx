import type { MigrationGuide } from '../types';

const additionalResources =
	'Visit https://hello.atlassian.net/wiki/spaces/DST/pages/6069774593 or https://atlassian.design/components/spotlight for more context';

export const onboardingWithMotion: MigrationGuide = {
	id: 'motion',
	title: 'Single Step Spotlight with Motion Migration',
	description:
		'Migrate a single step spotlight with entrance animation from @atlaskit/onboarding to @atlaskit/spotlight using @atlaskit/motion',
	fromPackage: '@atlaskit/onboarding',
	toPackage: '@atlaskit/spotlight',
	examples: [
		{
			title: 'Migrate spotlight with transition animation',
			description:
				'Replace SpotlightTransition with FadeIn from @atlaskit/motion wrapped around the SpotlightCard',
			before: `import React, { useState } from 'react';
import Button from '@atlaskit/button/new';
import {
  Spotlight,
  SpotlightManager,
  SpotlightTarget,
  SpotlightTransition,
} from '@atlaskit/onboarding';

const OnboardingSpotlightWithTransition = () => {
  const [isSpotlightActive, setIsSpotlightActive] = useState(false);
  const start = () => setIsSpotlightActive(true);
  const end = () => setIsSpotlightActive(false);

  return (
    <SpotlightManager>
      <SpotlightTarget name="my-target">
        <Button>Target Element</Button>
      </SpotlightTarget>
      <div>
        <Button appearance="primary" onClick={start}>
          Show spotlight
        </Button>
      </div>
      <SpotlightTransition>
        {isSpotlightActive && (
          <Spotlight
            actions={[
              {
                onClick: end,
                text: 'Got it',
              },
            ]}
            heading="Feature Heading"
            target="my-target"
            key="my-target"
          >
            This is the spotlight body content describing the feature.
          </Spotlight>
        )}
      </SpotlightTransition>
    </SpotlightManager>
  );
};`,
			after: `import React, { useState } from 'react';
import Button from '@atlaskit/button/new';
import { FadeIn } from '@atlaskit/motion';
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

const SpotlightWithMotion = () => {
  const [isVisible, setIsVisible] = useState(false);
  const dismiss = () => setIsVisible(false);
  const done = () => setIsVisible(false);

  return (
    <PopoverProvider>
      <PopoverTarget>
        <Button onClick={() => setIsVisible(true)}>Target Element</Button>
      </PopoverTarget>
      <PopoverContent done={done} dismiss={dismiss} placement="bottom-start" isVisible={isVisible}>
        <FadeIn entranceDirection="left">
          {(props) => (
            <div {...props}>
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
            </div>
          )}
        </FadeIn>
      </PopoverContent>
    </PopoverProvider>
  );
};`,
			explanation: `Key changes when migrating a spotlight with transition animation:
- Replace SpotlightTransition with FadeIn from @atlaskit/motion
- Import FadeIn from '@atlaskit/motion' instead of SpotlightTransition from '@atlaskit/onboarding'
- FadeIn uses a render props pattern - wrap content in {(props) => <div {...props}>...</div>}
- The entranceDirection prop controls animation direction: 'left', 'right', 'top', or 'bottom'
- All other migration changes from single step spotlight apply (PopoverProvider, compositional components, etc.)`,
		},
	],
	bestPractices: [
		'Choose entranceDirection based on spotlight placement (e.g., "left" for right-placed spotlights)',
		'Motion is optional - only add if the original onboarding spotlight used SpotlightTransition for entrance effects',
	],
	additionalResources,
};
