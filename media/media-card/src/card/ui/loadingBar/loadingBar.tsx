/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, {
	useContext,
	useEffect,
	useLayoutEffect as useRealLayoutEffect,
	useRef,
	useState,
} from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { jsx, css } from '@compiled/react';

import InteractionContext from '@atlaskit/interaction-context';
import { token } from '@atlaskit/tokens';

const TICK_INTERVAL_MS = 1000;
const STATIC_PROGRESS_VALUE = 0.9;

/**
 * `useLayoutEffect` is being used in SSR safe form. On the server, this work doesn’t need to run.
 * `useEffect` is used in-place, because `useEffect` is not run on the server and it matches types
 * which makes things simpler than doing an `isServer` check or a `null` check.
 *
 * @see https://hello.atlassian.net/wiki/spaces/DST/pages/2081696628/DSTDACI-010+-+Interaction+Tracing+hooks+in+DS+components
 */
const useLayoutEffect = typeof window === 'undefined' ? useEffect : useRealLayoutEffect;

const messages = defineMessages({
	loadingBarLabel: {
		id: 'fabric.media.loading_bar_label',
		defaultMessage: 'Loading',
		description: 'Aria label for the loading bar shown while a media card is loading',
	},
});

const trackStyles = css({
	overflow: 'hidden',
	position: 'absolute',
	bottom: token('space.100', '8px'),
	width: '95%',
	left: '2.5%',
	height: '6px',
	backgroundColor: token('color.background.neutral'),
	borderRadius: token('radius.full', '9999px'),
});

const fillStyles = css({
	display: 'block',
	height: '100%',
	backgroundColor: token('color.background.accent.gray.subtler.hovered'),
	borderRadius: token('radius.full', '9999px'),
	transition: 'width 0.8s',
});

const clampToPercent = (progress: number): number => Math.min(1, Math.max(0, progress)) * 100;

export type LoadingBarProps = {
	animationDisabled?: boolean;
	testId?: string;
	interactionName?: string;
};

export const LoadingBar = ({
	animationDisabled = false,
	testId,
	interactionName,
}: LoadingBarProps): React.JSX.Element => {
	const intl = useIntl();
	const [progress, setProgress] = useState(animationDisabled ? STATIC_PROGRESS_VALUE : 0);
	const intervalRef = useRef<ReturnType<typeof setInterval>>();

	const interactionContext = useContext(InteractionContext);
	useLayoutEffect(() => {
		if (interactionContext != null) {
			return interactionContext.hold(interactionName);
		}
	}, [interactionContext, interactionName]);

	useEffect(() => {
		if (animationDisabled) {
			setProgress(STATIC_PROGRESS_VALUE);
			return;
		}

		intervalRef.current = setInterval(() => {
			setProgress((prev) => {
				if (prev < 0.1) {
					return prev + 0.1;
				} else if (prev < 0.6) {
					return prev + 0.35;
				} else if (prev < 0.9) {
					return prev + 0.1;
				}
				clearInterval(intervalRef.current);
				return prev;
			});
		}, TICK_INTERVAL_MS);

		return () => clearInterval(intervalRef.current);
	}, [animationDisabled]);

	return (
		<div
			role="progressbar"
			aria-valuenow={progress}
			aria-label={intl.formatMessage(messages.loadingBarLabel)}
			data-testid={testId}
			css={trackStyles}
		>
			<div style={{ width: `${clampToPercent(progress)}%` }} css={fillStyles} />
		</div>
	);
};
