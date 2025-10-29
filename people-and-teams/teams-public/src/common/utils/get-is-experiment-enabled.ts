import FeatureGates from '@atlaskit/feature-gate-js-client';

export const COHORT_PARAMETER = 'cohort';

export const NOT_ENROLLED = 'not-enrolled';
export const CONTROL = 'control';
export const EXPERIMENT = 'experiment';
export const VARIATION = 'variation';
export const VAR1 = 'variation_1';
export const VAR2 = 'variation_2';
export const VAR3 = 'variation_3';
export const VAR4 = 'variation_4';

export const cohorts = {
	NOT_ENROLLED,
	CONTROL,
	EXPERIMENT,
	VARIATION,
	VAR1,
	VAR2,
	VAR3,
	VAR4,
} as const;
export const DEFAULT_VALID_EXPERIMENT_COHORTS = Object.values(cohorts);

export type CohortKeys = keyof typeof cohorts;
export type Cohort = (typeof cohorts)[CohortKeys];

export const getIsExperimentEnabled = (
	experimentName: string,
	variantKey: Cohort = VARIATION,
	validExperimentCohorts: Cohort[] = DEFAULT_VALID_EXPERIMENT_COHORTS,
	fireExperimentExposure = true,
) => {
	if (FeatureGates.initializeCalled()) {
		const cohort = FeatureGates.getExperimentValue(experimentName, COHORT_PARAMETER, NOT_ENROLLED, {
			fireExperimentExposure,
		}) as Cohort;
		const isValid = typeof cohort === 'string' && validExperimentCohorts.includes(cohort);
		return (isValid ? cohort : NOT_ENROLLED) === variantKey;
	}

	return false;
};
