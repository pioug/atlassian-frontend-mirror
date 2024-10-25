import React, { type ReactNode } from 'react';

import { SpotlightPulse } from '@atlaskit/onboarding';

interface Props {
	/** If true, the component will have pulse onboarding effect around it. */
	pulse?: boolean;
	/** The radius of the pulse effect. */
	radius?: number;
	children: ReactNode;
}

/**
 * Wraps children with {@link SpotlightPulse} component.
 *
 * It adds pulse effect to children if `pulse` is `true`.
 *
 * This custom component exists because the {@link SpotlightPulse} with `pulse={false}` renders extra `div` around `children`.
 * We want to keep `children` as it is if there is no `pulse`.
 */
export function Pulse({ pulse, radius = 3, children }: Props) {
	if (pulse) {
		return (
			// SpotlightPulse shows pulse effect if `pulse` is `undefined`.
			// That's why we need to cast `pulse` to `false` if it's `undefined`.
			<SpotlightPulse radius={radius} pulse={pulse ?? false}>
				{children}
			</SpotlightPulse>
		);
	}

	return <>{children}</>;
}
