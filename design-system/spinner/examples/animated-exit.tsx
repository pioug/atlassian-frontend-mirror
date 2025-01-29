/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useEffect, useState } from 'react';

import { css, jsx } from '@compiled/react';

import Avatar from '@atlaskit/avatar';
import Button from '@atlaskit/button/new';
import { ExitingPersistence, FadeIn } from '@atlaskit/motion';
import Spinner from '@atlaskit/spinner';
import { token } from '@atlaskit/tokens';
import VisuallyHidden from '@atlaskit/visually-hidden';

type Phase = 'stopped' | 'loading' | 'ready';

const layoutStyles = css({
	display: 'flex',
	justifyContent: 'center',
	gap: token('space.200', '16px'),
});

const columnStyles = css({
	display: 'flex',
	alignItems: 'center',
	flexDirection: 'column',
});

const headingStyles = css({
	marginBlockEnd: token('space.200', '16px'),
});

const loadingContainerStyles = css({
	display: 'flex',
	width: 200,
	height: 200,
	alignItems: 'center',
	justifyContent: 'center',
});

const spinnerStyles = css({ position: 'absolute' });

function Harness({
	children,
	title,
	buttonLabel,
}: {
	children: (phase: Phase) => React.ReactElement;
	title: string;
	buttonLabel: string;
}) {
	const [phase, setPhase] = useState<Phase>('stopped');
	const liveRegionAnnouncement = (() => {
		switch (phase) {
			case 'loading':
				return 'Loading';
			case 'ready':
				return 'Avatar loading completed';
			default:
				return null;
		}
	})();

	useEffect(
		function onPhaseChange() {
			if (phase === 'loading') {
				const id = window.setTimeout(() => setPhase('ready'), 2000);
				return () => window.clearTimeout(id);
			}
		},
		[phase],
	);

	return (
		<div css={columnStyles}>
			<h4 css={headingStyles}>{title}</h4>
			<VisuallyHidden>
				<div aria-live="polite">{liveRegionAnnouncement}</div>
			</VisuallyHidden>
			<Button onClick={() => setPhase('loading')} isDisabled={phase === 'loading'}>
				{buttonLabel}
			</Button>
			<div css={loadingContainerStyles}>{children(phase)}</div>
		</div>
	);
}

function NotAnimated() {
	return (
		<Harness title="No exit animation" buttonLabel="Load avatar without animation">
			{(phase: Phase) => (
				<React.Fragment>
					{phase === 'ready' && <Avatar size="xlarge" />}
					{phase === 'loading' && (
						<span css={spinnerStyles}>
							<Spinner size="xlarge" label="Loading" />
						</span>
					)}
				</React.Fragment>
			)}
		</Harness>
	);
}

function Animated() {
	return (
		<Harness title="With cross fading" buttonLabel="Load avatar with animation">
			{(phase: Phase) => (
				<React.Fragment>
					<ExitingPersistence appear>
						{phase === 'ready' && (
							<FadeIn>
								{(props) => (
									<span {...props}>
										<Avatar size="xlarge" />
									</span>
								)}
							</FadeIn>
						)}
					</ExitingPersistence>
					<ExitingPersistence>
						{phase === 'loading' && (
							<FadeIn onFinish={(value) => console.log('fade in finished', value)}>
								{(props) => (
									<span {...props} css={spinnerStyles}>
										<Spinner size="xlarge" label="Loading" />
									</span>
								)}
							</FadeIn>
						)}
					</ExitingPersistence>
				</React.Fragment>
			)}
		</Harness>
	);
}

export default function Example() {
	return (
		<div css={layoutStyles}>
			<NotAnimated />
			<Animated />
		</div>
	);
}
