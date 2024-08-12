import React, { type FC, type ReactElement } from 'react';

import NodeResolver from 'react-node-resolver';

interface NodeResolverWrapperProps {
	hasNodeResolver: boolean;
	innerRef: React.RefCallback<HTMLElement>;
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
const NodeResolverWrapper: FC<NodeResolverWrapperProps> = ({
	hasNodeResolver,
	children,
	innerRef,
}) => {
	if (hasNodeResolver) {
		return <NodeResolver innerRef={innerRef}>{children}</NodeResolver>;
	}

	return <div ref={(node: HTMLDivElement) => innerRef(node)}>{children}</div>;
};

export default NodeResolverWrapper;
