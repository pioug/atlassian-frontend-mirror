import React, { type ReactNode } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import NodeResolverSpotlightTarget from './node-resolver-spotlight-target';
import { type GetTargetRef, TargetConsumer, type TargetRef } from './spotlight-manager';

type RenderChildrenFunction = (props: {
	/**
	 * Pass this as the `ref` of the element that should be cloned.
	 *
	 * This is useful if:
	 *
	 * - you don't want a wrapping `<div>`
	 * - a component exposes specific children through ref props
	 *
	 * @example
	 * ```tsx
	 * <SpotlightTarget>
	 *   {({ targetRef }) => (
	 *     <OpaqueComponent
	 *       headingRef={targetRef}
	 *     />
	 *   )}
	 * </SpotlightTarget>
	 * ```
	 */
	targetRef?: TargetRef;
}) => ReactNode;

interface SpotlightTargetProps {
	/**
	 * A single child.
	 */
	children: ReactNode | RenderChildrenFunction;
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
		{(getTargetRef: GetTargetRef | undefined) => {
			if (typeof children === 'function') {
				return children({ targetRef: getTargetRef?.(name) });
			}

			return getTargetRef ? (
				<NodeResolverSpotlightTarget
					name={name}
					hasNodeResolver={!fg('platform_design_system_team_onboarding_noderesolve')}
					getTargetRef={getTargetRef}
				>
					<>{children}</>
				</NodeResolverSpotlightTarget>
			) : (
				children
			);
		}}
	</TargetConsumer>
);
export default SpotlightTarget;
