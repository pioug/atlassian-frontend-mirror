import React, { useRef, useEffect, type PropsWithChildren, Suspense } from 'react';

import { Popper as ReactPopper, type PopperChildrenProps } from '@atlaskit/popper';
import Portal from '@atlaskit/portal';
import { layers } from '@atlaskit/theme/constants';

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
}: PropsWithChildren<{ update: PopperChildrenProps['update'] }>) => {
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
					offset={[0, 8]}
					placement="bottom-end"
					strategy="fixed"
				>
					{({ ref, style, update }) => (
						<div
							ref={(node: HTMLDivElement) => {
								if (node) {
									if (typeof ref === 'function') {
										ref(node);
									} else {
										(ref as React.MutableRefObject<HTMLElement>).current = node;
									}
									setPopupRef(node);
								}
							}}
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
							style={style}
						>
							<RepositionOnUpdate update={update}>{children}</RepositionOnUpdate>
						</div>
					)}
				</ReactPopper>
			</Portal>
		</Suspense>
	);
}
