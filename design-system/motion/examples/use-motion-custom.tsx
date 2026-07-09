/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';

import Button from '@atlaskit/button/new';
import { cssMap, cx, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading/heading';
import { isReducedMotion } from '@atlaskit/motion/accessibility';
import ExitingPersistence from '@atlaskit/motion/exiting-persistence';
import { Reanimate } from '@atlaskit/motion/motion';
import StaggeredEntrance from '@atlaskit/motion/staggered-entrance';
import { useMotion } from '@atlaskit/motion/use-motion';
import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { RetryContainer } from './utils';

const styles = cssMap({
	box: {
		height: '118px',
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
	},
	block: {
		height: '80px',
		width: '80px',
		backgroundColor: token('color.background.accent.blue.subtle'),
		borderRadius: token('radius.small'),
	},
	init: {
		visibility: 'hidden',
	},
	entering: {
		animationDuration: token('motion.duration.medium'),
		animationTimingFunction: token('motion.easing.out.practical'),
		animationName: token('motion.keyframe.fade.in'),
		animationFillMode: 'backwards',
		animationPlayState: 'running',
	},
	exiting: {
		animationDuration: token('motion.duration.medium'),
		animationTimingFunction: token('motion.easing.in.practical'),
		animationName: token('motion.keyframe.fade.out'),
		animationFillMode: 'forwards',
		animationPlayState: 'running',
	},
});

/**
 * Consumes `useMotion` and applies the animation directly to the element it renders.
 *
 * Unlike the `Motion` component, the hook does not introduce its own wrapper
 * element — the `ref` is attached to the element you already render, and the animation
 * styling is driven by the returned `state` (mapped to a `cssMap` here). This is useful
 * when an extra wrapper would break layout, such as a CSS grid slot that must be a
 * direct child of its grid container.
 */
const AnimatedBox = (): React.JSX.Element => {
	const { ref, state } = useMotion<HTMLElement>();

	return (
		<div
			ref={ref}
			// Apply your own element styling and combine it with the animation styles
			// selected from the hook's `state` via `cx`.
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/ui-styling-standard/local-cx-xcss, @compiled/local-cx-xcss
			className={cx(
				styles.block,
				state === 'init' && styles.init,
				state === 'entering' && styles.entering,
				state === 'exiting' && styles.exiting,
			)}
		/>
	);
};

type ReanimatingBoxHandle = {
	reanimate: (value: Reanimate) => void;
};

/**
 * `useMotion` returns a `reanimate` function that lets you imperatively replay the
 * animation (for example `Reanimate.enter` or `Reanimate.exit_then_enter`). Here it is
 * exposed to the parent via `useImperativeHandle` so a button can trigger it.
 */
const ReanimatingBox = forwardRef<ReanimatingBoxHandle>((_props, forwardedRef) => {
	const { state, ref, reanimate } = useMotion<HTMLElement>();
	const reducedMotion = isReducedMotion();

	useImperativeHandle(forwardedRef, () => ({ reanimate }), [reanimate]);

	return (
		<div
			ref={ref}
			// Apply your own element styling and combine it with the animation styles
			// selected from the hook's `state` via `cx`.
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/ui-styling-standard/local-cx-xcss, @compiled/local-cx-xcss
			className={cx(
				styles.block,
				state === 'init' && !reducedMotion && styles.init,
				state === 'entering' && !reducedMotion && styles.entering,
			)}
		/>
	);
});

export default function UseMotionCustomExample(): React.JSX.Element {
	const [isIn, setIsIn] = useState(true);
	const reanimatingRef = useRef<ReanimatingBoxHandle>(null);

	const handleReanimate = (value: Reanimate): void => {
		reanimatingRef.current?.reanimate(value);
	};

	return (
		<RetryContainer>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ textAlign: 'center' }}>
				<Button onClick={() => setIsIn((prev) => !prev)}>{isIn ? 'Exit' : 'Enter'}</Button>
			</div>
			<Heading size="medium">useMotion (no wrapper element)</Heading>
			<Box xcss={styles.box}>
				<ExitingPersistence appear>{isIn && <AnimatedBox />}</ExitingPersistence>
			</Box>
			<Heading size="medium">useMotion (staggered entrance)</Heading>
			<Box xcss={styles.box}>
				<Inline space="space.100">
					<StaggeredEntrance delayStep={100}>
						<ExitingPersistence appear>
							{isIn && (
								<React.Fragment>
									<AnimatedBox />
									<AnimatedBox />
									<AnimatedBox />
								</React.Fragment>
							)}
						</ExitingPersistence>
					</StaggeredEntrance>
				</Inline>
			</Box>
			<Heading size="medium">Trigger reanimation</Heading>
			<Box xcss={styles.box}>
				<Inline space="space.100">
					<Stack space="space.100">
						<Button onClick={() => handleReanimate(Reanimate.enter)}>Enter</Button>
						<Button onClick={() => handleReanimate(Reanimate.exit_then_enter)}>
							Exit and Enter
						</Button>
					</Stack>
					<ExitingPersistence appear>
						{isIn && <ReanimatingBox ref={reanimatingRef} />}
					</ExitingPersistence>
				</Inline>
			</Box>
		</RetryContainer>
	);
}
