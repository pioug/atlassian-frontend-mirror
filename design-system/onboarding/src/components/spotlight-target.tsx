import React, { type ReactNode } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import NodeResolverSpotlightTarget from './node-resolver-spotlight-target';
import { TargetConsumer } from './spotlight-manager';

interface SpotlightTargetProps {
	/**
	 * A single child.
	 */
	children: ReactNode;
	/**
	 * The name to reference from Spotlight.
	 */
	name: string;
}

/**
 * __Spotlight target__
 *
 * A spotlight target marks a component to be used for introducing new features to users through focused messages or multi-step tours.
 *
 * - [Examples](https://atlassian.design/components/onboarding/examples)
 * - [Code](https://atlassian.design/components/onboarding/code)
 * - [Usage](https://atlassian.design/components/onboarding/usage)
 */
const SpotlightTarget = ({ children, name }: SpotlightTargetProps) => (
	<TargetConsumer>
		{(targetRef) =>
			targetRef ? (
				<NodeResolverSpotlightTarget
					name={name}
					hasNodeResolver={!fg('platform_design_system_team_onboarding_noderesolve')}
					targetRef={targetRef}
				>
					<>{children}</>
				</NodeResolverSpotlightTarget>
			) : (
				children
			)
		}
	</TargetConsumer>
);
export default SpotlightTarget;
