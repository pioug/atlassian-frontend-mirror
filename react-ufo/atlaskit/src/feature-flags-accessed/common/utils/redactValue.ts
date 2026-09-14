import { NON_BOOLEAN_VALUE } from '../constants';
import type { FeatureFlagValue } from '../types';

import { shouldRedactValue } from './shouldRedactValue';

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function redactValue(featureFlagValue: FeatureFlagValue): FeatureFlagValue {
	return shouldRedactValue(featureFlagValue) ? NON_BOOLEAN_VALUE : featureFlagValue;
}
