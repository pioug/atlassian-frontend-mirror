import React, { type ReactNode, type Ref, useMemo } from 'react';

import { Reference as ReactPopperReference } from 'react-popper';

import mergeRefs from '@atlaskit/ds-lib/merge-refs';

import { useManagerAnchorSetter } from './internal/use-manager-anchor-setter';

// `react-popper`'s `Reference` exposes a loosely-typed callback ref so
// consumers can attach it to any host element. We mirror that shape
// instead of locking the children ref to `HTMLElement`, which would
// break legacy consumers that pass it to `<button>` / `<div>` directly.
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- mirroring react-popper's public ref shape
type TReferenceRef = Ref<any>;

type TChildrenArgs = {
	ref: TReferenceRef;
};

type TReferenceProps = {
	children: (args: TChildrenArgs) => ReactNode;
	innerRef?: TReferenceRef;
};

/**
 * Wraps `react-popper`'s `<Reference>` so the anchor element it captures
 * is also published through `@atlaskit/popper`'s own bridge context.
 * The bridge lets the FF-on top-layer adapter discover the anchor even
 * when `react-popper`'s CJS and ESM builds resolve to different context
 * instances (Jest vs production bundlers).
 *
 * The bridge + consumer refs are composed into a single stable callback and
 * passed to `react-popper` as `innerRef`, so the (stable) ref `react-popper`
 * hands to `children` never changes identity. Composing inline instead would
 * produce a new ref callback every render, making React detach/reattach the
 * anchor each commit — firing `publishAnchor(null)` then `publishAnchor(el)`
 * and churning the `Manager`.
 */
export function Reference({ children, innerRef }: TReferenceProps): React.JSX.Element {
	const publishAnchor = useManagerAnchorSetter();
	const composedRef = useMemo(
		() => mergeRefs<HTMLElement>([publishAnchor, innerRef]),
		[publishAnchor, innerRef],
	);
	return <ReactPopperReference innerRef={composedRef}>{children}</ReactPopperReference>;
}
