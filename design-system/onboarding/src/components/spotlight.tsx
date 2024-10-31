import React from 'react';

import { type SpotlightProps } from '../types';

import SpotlightInner from './spotlight-inner';
import { SpotlightConsumer } from './spotlight-manager';

/**
 * __Spotlight__
 *
 * An onboarding spotlight introduces new features to users through focused messages or multi-step tours.
 *
 * - [Examples](https://atlassian.design/components/onboarding/examples)
 * - [Code](https://atlassian.design/components/onboarding/code)
 * - [Usage](https://atlassian.design/components/onboarding/usage)
 */
const Spotlight = ({
	dialogWidth = 400,
	pulse = true,
	shouldWatchTarget = false,
	testId = 'spotlight',
	targetNode,
	target,
	...rest
}: SpotlightProps) => (
	<SpotlightConsumer>
		{({ opened, closed, targets }) => {
			// use the targetNode prop or try get the target from context targets using name
			const actualTargetNode: HTMLElement | undefined =
				targetNode || (typeof target === 'string' ? targets[target] : undefined);

			return actualTargetNode ? (
				<SpotlightInner
					{...rest}
					targetNode={actualTargetNode}
					target={target}
					onOpened={opened}
					onClosed={closed}
					testId={testId}
					dialogWidth={dialogWidth}
					pulse={pulse}
					shouldWatchTarget={shouldWatchTarget}
				/>
			) : null;
		}}
	</SpotlightConsumer>
);

export default Spotlight;
