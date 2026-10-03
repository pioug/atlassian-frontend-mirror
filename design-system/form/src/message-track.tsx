/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type ReactNode } from 'react';

import { keyframes } from '@compiled/react';

import { cssMap, jsx } from '@atlaskit/css';
import { type useMotion } from '@atlaskit/motion/entering/use-motion';
import { token } from '@atlaskit/tokens';

import { type MessageTransition } from './message-context';

const expandRow = keyframes({
	from: { gridTemplateRows: '0fr' },
	to: { gridTemplateRows: '1fr' },
});

const collapseRow = keyframes({
	from: { gridTemplateRows: '1fr' },
	to: { gridTemplateRows: '0fr' },
});

const messageTrackStyles = cssMap({
	root: {
		display: 'grid',
		gridTemplateRows: '1fr',
	},
	row: {
		minHeight: 0,
	},
	hidden: {
		gridTemplateRows: '0fr',
		visibility: 'hidden',
	},
	invisible: {
		visibility: 'hidden',
	},
	enteringExpand: {
		animation: `${token('motion.form.message.enter')}, ${expandRow} ${token('motion.duration.short')} ${token('motion.easing.out.practical')} backwards`,
		'@media (prefers-reduced-motion: reduce)': {
			animation: 'none',
		},
	},
	exitingCollapse: {
		animation: `${token('motion.form.message.exit')}, ${collapseRow} ${token('motion.duration.xshort')} ${token('motion.easing.in.practical')} forwards`,
		'@media (prefers-reduced-motion: reduce)': {
			animation: 'none',
		},
	},
	entering: {
		animation: token('motion.form.message.enter'),
		'@media (prefers-reduced-motion: reduce)': {
			animation: 'none',
		},
	},
	exiting: {
		animation: token('motion.form.message.exit'),
		'@media (prefers-reduced-motion: reduce)': {
			animation: 'none',
		},
	},
	exitingInstant: {
		display: 'none',
	},
});

interface MessageTrackProps {
	children: ReactNode;
	transition: MessageTransition;
	motionRef: (node: HTMLDivElement | null) => void;
	state: ReturnType<typeof useMotion>['state'];
	testId?: string;
}

const MessageTrack = ({
	children,
	transition,
	motionRef,
	state,
	testId,
}: MessageTrackProps): ReactNode => (
	<div
		css={[
			messageTrackStyles.root,
			transition === 'row' && (state === 'init' || state === 'hidden') && messageTrackStyles.hidden,
			transition === 'groupEnter' &&
				(state === 'init' || state === 'hidden') &&
				messageTrackStyles.invisible,
			transition === 'row' && state === 'entering' && messageTrackStyles.enteringExpand,
			transition === 'row' && state === 'exiting' && messageTrackStyles.exitingCollapse,
			transition === 'groupEnter' && state === 'entering' && messageTrackStyles.entering,
			transition === 'groupExit' && state === 'exiting' && messageTrackStyles.exiting,
			transition === 'instant' && state === 'exiting' && messageTrackStyles.exitingInstant,
		]}
		ref={motionRef}
		aria-hidden={state === 'exiting' ? true : undefined}
		data-testid={testId}
	>
		<div css={messageTrackStyles.row}>{children}</div>
	</div>
);

export default MessageTrack;
