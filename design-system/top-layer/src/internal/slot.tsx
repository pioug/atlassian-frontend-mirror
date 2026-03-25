import {
	cloneElement,
	forwardRef,
	type ForwardRefExoticComponent,
	isValidElement,
	type ReactElement,
	type ReactNode,
	type Ref,
	type RefAttributes,
} from 'react';

import mergeRefs from '@atlaskit/ds-lib/merge-refs';

/**
 * Extra DOM/event props are passed through to the cloned child.
 */
export type SlotProps = {
	children: ReactNode;
} & Record<string, unknown>;

/**
 * Single element child: merge the caller ref with `child.ref`.
 *
 * Do not read `child.props.ref`: React keeps a `ref` key on `props` for
 * host elements but accessing it logs a warning and returns `undefined`
 * (ref lives on the element as `child.ref`).
 */
type TSlotChild = ReactElement & {
	ref?: Ref<HTMLElement> | null;
};

function isSlotChild(child: ReactNode): child is TSlotChild {
	return isValidElement(child);
}

/**
 * Merges props (including ref) onto a single React element child.
 *
 * A safer alternative to raw `cloneElement` that:
 * 1. Guards with `isValidElement` — non-element children (strings,
 *    fragments, null) are returned as-is instead of crashing.
 * 2. Merges refs via `mergeRefs` so both the caller's ref and the
 *    child's existing ref are honoured.
 * 3. Spreads any additional props (ARIA attributes, event handlers, etc.)
 *    onto the child element.
 *
 * Event handlers (e.g. `onClick`) are **not** auto-merged — the caller's
 * handler replaces the child's. Compose handlers before passing them in.
 *
 * @example
 * ```tsx
 * <Slot ref={triggerRef} onClick={handleClick} aria-expanded={isOpen}>
 *   <button>Open</button>
 * </Slot>
 * ```
 */
export const Slot: ForwardRefExoticComponent<SlotProps & RefAttributes<HTMLElement>> = forwardRef<
	HTMLElement,
	SlotProps
>(function Slot(slotProps, ref): ReactNode {
	const { children: rawChildren, ...props } = slotProps;
	// `SlotProps` intersects `Record<string, unknown>`, so `children` is typed as `unknown`.
	const children: ReactNode = rawChildren as ReactNode;

	if (!isSlotChild(children)) {
		return children;
	}

	// eslint-disable-next-line @repo/internal/react/no-clone-element -- Slot is a controlled wrapper around cloneElement with isValidElement guard
	return cloneElement(children, {
		...props,
		ref: mergeRefs<HTMLElement>([ref, children.ref]),
	});
});
