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
 *
 * @deprecated Use `@atlaskit/spotlight` instead.
 */
const Spotlight = ({
	actions,
	actionsBeforeElement,
	children,
	dialogPlacement,
	dialogWidth = 400,
	footer,
	header,
	heading,
	headingAfterElement,
	image,
	label,
	pulse = true,
	scrollPositionBlock,
	shouldWatchTarget = false,
	target,
	targetBgColor,
	targetNode,
	targetOnClick,
	targetRadius,
	targetReplacement,
	testId = 'spotlight',
	titleId,
	...rest
}: SpotlightProps): React.JSX.Element => (
	<SpotlightConsumer>
		{({ opened, closed, targets }) => {
			// use the targetNode prop or try get the target from context targets using name
			const actualTargetNode: HTMLElement | undefined =
				targetNode || (typeof target === 'string' ? targets[target] : undefined);

			return actualTargetNode ? (
				<SpotlightInner
					{...rest}
					actions={actions}
					actionsBeforeElement={actionsBeforeElement}
					children={children}
					dialogPlacement={dialogPlacement}
					dialogWidth={dialogWidth}
					footer={footer}
					header={header}
					heading={heading}
					headingAfterElement={headingAfterElement}
					image={image}
					label={label}
					onClosed={closed}
					onOpened={opened}
					pulse={pulse}
					scrollPositionBlock={scrollPositionBlock}
					shouldWatchTarget={shouldWatchTarget}
					target={target}
					targetBgColor={targetBgColor}
					targetNode={actualTargetNode}
					targetOnClick={targetOnClick}
					targetRadius={targetRadius}
					targetReplacement={targetReplacement}
					testId={testId}
					titleId={titleId}
				/>
			) : null;
		}}
	</SpotlightConsumer>
);

export default Spotlight;
