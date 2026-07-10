import React, { useRef, useLayoutEffect, useEffect, Suspense } from 'react';
import type { PropsWithChildren } from 'react';

import { Popper as ReactPopper } from '@atlaskit/popper';
import type { PopperChildrenProps } from '@atlaskit/popper';
import Portal from '@atlaskit/portal';
import { layers } from '@atlaskit/theme/constants';
import { expVal } from '@atlaskit/tmp-editor-statsig/expVal';

import { useFocusTrap } from './useFocusTrap';

interface Props {
	/**
	 * Returns the element to be positioned.
	 */
	children: React.ReactNode;
	/**
	 * Replacement reference element to position popper relative to.
	 */
	referenceElement: HTMLElement;
}

// From `packages/design-system/popup/src/reposition-on-update.tsx`
export const RepositionOnUpdate = ({
	children,
	update,
}: PropsWithChildren<{ update: PopperChildrenProps['update'] }>): React.ReactNode => {
	// Ref used here to skip update on first render (when refs haven't been set)
	const isFirstRenderRef = useRef<boolean>(true);

	useEffect(() => {
		if (isFirstRenderRef.current) {
			isFirstRenderRef.current = false;
			return;
		}
		// callback function from popper that repositions pop-up on content Update
		update();
	}, [update, children]);

	return children;
};

/**
 * Hook that attaches a ResizeObserver to the popup container div and calls
 * forceUpdate whenever the popup's size changes. This handles the case where
 * the popup content changes size due to internal state changes (e.g. the agent
 * profile card transitioning from loading → loaded), which cannot be detected
 * via the `children` prop dependency alone.
 */
function useResizeAwarePopper({
	popupRef,
	forceUpdate,
}: {
	forceUpdate: PopperChildrenProps['forceUpdate'] | undefined;
	popupRef: HTMLDivElement | null;
}): void {
	const forceUpdateRef = useRef(forceUpdate);
	useLayoutEffect(() => {
		forceUpdateRef.current = forceUpdate;
	}, [forceUpdate]);

	useEffect(() => {
		if (!popupRef || typeof ResizeObserver === 'undefined') {
			return;
		}
		const observer = new ResizeObserver(() => {
			// forceUpdate is synchronous unlike update() which is debounced.
			// This ensures Popper recalculates position (and flips if needed)
			// immediately when the popup content grows, before the browser repaints.
			if (typeof forceUpdateRef.current === 'function') {
				forceUpdateRef.current();
			}
		});
		observer.observe(popupRef);
		return () => observer.disconnect();
	}, [popupRef]);
}

/**
 * A popup wrapper to match the behaviour of `@atlaskit/popup`
 *
 * Why not `@atlaskit/popup` directly? It requires a trigger element.
 * We can use this when we have a direct reference to the element
 * and it is more convenient to work directly with the lower level API.
 *
 * @param referenceElement HTMLElement - Replacement reference element to position popper relative to.
 * @param children React.ReactNode - Returns the element to be positioned.
 * @returns React popper component
 */
export function Popup({ referenceElement, children }: Props): React.JSX.Element {
	const [targetRef, setPopupRef] = React.useState<HTMLDivElement | null>(null);

	useFocusTrap({ targetRef: targetRef });
	return (
		<Suspense>
			<Portal zIndex={layers.modal()}>
				<ReactPopper
					referenceElement={referenceElement}
					// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
					offset={[0, 8]}
					placement="bottom-end"
					strategy="fixed"
					// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
					modifiers={
						expVal('platform_editor_agent_mentions', 'isEnabled', false)
							? [
									{ name: 'flip', options: { rootBoundary: 'viewport', padding: 5 } },
									{ name: 'preventOverflow', options: { rootBoundary: 'viewport', padding: 5 } },
								]
							: []
					}
				>
					{({ ref, style, update, forceUpdate }) => (
						<PopupInner
							ref={ref}
							style={style}
							update={update}
							forceUpdate={
								expVal('platform_editor_agent_mentions', 'isEnabled', false)
									? forceUpdate
									: undefined
							}
							setPopupRef={setPopupRef}
						>
							{children}
						</PopupInner>
					)}
				</ReactPopper>
			</Portal>
		</Suspense>
	);
}

const PopupInner = React.forwardRef<
	HTMLDivElement,
	{
		children: React.ReactNode;
		forceUpdate: PopperChildrenProps['forceUpdate'] | undefined;
		setPopupRef: (node: HTMLDivElement) => void;
		style: React.CSSProperties;
		update: PopperChildrenProps['update'];
	}
>(({ style, update, forceUpdate, setPopupRef, children }, ref) => {
	const [popupDiv, setPopupDiv] = React.useState<HTMLDivElement | null>(null);

	useResizeAwarePopper({ popupRef: popupDiv, forceUpdate });

	return (
		<div
			ref={(node: HTMLDivElement) => {
				if (node) {
					if (typeof ref === 'function') {
						ref(node);
					} else if (ref) {
						(ref as React.MutableRefObject<HTMLElement>).current = node;
					}
					setPopupRef(node);
					setPopupDiv(node);
				}
			}}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={style}
		>
			<RepositionOnUpdate update={update}>{children}</RepositionOnUpdate>
		</div>
	);
});
