import { createContext } from 'react';

export interface AnimatedIconContextValue {
	/**
	 * Whether the trigger is currently asking icons to animate.
	 */
	isActive: boolean;
	/**
	 * Called by an icon when it starts responding to the trigger. The icon calls `done` once it has
	 * finished. The trigger clears its active state, even if it is still hovered or focused, only after
	 * every icon that started has called `done`, so icons with different durations all play through.
	 * The trigger becomes active again the next time it is entered.
	 *
	 * `done` does nothing when called more than once, or after the trigger has deactivated on its own.
	 * `cancel` is for an icon that stops before finishing: it stops the trigger waiting for the icon
	 * without counting it as finished.
	 */
	start: () => AnimatedIconTriggerHandle;
}

export interface AnimatedIconTriggerHandle {
	done: () => void;
	cancel: () => void;
}

/**
 * Carries the state of the nearest `AnimatedIconTrigger`. `undefined` means there is none.
 */
export const AnimatedIconContext: import('react').Context<AnimatedIconContextValue | undefined> =
	createContext<AnimatedIconContextValue | undefined>(undefined);
