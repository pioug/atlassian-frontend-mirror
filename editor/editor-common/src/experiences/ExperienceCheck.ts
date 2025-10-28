import type { CustomData } from '@atlaskit/ufo';

type ExperienceCheckResultStatus = 'success' | 'failure' | 'abort';

export type ExperienceCheckResult = {
	metadata?: CustomData;
	status: ExperienceCheckResultStatus;
};

export type ExperienceCheckCallback = (result: ExperienceCheckResult) => void;

export interface ExperienceCheck {
	start: (callback: ExperienceCheckCallback) => void;
	stop: () => void;
}
