import type { MigrationGuide } from '../types';

const additionalResources = "Visit https://hello.atlassian.net/wiki/spaces/DST/pages/6069774593 or https://atlassian.design/components/spotlight for more context"


export const onboardingSingleStep: MigrationGuide = {
	id: 'onboarding-single-step',
	title: 'Single Step Spotlight Migration',
	description:
		'Migrate a single step spotlight from @atlaskit/onboarding to @atlaskit/spotlight',
	fromPackage: '@atlaskit/onboarding',
	toPackage: '@atlaskit/spotlight',
	examples: [
		{
			title: 'Migrate single step spotlight',
			description:
				'Replace SpotlightManager, SpotlightTarget, SpotlightTransition, and Spotlight with the new compositional @atlaskit/spotlight components',
			before: `import React, { useState } from 'react';
import Button from '@atlaskit/button/new';
import {
  Spotlight,
  SpotlightManager,
  SpotlightTarget,
  SpotlightTransition,
} from '@atlaskit/onboarding';

const OnboardingSpotlight = () => {
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
1. Replace SpotlightManager with PopoverProvider - the new context provider
2. Replace SpotlightTarget with PopoverTarget - wraps the element to highlight
3. Replace SpotlightTransition and Spotlight with PopoverContent containing SpotlightCard - controls visibility and positioning
4. The 'heading' prop becomes SpotlightHeadline inside SpotlightHeader
5. The 'actions' array becomes SpotlightActions with SpotlightPrimaryAction (and optionally SpotlightSecondaryAction)
6. The children content moves into SpotlightBody wrapped with Text component
7. Add SpotlightDismissControl inside SpotlightControls for the close button
8. The 'target' prop is no longer needed - PopoverTarget automatically handles this
9. The 'dialogPlacement' prop becomes 'placement' on PopoverContent (e.g., 'bottom left' → 'bottom-start')`,
		},
	],
	bestPractices: [
		'Use PopoverProvider as the root wrapper for spotlight functionality',
		'PopoverTarget should wrap exactly one child element that will be highlighted',
		'Always include SpotlightDismissControl for accessibility - allows users to dismiss via close button',
		'Use SpotlightPrimaryAction for the main call-to-action button',
		'Wrap body text content in the Text component from @atlaskit/primitives/compiled',
		'Map old dialogPlacement values: "bottom left" → "bottom-start", "bottom center" → "bottom", "bottom right" → "bottom-end"',
	],
	additionalResources,
};

export const onboardingMultiStep: MigrationGuide = {
	id: 'onboarding-multi-step',
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
1. Replace the single SpotlightManager with multiple PopoverProvider instances - one for each target element
2. Each target gets its own PopoverProvider > PopoverTarget > PopoverContent structure
3. The spotlight array pattern is replaced with individual SpotlightCard components per target
4. Use a single currentStep state (starting at 0 for hidden, 1+ for active steps) instead of null/index
5. Control visibility with isVisible={currentStep === n} on each PopoverContent
6. Add SpotlightStepCount component in SpotlightFooter to show progress (e.g., "1 of 3")
7. Use SpotlightSecondaryAction for "Back" buttons instead of appearance: 'subtle' in the actions array
8. Use SpotlightPrimaryAction for "Next" and "Done" buttons
9. The renderActiveSpotlight pattern is no longer needed - visibility is controlled declaratively
10. Navigation functions use Math.max/Math.min to bound the step range safely`,
		},
	],
	bestPractices: [
		'Each target element in a tour needs its own PopoverProvider wrapper',
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

export const onboardingWithMotion: MigrationGuide = {
	id: 'onboarding-with-motion',
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
1. Replace SpotlightTransition with FadeIn from @atlaskit/motion
2. Import FadeIn from '@atlaskit/motion' instead of SpotlightTransition from '@atlaskit/onboarding'
3. FadeIn uses a render props pattern - wrap content in {(props) => <div {...props}>...</div>}
4. The entranceDirection prop controls animation direction: 'left', 'right', 'top', or 'bottom'
5. SpotlightCard must be wrapped in a div that receives the animation props
6. PopoverContent now accepts a 'done' prop in addition to 'dismiss' for completed actions
7. All other migration changes from single step spotlight apply (PopoverProvider, compositional components, etc.)`,
		},
	],
	bestPractices: [
		'Use FadeIn from @atlaskit/motion to add entrance animations to spotlights',
		'Choose entranceDirection based on spotlight placement (e.g., "left" for right-placed spotlights)',
		'Always wrap SpotlightCard in a div that receives the animation props from FadeIn',
		'FadeIn uses render props pattern: {(props) => <div {...props}>content</div>}',
		'Pass both done and dismiss props to PopoverContent when using motion',
		'Motion is optional - only add if the original onboarding spotlight used SpotlightTransition for entrance effects',
	],
	additionalResources,
};

