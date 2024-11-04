/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactElement, useEffect, useRef } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import NodeResolver from 'react-node-resolver';

interface NodeResolverSpotlightTargetProps {
	hasNodeResolver: boolean;
	children: ReactElement;
	targetRef: (name: string) => (element: Element | null | undefined) => void;
	name: string;
}
const spanStyles = css({
	display: 'contents'
});
/**
 * A wrapper component that conditionally applies a NodeResolver to its children.
 *
 * Note: NodeResolver should not be used in React 18 concurrent mode. This component
 * is intended to be removed once the feature flag  is removed.
 * @param {boolean} props.hasNodeResolver - Determines whether to apply the NodeResolver.
 * @param {ReactElement} props.children - The child elements to be wrapped.
 * @param {string} props.name - The name to reference from Spotlight.
 * @param {ReactElement} props.targetRef - Setting up Target Node in Spotlight Manager.
 * @returns {ReactElement} The children wrapped with NodeResolver if hasNodeResolver is true, wrape the children in a div setting innerRef with ref to the div.
 */
const NodeResolverSpotlightTarget = ({
	hasNodeResolver,
	children,
	targetRef,
	name,
}: NodeResolverSpotlightTargetProps) => {
	const divRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (!hasNodeResolver) {
			targetRef(name)(divRef.current?.firstElementChild);
		}
		return () => {
			!hasNodeResolver && targetRef(name)(undefined);
		};
	}, [hasNodeResolver, name, targetRef]);

	if (hasNodeResolver) {
		return <NodeResolver innerRef={targetRef(name)}>{children}</NodeResolver>;
	}

	return (
		<span
			ref={divRef}
			css={spanStyles}
		>
			{children}
		</span>
	);
};

export default NodeResolverSpotlightTarget;
