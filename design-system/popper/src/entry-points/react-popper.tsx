/**
 * Compatibility entry point for consumers that need the unmodified react-popper API while moving
 * dependency ownership to @atlaskit/popper.
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports
export { Manager, Popper, Reference, usePopper } from 'react-popper';
export type {
	Modifier,
	PopperArrowProps,
	PopperChildrenProps,
	PopperProps,
	StrictModifier,
} from 'react-popper';
