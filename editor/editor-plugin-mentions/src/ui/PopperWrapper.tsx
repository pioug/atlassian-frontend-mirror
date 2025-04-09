import React from 'react';

import { Popper as ReactPopper } from '@atlaskit/popper';
import Portal from '@atlaskit/portal';

import { useFocusTrap } from './useFocusTrap';

interface Props {
	/**
	 * Replacement reference element to position popper relative to.
	 */
	referenceElement: HTMLElement;
	/**
	 * Returns the element to be positioned.
	 */
	children: React.ReactNode;
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
export function Popup({ referenceElement, children }: Props) {
	const [targetRef, setPopupRef] = React.useState<HTMLDivElement | null>(null);

	useFocusTrap({ targetRef: targetRef });
	return (
		<Portal>
			<ReactPopper
				referenceElement={referenceElement}
				offset={[0, 8]}
				placement="bottom-end"
				strategy="fixed"
			>
				{({ ref, style }) => (
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
						{children}
					</div>
				)}
			</ReactPopper>
		</Portal>
	);
}
