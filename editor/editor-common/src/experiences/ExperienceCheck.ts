type ExperienceCheckSuccessResult = {
	status: 'success';
};

type ExperienceCheckFailureResult = {
	reason?: string;
	status: 'failure';
};

export type ExperienceCheckResult = ExperienceCheckSuccessResult | ExperienceCheckFailureResult;

export type ExperienceCheckCallback = (result: ExperienceCheckResult) => void;

export interface ExperienceCheck {
	start: (callback: ExperienceCheckCallback) => void;
	stop: () => void;
}
