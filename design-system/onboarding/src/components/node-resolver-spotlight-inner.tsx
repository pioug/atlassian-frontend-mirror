import React, { type ReactElement, useEffect, useRef } from 'react';

import NodeResolver from 'react-node-resolver';

interface NodeResolverSpotlightInnerProps {
	hasNodeResolver: boolean;
	innerRef: (element: HTMLElement | null) => void;
	children: ReactElement;
}

/**
 * A wrapper component that conditionally applies a NodeResolver to its children.
 *
 * Note: NodeResolver should not be used in React 18 concurrent mode. This component
 * is intended to be removed once the feature flag  is removed.
 * @param {boolean} props.hasNodeResolver - Determines whether to apply the NodeResolver.
 * @param {ReactElement} props.children - The child elements to be wrapped.
 * @param {(instance: HTMLDivElement) => void} props.innerRef - A ref callback to get the instance of the HTMLDivElement.
 * @returns {ReactElement} The children wrapped with NodeResolver if hasNodeResolver is true, wrape the children in a div setting innerRef with ref to the div.
 */
const NodeResolverSpotlightInner = ({
	hasNodeResolver,
	children,
	innerRef,
}: NodeResolverSpotlightInnerProps): React.JSX.Element => {
	const divRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!hasNodeResolver) {
			innerRef(divRef.current?.firstElementChild as HTMLElement);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hasNodeResolver]);
	if (hasNodeResolver) {
		return <NodeResolver innerRef={innerRef}>{children}</NodeResolver>;
	}

	return <div ref={divRef}>{children}</div>;
};

export default NodeResolverSpotlightInner;
