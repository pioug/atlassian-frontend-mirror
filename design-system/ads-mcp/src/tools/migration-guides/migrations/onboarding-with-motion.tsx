import type { MigrationGuide } from '../types';

const additionalResources =
	'Visit https://hello.atlassian.net/wiki/spaces/DST/pages/6069774593 or https://atlassian.design/components/spotlight for more context';

export const onboardingWithMotion: MigrationGuide = {
	id: 'motion',
	title: 'Single Step Spotlight with Motion Migration',
	description:
		'Migrate a single step spotlight with entrance animation from @atlaskit/onboarding to @atlaskit/spotlight, which owns its default motion',
	fromPackage: '@atlaskit/onboarding',
	toPackage: '@atlaskit/spotlight',
	examples: [
		{
			title: 'Migrate spotlight with transition animation',
			description:
				'Remove SpotlightTransition because @atlaskit/spotlight applies its default motion internally',
			before: `import React, { useState } from 'react';
import Button from '@atlaskit/button/default/button';
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
import Button from '@atlaskit/button/default/button';
import { Text } from '@atlaskit/primitives/compiled';
import { PopoverContent } from '@atlaskit/spotlight/popover-content';
import { PopoverProvider } from '@atlaskit/spotlight/popover-provider';
import { PopoverTarget } from '@atlaskit/spotlight/popover-target';
import { SpotlightActions } from '@atlaskit/spotlight/actions';
import { SpotlightBody } from '@atlaskit/spotlight/body';
import { SpotlightCard } from '@atlaskit/spotlight/card';
import { SpotlightControls } from '@atlaskit/spotlight/controls';
import { SpotlightDismissControl } from '@atlaskit/spotlight/dismiss-control';
import { SpotlightFooter } from '@atlaskit/spotlight/footer';
import { SpotlightHeader } from '@atlaskit/spotlight/header';
import { SpotlightHeadline } from '@atlaskit/spotlight/headline';
import { SpotlightPrimaryAction } from '@atlaskit/spotlight/primary-action';

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
			explanation: `Key changes when migrating a spotlight with transition animation:
- Remove SpotlightTransition; PopoverContent applies the default spotlight motion internally
- Do not add a separate @atlaskit/motion wrapper around SpotlightCard
- Pass motion={null} to PopoverContent only when motion must be disabled
- Pass a custom motion component to PopoverContent's motion prop only when the default treatment does not meet the approved design
- All other migration changes from single step spotlight apply (PopoverProvider, compositional components, etc.)`,
		},
	],
	bestPractices: [
		'Use the default motion owned by PopoverContent',
		'Pass motion={null} to PopoverContent to disable motion, or pass a custom motion component only for an approved custom treatment',
	],
	additionalResources,
};
