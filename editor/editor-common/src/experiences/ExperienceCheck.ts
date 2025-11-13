import type { CustomExperienceMetadata } from './types';

type ExperienceCheckResultStatus = 'success' | 'failure' | 'abort';

export type ExperienceCheckResult = {
	metadata?: CustomExperienceMetadata;
	reason?: string;
	status: ExperienceCheckResultStatus;
};

export type ExperienceCheckCallback = (result: ExperienceCheckResult) => void;

export interface ExperienceCheck {
	start: (callback: ExperienceCheckCallback) => void;
	stop: () => void;
}
