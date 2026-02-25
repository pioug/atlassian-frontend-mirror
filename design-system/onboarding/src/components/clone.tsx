import React, { type MouseEvent, useMemo } from 'react';

import { TargetInner, TargetOverlay } from '../styled/target';
import { useElementObserver } from '../utils/use-element-observer';
interface CloneProps {
	/**
	 * Whether to display a pulse animation around the spotlighted element.
	 */
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	pulse: boolean;
	/**
	 * An object containing the information used for positioning clone.
	 */
	style: Record<string, any>;
	/**
	 * The name of the SpotlightTarget.
	 */
	target?: string;
	/**
	 * The spotlight target node.
	 */
	targetNode: HTMLElement;
	/**
	 * The background color of the element being highlighted
	 */
	targetBgColor?: string;
	/**
	 * Function to fire when a person clicks on the cloned target.
	 */
	targetOnClick?: (eventData: { event: MouseEvent<HTMLElement>; target?: string }) => void;
	/**
	 * The border radius of the element being highlighted.
	 */
	targetRadius?: number | string;
	/**
	 * A `testId` prop is provided for specified elements,
	 * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 */
	testId?: string;
	/**
	 * Whether to watch for html content changes on the target
	 */
	shouldWatch?: boolean;
}

type CloneableStyleAttribute =
	| 'fontSize'
	| 'fontWeight'
	| 'lineHeight'
	| 'padding'
	| 'color'
	| 'textOverflow';
const computedStyleAttributesToClone: CloneableStyleAttribute[] = [
	'fontSize',
	'fontWeight',
	'lineHeight',
	'padding',
	'color',
	'textOverflow',
];

function cloneAndOverrideStyles(node: HTMLElement): HTMLElement {
	const shouldCloneChildren = true;
	const clonedNode = node.cloneNode(shouldCloneChildren) as HTMLElement;
	const computedStyles = getComputedStyle(node);

	computedStyleAttributesToClone.forEach((attribute) => {
		clonedNode.style[attribute] = computedStyles[attribute];
	});

	clonedNode.style.margin = '0';
	clonedNode.style.position = 'static';
	// The target may have other transforms applied. Avoid unintended side effects
	// by zeroing out "translate" rather than applying a value of "none".
	clonedNode.style.transform = 'translate(0, 0) translate3d(0, 0, 0)';

	return clonedNode;
}

/**
 * __Clone__
 *
 * Used for cloning spotlight targets. The clone is positioned on top of the spotlight target with
 * a pulsing animation.
 *
 * @internal
 */
const Clone = (props: CloneProps): React.JSX.Element => {
	const {
		pulse,
		style,
		shouldWatch,
		target,
		targetBgColor,
		targetOnClick,
		targetNode,
		targetRadius,
		testId,
	} = props;

	const contentVersion = useElementObserver(targetNode, { disableWatch: !shouldWatch });
	const contentHTML = useMemo(
		() => cloneAndOverrideStyles(targetNode).outerHTML,
		// eslint-disable-next-line react-hooks/exhaustive-deps -- We only want to update when the content changes
		[contentVersion, targetNode],
	);

	return (
		<TargetInner
			data-testid={testId}
			pulse={pulse}
			bgColor={targetBgColor}
			radius={targetRadius}
			style={style}
		>
			<div
				dangerouslySetInnerHTML={{ __html: contentHTML }}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={{ height: '100%', pointerEvents: 'none' }}
			/>
			<TargetOverlay
				onClick={
					targetOnClick
						? (event: React.MouseEvent<HTMLElement>) => targetOnClick({ event, target })
						: undefined
				}
			/>
		</TargetInner>
	);
};

export default Clone;
