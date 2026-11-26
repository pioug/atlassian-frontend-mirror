/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React, { forwardRef, type Ref, useEffect, useImperativeHandle } from 'react';

import type { XCSSProp } from '@compiled/react';

import { cssMap, cx, jsx, type XCSSAllProperties, type XCSSAllPseudos } from '@atlaskit/css';
import { type Motion as MotionToken } from '@atlaskit/tokens/css-type-schema';

import { Reanimate } from './reanimate';
import { type Transition } from './types';
import { type CustomMotionXCSS, useMotion } from './use-motion';

export type { CustomMotionXCSS } from './use-motion';

const initialStateByAction = {
	enter: 'visible',
	exit: 'hidden',
} as const;

const styles = cssMap({
	hidden: {
		visibility: 'hidden',
	},
});

export interface MotionRef {
	/**
	 * Reanimates the motion.
	 * @param value - The value to reanimate.
	 */
	reanimate: (value: Reanimate) => void;
}

export interface MotionProps {
	/**
	 * Will callback when the motion has finished in the particular direction.
	 * If it finished entering direction will be `entering`.
	 * And vice versa for `exiting`.
	 */
	onFinish?: (state: Transition) => void;

	/**
	 * Children to be animated.
	 */
	children: React.ReactNode;

	/**
	 * Motion token for the entering animation.
	 */
	enteringAnimation?: MotionToken;

	/**
	 * CSS properties to apply to the entering animation.
	 */
	enteringAnimationXcss?: CustomMotionXCSS;

	/**
	 * Motion token for the exiting animation.
	 */
	exitingAnimation?: MotionToken;

	/**
	 * CSS properties to apply to the exiting animation.
	 */
	exitingAnimationXcss?: CustomMotionXCSS;

	/**
	 * CSS properties to apply to the motion container.
	 */
	xcss?: XCSSProp<XCSSAllProperties, XCSSAllPseudos>;

	/**
	 * Inline styles to apply to the motion container div.
	 * These are merged with any animation styles managed internally.
	 */
	style?: React.CSSProperties;

	/**
	 * The action to perform on the motion.
	 */
	action?: 'enter' | 'exit';

	/**
	 * A `testId` prop is provided for specified elements,
	 * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 */
	testId?: string;
}

/**
 * __Motion__
 *
 * A motion primitive that can be used to animate the entry and exit of components.
 */
const Motion: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<MotionProps> & React.RefAttributes<any>
> = forwardRef(
	(
		{
			children,
			enteringAnimation,
			enteringAnimationXcss,
			exitingAnimation,
			exitingAnimationXcss,
			onFinish: onFinishMotion,
			action,
			xcss,
			style: styleProp,
			testId,
		},
		ref: Ref<any>,
	): React.JSX.Element | null => {
		const {
			state,
			ref: motionRef,
			reanimate,
		} = useMotion<HTMLDivElement>({
			onFinish: onFinishMotion,
			initialState: action ? initialStateByAction[action] : undefined,
		});

		useImperativeHandle(ref, () => ({ reanimate }), [reanimate]);

		useEffect(() => {
			if (action === 'exit' && state !== 'exiting' && state !== 'hidden') {
				reanimate(Reanimate.exit);
			} else if (action === 'enter' && (state === 'exiting' || state === 'hidden')) {
				reanimate(Reanimate.enter);
			}
		}, [action, reanimate, state]);

		if (state === 'hidden') {
			return null;
		}

		// `xcss` and `style` apply to the wrapper `<div>` the `Motion` component renders,
		// so they are merged here (not in the hook) alongside the hook's animation output.
		return (
			<div
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/ui-styling-standard/local-cx-xcss, @compiled/local-cx-xcss
				className={cx(
					xcss,
					state === 'entering' && enteringAnimationXcss,
					state === 'exiting' && exitingAnimationXcss,
				)}
				css={[state === 'init' && styles.hidden]}
				ref={motionRef}
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
					...styleProp,
					animation:
						state === 'entering'
							? enteringAnimation
							: state === 'exiting'
								? exitingAnimation
								: undefined,
				}}
				data-testid={testId}
			>
				{children}
			</div>
		);
	},
);

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export default Motion;
