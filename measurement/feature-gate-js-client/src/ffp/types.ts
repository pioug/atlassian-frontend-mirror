/**
 * The type of the Feature Flag Platform (FFP) client returned by `FeatureGates.ffpClient`.
 *
 * The types it uses (`EvaluationDetails`, `EvaluationOptions` and the rest) are not re-exported
 * here; import them from `@atlaskit/flag-client/types`.
 */
import type { FlagClient } from '@atlaskit/flag-client/client';

/**
 * The evaluation methods of a `FlagClient`, for reading flags that only exist in FFP.
 *
 * Initialization and user changes are managed by `FeatureGates`, so they are not part of this type.
 * A `FlagClient` satisfies it, so code written against it keeps compiling with a `FlagClient`.
 */
export type FfpEvaluationClient = Pick<
	FlagClient,
	| 'getBooleanValue'
	| 'getStringValue'
	| 'getNumberValue'
	| 'getObjectValue'
	| 'getBooleanDetails'
	| 'getStringDetails'
	| 'getNumberDetails'
	| 'getObjectDetails'
	| 'logExposure'
>;
