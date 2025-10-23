export type Placement =
	| 'top-start'
	| 'top-center'
	| 'top-end'
	| 'bottom-start'
	| 'bottom-center'
	| 'bottom-end'
	| 'right-start'
	| 'right-end'
	| 'left-start'
	| 'left-end';

/**
 * Spotlights can be dismissed by:
 * 1. Clicking the `SpotlightDismissControl`
 * 2. Clicking any DOM element outside the spotlight
 * 3. Pressing the Escape key
 *
 * These events align to the `React.MouseEvent<HTMLButtonElement, MouseEvent>`, `MouseEvent`, and `KeyboardEvent` events respectively.
 */
export type DismissEvent =
	| React.MouseEvent<HTMLButtonElement, MouseEvent>
	| MouseEvent
	| KeyboardEvent;

export type BackEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>;
export type NextEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>;
export type DoneEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>;
