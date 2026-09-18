/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// Measures settled truncation in onStart while useMotion drives each width animation phase.
import {
	type AnimationEventHandler,
	type ReactNode,
	type Ref,
	useCallback,
	useMemo,
	useRef,
	useState,
} from 'react';

import { cssMap, jsx } from '@compiled/react';

import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import { useMotion } from '@atlaskit/motion/entering/use-motion';
import ExitingPersistence from '@atlaskit/motion/exiting-persistence';
import { useExitingPersistence } from '@atlaskit/motion/exiting-persistence/use-exiting-persistence';
import { token } from '@atlaskit/tokens';

import { TagStatus } from './tag-status';

const tagMotionKey = 'atlaskit-tag-motion';
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
const motionContentStyles = cssMap({
	root: {
		display: 'flex',
		minWidth: 0,
		paddingBlock: token('space.050'),
		paddingInline: token('space.050'),
	},
});
type MotionRenderProps = {
	hasEllipsis: boolean | null;
	isEntering: boolean;
	isExiting: boolean;
	ref: Ref<HTMLSpanElement>;
};

type MotionPhase = 'entering' | 'exiting';

type TagMotionProps = {
	children: (props: MotionRenderProps) => ReactNode;
	forwardedRef: Ref<HTMLSpanElement>;
	hasMargin: boolean;
	onExitComplete?: () => void;
	status: TagStatus;
};

function TagMotionContent({
	children,
	forwardedRef,
	hasMargin,
	onExitComplete,
}: Omit<TagMotionProps, 'status'>): ReactNode {
	const [motionPhase, setMotionPhase] = useState<MotionPhase | null>(null);
	const [hasEllipsis, setHasEllipsis] = useState<boolean | null>(null);
	const motionElementRef = useRef<HTMLSpanElement | null>(null);
	const { ref: motionRef, state } = useMotion<HTMLSpanElement>({
		onStart: (phase) => {
			if (motionElementRef.current) {
				const motionElement = motionElementRef.current;
				const inlineAnimation = motionElement.style.animation;
				motionElement.style.animation = 'none';
				const textElement = motionElement.querySelector<HTMLElement>('[data-tag-text]');
				setHasEllipsis(Boolean(textElement && textElement.scrollWidth > textElement.clientWidth));
				motionElement.style.animation = inlineAnimation;
			}
			setMotionPhase(phase);
		},
		onFinish: (phase) => {
			if (phase === 'exiting') {
				onExitComplete?.();
			}
		},
	});
	const mergedMotionRef = useMemo(() => mergeRefs([motionElementRef, motionRef]), [motionRef]);

	const onAnimationEnd = useCallback<AnimationEventHandler<HTMLSpanElement>>((event) => {
		if (event.target === event.currentTarget) {
			setMotionPhase(null);
		}
	}, []);
	const activeMotionPhase: MotionPhase | null =
		state === 'entering' || state === 'exiting' ? state : motionPhase;

	return (
		<span
			ref={mergedMotionRef}
			onAnimationEnd={onAnimationEnd}
			css={[
				motionWrapperStyles.root,
				activeMotionPhase === 'entering' && motionWrapperStyles.entering,
				activeMotionPhase === 'exiting' && motionWrapperStyles.exiting,
				motionWrapperStyles.reducedMotion,
			]}
		>
			{hasMargin ? (
				<span css={motionContentStyles.root}>
					{children({
						hasEllipsis,
						isEntering: activeMotionPhase === 'entering',
						isExiting: activeMotionPhase === 'exiting',
						ref: forwardedRef,
					})}
				</span>
			) : (
				children({
					hasEllipsis,
					isEntering: activeMotionPhase === 'entering',
					isExiting: activeMotionPhase === 'exiting',
					ref: forwardedRef,
				})
			)}
		</span>
	);
}

/**
 * Keeps the presence boundary mounted while applying motion to TagNew's root element.
 * The inline-grid wrapper collapses its track so neighboring tags reflow throughout exit.
 */
export function TagMotion({
	children,
	forwardedRef,
	hasMargin,
	onExitComplete,
	status,
}: TagMotionProps): JSX.Element {
	const outerPresence = useExitingPersistence();
	const isRemoved = status === TagStatus.Removed || outerPresence.isExiting;
	const shouldAppear =
		outerPresence.isInsideExitingPersistence && outerPresence.appear && !outerPresence.isExiting;
	const latestExitState = useRef({ onExitComplete, outerPresence, status });
	latestExitState.current = { onExitComplete, outerPresence, status };

	const onMotionExitComplete = useCallback(() => {
		const latest = latestExitState.current;
		if (latest.outerPresence.isExiting) {
			latest.outerPresence.onFinish?.();
		}
		if (latest.status === TagStatus.Removed) {
			latest.onExitComplete?.();
		}
	}, []);

	return (
		<ExitingPersistence appear={shouldAppear}>
			{!isRemoved && (
				<TagMotionContent
					key={tagMotionKey}
					forwardedRef={forwardedRef}
					hasMargin={hasMargin}
					onExitComplete={onMotionExitComplete}
				>
					{children}
				</TagMotionContent>
			)}
		</ExitingPersistence>
	);
}
