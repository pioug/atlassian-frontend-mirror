import type { MigrationGuide } from '../types';

const additionalResources =
	'Visit https://hello.atlassian.net/wiki/spaces/DST/pages/6069774593 or https://atlassian.design/components/spotlight for more context';

export const onboardingMultiStep: MigrationGuide = {
	id: 'multi-step',
	title: 'Multi Step Spotlight Tour Migration',
	description:
		'Migrate a multi-step spotlight tour from @atlaskit/onboarding to @atlaskit/spotlight',
	fromPackage: '@atlaskit/onboarding',
	toPackage: '@atlaskit/spotlight',
	examples: [
		{
			title: 'Migrate multi step spotlight tour',
			description:
				'Replace the single SpotlightManager pattern with multiple PopoverProvider instances, one for each target in the tour',
			before: `import React, { useState } from 'react';
import Button, { IconButton } from '@atlaskit/button/new';
import CommentAddIcon from '@atlaskit/icon/core/comment-add';
import CopyIcon from '@atlaskit/icon/core/copy';
import {
  Spotlight,
  SpotlightManager,
  SpotlightTarget,
  SpotlightTransition,
} from '@atlaskit/onboarding';

const OnboardingTour = () => {
  const [activeSpotlight, setActiveSpotlight] = useState<null | number>(null);
  const start = () => setActiveSpotlight(0);
  const next = () => setActiveSpotlight((activeSpotlight || 0) + 1);
  const back = () => setActiveSpotlight((activeSpotlight || 1) - 1);
  const end = () => setActiveSpotlight(null);

  const renderActiveSpotlight = () => {
    const spotlights = [
      <Spotlight
        actions={[
          { onClick: () => next(), text: 'Next' },
          { onClick: () => end(), text: 'Dismiss', appearance: 'subtle' },
        ]}
        heading="Add a comment"
        target="comment"
        key="comment"
      >
        Quickly add a comment to the work item.
      </Spotlight>,
      <Spotlight
        actions={[
          { onClick: () => end(), text: 'Done' },
          { onClick: () => back(), text: 'Back', appearance: 'subtle' },
        ]}
        heading="Copy code"
        target="copy"
        key="copy"
      >
        Click to copy the example code to your clipboard.
      </Spotlight>,
    ];

    if (activeSpotlight === null) {
      return null;
    }
    return spotlights[activeSpotlight];
  };

  return (
    <SpotlightManager>
      <SpotlightTarget name="comment">
        <IconButton icon={CommentAddIcon} label="comment" />
      </SpotlightTarget>
      <SpotlightTarget name="copy">
        <IconButton icon={CopyIcon} label="Copy" />
      </SpotlightTarget>
      <Button appearance="primary" onClick={start}>
        Start tour
      </Button>
      <SpotlightTransition>{renderActiveSpotlight()}</SpotlightTransition>
    </SpotlightManager>
  );
};`,
			after: `import React, { useState } from 'react';
import Button, { IconButton } from '@atlaskit/button/new';
import CommentAddIcon from '@atlaskit/icon/core/comment-add';
import CopyIcon from '@atlaskit/icon/core/copy';
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
  SpotlightSecondaryAction,
  SpotlightStepCount,
} from '@atlaskit/spotlight';

const SpotlightTour = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const dismiss = () => setCurrentStep(0);
  const back = () => setCurrentStep(Math.max(currentStep - 1, 1));
  const next = () => setCurrentStep(Math.min(currentStep + 1, 2));
  const done = () => setCurrentStep(0);

  return (
    <>
      <PopoverProvider>
        <PopoverTarget>
          <IconButton icon={CommentAddIcon} label="comment" />
        </PopoverTarget>
        <PopoverContent dismiss={dismiss} placement="bottom-start" isVisible={currentStep === 1}>
          <SpotlightCard>
            <SpotlightHeader>
              <SpotlightHeadline>Add a comment</SpotlightHeadline>
              <SpotlightControls>
                <SpotlightDismissControl onClick={dismiss} />
              </SpotlightControls>
            </SpotlightHeader>
            <SpotlightBody>
              <Text>Quickly add a comment to the work item.</Text>
            </SpotlightBody>
            <SpotlightFooter>
              <SpotlightStepCount>1 of 2</SpotlightStepCount>
              <SpotlightActions>
                <SpotlightPrimaryAction onClick={next}>Next</SpotlightPrimaryAction>
              </SpotlightActions>
            </SpotlightFooter>
          </SpotlightCard>
        </PopoverContent>
      </PopoverProvider>

      <PopoverProvider>
        <PopoverTarget>
          <IconButton icon={CopyIcon} label="Copy" />
        </PopoverTarget>
        <PopoverContent dismiss={dismiss} placement="bottom-start" isVisible={currentStep === 2}>
          <SpotlightCard>
            <SpotlightHeader>
              <SpotlightHeadline>Copy code</SpotlightHeadline>
              <SpotlightControls>
                <SpotlightDismissControl onClick={dismiss} />
              </SpotlightControls>
            </SpotlightHeader>
            <SpotlightBody>
              <Text>Click to copy the example code to your clipboard.</Text>
            </SpotlightBody>
            <SpotlightFooter>
              <SpotlightStepCount>2 of 2</SpotlightStepCount>
              <SpotlightActions>
                <SpotlightSecondaryAction onClick={back}>Back</SpotlightSecondaryAction>
                <SpotlightPrimaryAction onClick={done}>Done</SpotlightPrimaryAction>
              </SpotlightActions>
            </SpotlightFooter>
          </SpotlightCard>
        </PopoverContent>
      </PopoverProvider>

      <Button appearance="primary" onClick={() => setCurrentStep(1)}>
        Start tour
      </Button>
    </>
  );
};`,
			explanation: `Key changes when migrating a multi-step spotlight tour:
- SpotlightManager coordinated multiple spotlights in a tour. PopoverProvider manages internal state for a single spotlight.
- Each target gets its own PopoverProvider > PopoverTarget > PopoverContent structure
- The spotlight array pattern is replaced with individual SpotlightCard components per target
- Control visibility with isVisible={currentStep === n} on each PopoverContent
- Add SpotlightStepCount component in SpotlightFooter to show progress (e.g., "1 of 3")
- Use SpotlightSecondaryAction for "Back" buttons instead of appearance: 'subtle' in the actions array
- Use SpotlightPrimaryAction for "Next" and "Done" buttons
- The renderActiveSpotlight pattern is no longer needed - visibility is controlled declaratively
- Navigation functions use Math.max/Math.min to bound the step range safely
- All other migration changes from single step spotlight migration guide apply.`,
		},
	],
	bestPractices: [
		'Use a numeric currentStep state where 0 = hidden, 1+ = active step number',
		'Always include SpotlightStepCount in multi-step tours for user orientation',
		'First step should only have "Next" action, middle steps have "Back" and "Next", last step has "Back" and "Done"',
		'Use SpotlightSecondaryAction for back/dismiss actions and SpotlightPrimaryAction for next/done',
		'Include SpotlightDismissControl with onClick={dismiss} so users can exit the tour at any point',
		'Bound navigation functions with Math.max/Math.min to prevent invalid step values',
		'Preference duplicating Spotlight code instead of trying to have a single `@atlaskit/spotlight` instance that conditionally renders content based on step.',
	],
	additionalResources,
};
