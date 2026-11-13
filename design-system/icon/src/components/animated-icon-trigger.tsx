/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	type FocusEvent,
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';

import { css, jsx } from '@compiled/react';

import { AnimatedIconContext } from './animated-icon-context';

const wrapperStyles = css({
	display: 'contents',
});

const isFocusVisible = (element: EventTarget): boolean => {
	try {
		return (element as Element).matches(':focus-visible');
	} catch {
		// Environments without `:focus-visible` support: treat every focus as keyboard focus.
		return true;
	}
};

export interface AnimatedIconTriggerProps {
	/**
	 * Animated icons inside this component respond to its active state.
	 */
	children: ReactNode;
	/**
	 * What activates the trigger. Defaults to `hover`.
	 *
	 * - `hover`: active while hovered, or while keyboard focus is inside. Leaving interrupts the motion.
	 * - `click`: becomes active on a click inside (which includes keyboard activation of buttons and links).
	 *   Hover and focus are ignored, and the motion always plays through to completion.
	 *
	 * Ignored when `isActive` is set.
	 */
	trigger?: 'hover' | 'click';
	/**
	 * Controls the active state. When set, no wrapper element is rendered and `trigger` is ignored.
	 * Use this to trigger motion from something else, such as a loading state.
	 */
	isActive?: boolean;
	/**
	 * Called when an icon inside has finished animating and asks for the active state to be cleared.
	 * Only used when `isActive` is set; update your state here to make `isActive` false.
	 */
	onReset?: () => void;
	/**
	 * A unique string that appears as a data attribute `data-testid` on the wrapper element,
	 * which is only rendered when `isActive` is not set.
	 */
	testId?: string;
}

/**
 * __Animated icon trigger__
 *
 * Tells animated icons inside it when to animate, without passing props or refs down.
 * Becomes active on hover (and keyboard focus) or on click, depending on `trigger`.
 */
const AnimatedIconTrigger = ({
	children,
	isActive: isActiveProp,
	onReset,
	testId,
	trigger = 'hover',
}: AnimatedIconTriggerProps): JSX.Element => {
	// Entering (hover) or clicking (click) activates it, and it clears once every icon that started has finished.
	// In `hover` mode, leaving also clears it.
	// One flag (rather than hover and focus separately) lets the motion end while still hovered.
	const [isActiveState, setIsActiveState] = useState(false);
	const isControlled = isActiveProp !== undefined;
	const isActive = isControlled ? isActiveProp : isActiveState;

	// Keep the latest `onReset` in a ref so `start` (and the context value) stays stable when a consumer
	// passes an inline function. Icons can then depend on `start` without restarting their motion.
	const onResetRef = useRef(onReset);
	useEffect(() => {
		onResetRef.current = onReset;
	}, [onReset]);

	// One entry per icon motion that has started and not yet finished. Icons can have different durations,
	// so the trigger only clears once the last of them is done, rather than when the first one finishes.
	const pendingRef = useRef(new Set<symbol>());

	// Motions that were cancelled when the trigger went inactive never call `done`. Forget them so they
	// can't keep the next activation from clearing, and so a late `done` from a motion that plays on
	// after the trigger went inactive can't clear a newer activation.
	useEffect(() => {
		if (!isActive) {
			pendingRef.current.clear();
		}
	}, [isActive]);

	const start = useCallback(() => {
		const token = Symbol('animated-icon');
		pendingRef.current.add(token);
		return {
			done: () => {
				if (!pendingRef.current.delete(token) || pendingRef.current.size > 0) {
					return;
				}
				if (isControlled) {
					onResetRef.current?.();
				} else {
					setIsActiveState(false);
				}
			},
			cancel: () => {
				pendingRef.current.delete(token);
			},
		};
	}, [isControlled]);

	const value = useMemo(() => ({ isActive, start }), [isActive, start]);

	if (isControlled) {
		return <AnimatedIconContext.Provider value={value}>{children}</AnimatedIconContext.Provider>;
	}

	const handleFocus = (event: FocusEvent<HTMLElement>) => {
		if (isFocusVisible(event.target)) {
			setIsActiveState(true);
		}
	};

	const handleBlur = (event: FocusEvent<HTMLElement>) => {
		// Focus moving between children of the trigger should not deactivate it.
		if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
			return;
		}
		setIsActiveState(false);
	};

	return (
		<AnimatedIconContext.Provider value={value}>
			{/* The wrapper only listens for bubbled events from interactive descendants. */}
			<div
				role="presentation"
				css={wrapperStyles}
				data-testid={testId}
				{...(trigger === 'click'
					? { onClick: () => setIsActiveState(true) }
					: {
							onMouseEnter: () => setIsActiveState(true),
							onMouseLeave: () => setIsActiveState(false),
							onFocus: handleFocus,
							onBlur: handleBlur,
						})}
			>
				{children}
			</div>
		</AnimatedIconContext.Provider>
	);
};

export default AnimatedIconTrigger;
