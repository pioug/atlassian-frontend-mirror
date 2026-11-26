import { avatarXsmallToXxsmall } from './migrations/avatar-xsmall-to-xxsmall';
import { interactionToEntryPoint } from './migrations/interaction-to-entry-point';
import { onboardingJiraSpotlight } from './migrations/onboarding-jira-spotlight';
import { onboardingMultiStep } from './migrations/onboarding-multi-step';
import { onboardingSingleStep } from './migrations/onboarding-single-step';
import { onboardingWithMotion } from './migrations/onboarding-with-motion';
import type { MigrationRegistry } from './types';

export const migrationRegistry: MigrationRegistry = {
	[avatarXsmallToXxsmall.id]: avatarXsmallToXxsmall,
	[interactionToEntryPoint.id]: interactionToEntryPoint,
	[onboardingJiraSpotlight.id]: onboardingJiraSpotlight,
	[onboardingSingleStep.id]: onboardingSingleStep,
	[onboardingMultiStep.id]: onboardingMultiStep,
	[onboardingWithMotion.id]: onboardingWithMotion,
};
