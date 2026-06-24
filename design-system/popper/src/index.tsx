export { Popper, placements } from './popper';
export type {
	ManagerProps,
	ReferenceProps,
	PopperProps,
	PopperArrowProps,
	PopperChildrenProps,
	StrictModifier,
	Modifier,
	Placement,
	CustomPopperProps,
} from './popper';

// `Manager` and `Reference` are re-exported through our own wrappers so
// the anchor element captured by `<Reference>` reaches `<Popper>` via a
// single shared context instance, sidestepping the dual CJS/ESM context
// duplication shipped by `react-popper`.
export { Manager } from './manager';
export { Reference } from './reference';
