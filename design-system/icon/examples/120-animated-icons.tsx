/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useRef, useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading/heading';
import AnimatedIconTrigger from '@atlaskit/icon/animated-icon-trigger';
import AiGenerativeRemoveSilenceAnimatedIcon from '@atlaskit/icon/animated/ai-generative-remove-silence';
import AiGenerativeTextAnimatedIcon from '@atlaskit/icon/animated/ai-generative-text';
import AiGenerativeTextSummaryAnimatedIcon from '@atlaskit/icon/animated/ai-generative-text-summary';
import AiSearchAnimatedIcon from '@atlaskit/icon/animated/ai-search';
import MagicWandAnimatedIcon from '@atlaskit/icon/animated/magic-wand';
import SignatureAnimatedIcon from '@atlaskit/icon/animated/signature';
import TextReviewAnimatedIcon from '@atlaskit/icon/animated/text-review';
import type { AnimatedIconRef, NewCoreIconProps } from '@atlaskit/icon/types';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: { paddingBlock: token('space.200'), paddingInline: token('space.200') },
});

type AnimatedIconComponent = React.ComponentType<
	NewCoreIconProps & React.RefAttributes<AnimatedIconRef>
>;

/**
 * Add every icon published from `@atlaskit/icon/animated/*` to this list so it shows up in the example.
 */
const animatedIcons: { name: string; Icon: AnimatedIconComponent }[] = [
	{ name: 'ai-generative-text', Icon: AiGenerativeTextAnimatedIcon },
	{ name: 'signature', Icon: SignatureAnimatedIcon },
	{ name: 'ai-search', Icon: AiSearchAnimatedIcon },
	{ name: 'magic-wand', Icon: MagicWandAnimatedIcon },
	{ name: 'ai-generative-text-summary', Icon: AiGenerativeTextSummaryAnimatedIcon },
	{ name: 'ai-generative-remove-silence', Icon: AiGenerativeRemoveSilenceAnimatedIcon },
	{ name: 'text-review', Icon: TextReviewAnimatedIcon },
];

const AnimatedIconRow = ({ name, Icon }: { name: string; Icon: AnimatedIconComponent }) => {
	const iconRef = useRef<AnimatedIconRef>(null);
	const [isActive, setIsActive] = useState(false);

	return (
		<Stack space="space.100">
			<Heading size="xsmall">{name}</Heading>
			<Inline space="space.200" alignBlock="center">
				<Icon ref={iconRef} label={name} testId={`animated-icon-${name}`} />
				<Button onClick={() => iconRef.current?.reanimate()}>Reanimate</Button>
			</Inline>
			<Inline space="space.200" alignBlock="center">
				<AnimatedIconTrigger>
					<Button iconBefore={(iconProps) => <Icon {...iconProps} />}>Hover or focus me</Button>
				</AnimatedIconTrigger>
				<AnimatedIconTrigger trigger="click">
					<Button iconBefore={(iconProps) => <Icon {...iconProps} />}>Click me</Button>
				</AnimatedIconTrigger>
				<AnimatedIconTrigger isActive={isActive} onReset={() => setIsActive(false)}>
					<Button
						iconBefore={(iconProps) => <Icon {...iconProps} />}
						onClick={() => setIsActive(true)}
					>
						Click to trigger (controlled)
					</Button>
				</AnimatedIconTrigger>
			</Inline>
		</Stack>
	);
};

const AnimatedIconsExample = (): React.JSX.Element => (
	<Stack space="space.300" alignInline="start" xcss={styles.root}>
		<Heading size="small">Animated icons</Heading>
		<p>
			Hover or focus a button wrapped in AnimatedIconTrigger to animate the icon inside it, or press
			Reanimate to restart the first icon via its ref. Animation is disabled when reduced motion is
			on.
		</p>
		{animatedIcons.map(({ name, Icon }) => (
			<AnimatedIconRow key={name} name={name} Icon={Icon} />
		))}
	</Stack>
);

export default AnimatedIconsExample;
