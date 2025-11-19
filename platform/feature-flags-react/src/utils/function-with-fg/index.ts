import { fg } from '@atlaskit/platform-feature-flags';

import { functionWithCondition } from '../function-with-condition';

export const functionWithFG = <Fn extends (...args: any[]) => any>(
	featureFlagName: string,
	functionTrue: Fn,
	functionFalse: Fn,
	// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-registration, @atlaskit/platform/static-feature-flags
): Fn => functionWithCondition(() => fg(featureFlagName), functionTrue, functionFalse);
