/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode, type Ref, useCallback, useEffect, useMemo, useRef } from 'react';

import { jsx } from '@compiled/react';

import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import { isReducedMotion } from '@atlaskit/motion/is-reduced-motion';
import ExitingPersistence from '@atlaskit/motion/exiting-persistence';
import { useExitingPersistence } from '@atlaskit/motion/exiting-persistence/use-exiting-persistence';
import { useMotion } from '@atlaskit/motion/entering/use-motion';

import { TagStatus } from './tag-status';

const tagMotionKey = 'atlaskit-tag-motion';

type MotionRenderProps = {
	isEntering: boolean;
	isExiting: boolean;
	ref: (node: HTMLSpanElement | null) => void;
};

type TagMotionProps = {
	children: (props: MotionRenderProps) => ReactNode;
	forwardedRef: Ref<HTMLSpanElement>;
	onExitComplete?: () => void;
	status: TagStatus;
};

function TagMotionContent({
	children,
	forwardedRef,
	onExitComplete,
}: Omit<TagMotionProps, 'status'>): ReactNode {
	const { ref: motionRef, state } = useMotion<HTMLSpanElement>({
		onFinish: (phase) => {
			if (phase === 'exiting') {
				onExitComplete?.();
			}
		},
	});
	const mergedRef = useMemo(() => mergeRefs([forwardedRef, motionRef]), [forwardedRef, motionRef]);

	return children({
		isEntering: state === 'entering',
		isExiting: state === 'exiting',
		ref: mergedRef,
	});
}

/**
 * Keeps the presence boundary mounted while applying motion directly to TagNew's root element.
 * This avoids a layout-affecting wrapper and lets TagNew remove interactive controls while its
 * root element completes the exit animation.
 */
export function TagMotion({
	children,
	forwardedRef,
	onExitComplete,
	status,
}: TagMotionProps): JSX.Element {
	const hasCompletedReducedMotionExit = useRef(false);
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

	useEffect(() => {
		if (isRemoved && isReducedMotion() && !hasCompletedReducedMotionExit.current) {
			hasCompletedReducedMotionExit.current = true;
			onMotionExitComplete();
		}
	}, [isRemoved, onMotionExitComplete]);
	return (
		<ExitingPersistence appear={shouldAppear}>
			{!isRemoved && (
				<TagMotionContent
					key={tagMotionKey}
					forwardedRef={forwardedRef}
					onExitComplete={onMotionExitComplete}
				>
					{children}
				</TagMotionContent>
			)}
		</ExitingPersistence>
	);
}
