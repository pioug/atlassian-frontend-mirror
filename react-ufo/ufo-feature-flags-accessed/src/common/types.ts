import type { NON_BOOLEAN_VALUE } from './constants';

export type FeatureFlagValue =
	| boolean
	| string
	| number
	| Record<any, any>
	| typeof NON_BOOLEAN_VALUE;
