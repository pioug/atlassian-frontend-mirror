/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// Reflows any multi-value renderer with shared label motion and optional settled truncation.
import { type ReactNode, useCallback, useMemo, useRef, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import { useMotion, type UseMotionResult } from '@atlaskit/motion/entering/use-motion';
import { token } from '@atlaskit/tokens';

const motionWrapperStyles = cssMap({
	root: {
		display: 'inline-grid',
		gridTemplateColumns: 'minmax(0, 1fr)',
		overflow: 'hidden',
	},
	entering: {
		animation: token('motion.label.enter'),
	},
	exiting: {
		animation: token('motion.label.exit'),
	},
	reducedMotion: {
		'@media (prefers-reduced-motion: reduce)': {
			animation: 'none',
		},
	},
});

type MultiValueMotionRenderProps = {
	hasEllipsis: boolean;
	motionState: UseMotionResult['state'];
	truncationRef: (node: HTMLDivElement | null) => void;
};

type MultiValueMotionProps = {
	children: (props: MultiValueMotionRenderProps) => ReactNode;
	onMotionFinish?: () => void;
	shouldMeasureTruncation?: boolean;
};

/**
 * Keeps any multi-value renderer mounted while its grid track enters or exits.
 * This lives independently of the default renderer so custom values reflow with their siblings too.
 */
export default function MultiValueMotion({
	children,
	onMotionFinish,
	shouldMeasureTruncation = false,
}: MultiValueMotionProps): JSX.Element {
	const truncationElementRef = useRef<HTMLDivElement | null>(null);
	const motionElementRef = useRef<HTMLDivElement | null>(null);
	const [hasEllipsis, setHasEllipsis] = useState(false);
	const updateMultiValueTruncation = useCallback(() => {
		const label = truncationElementRef.current;
		const motionElement = motionElementRef.current;
		if (label && motionElement) {
			const inlineAnimation = motionElement.style.animation;
			motionElement.style.animation = 'none';
			setHasEllipsis(label.scrollWidth > label.clientWidth);
			motionElement.style.animation = inlineAnimation;
		}
	}, []);
	const truncationRef = useCallback((node: HTMLDivElement | null) => {
		truncationElementRef.current = node;
	}, []);
	const { ref: motionRef, state } = useMotion<HTMLDivElement>({
		onStart: shouldMeasureTruncation ? updateMultiValueTruncation : undefined,
		onFinish: (motionState) => {
			if (motionState === 'exiting') {
				onMotionFinish?.();
			}
		},
	});
	const mergedMotionRef = useMemo(() => mergeRefs([motionElementRef, motionRef]), [motionRef]);
	return (
		<div
			ref={mergedMotionRef}
			css={[
				motionWrapperStyles.root,
				state === 'entering' && motionWrapperStyles.entering,
				state === 'exiting' && motionWrapperStyles.exiting,
				motionWrapperStyles.reducedMotion,
			]}
		>
			{children({ hasEllipsis, motionState: state, truncationRef })}
		</div>
	);
}
