import React from 'react';

import { Popper as ReactPopper } from '@atlaskit/popper';
import Portal from '@atlaskit/portal';

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
	return (
		<Portal>
			<ReactPopper
				referenceElement={referenceElement}
				offset={[0, 8]}
				placement="bottom-end"
				strategy="fixed"
			>
				{({ ref, style }) => (
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
					<div ref={ref} style={style}>
						{children}
					</div>
				)}
			</ReactPopper>
		</Portal>
	);
}
