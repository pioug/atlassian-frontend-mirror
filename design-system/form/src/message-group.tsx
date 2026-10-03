/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type ReactNode } from 'react';

import { keyframes } from '@compiled/react';

import { cssMap, jsx } from '@atlaskit/css';
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

const messageGroupStyles = cssMap({
	root: {
		display: 'grid',
		gridTemplateRows: '1fr',
	},
	row: {
		minHeight: 0,
	},
	expand: {
		animation: `${expandRow} ${token('motion.duration.short')} ${token('motion.easing.out.practical')} backwards`,
		'@media (prefers-reduced-motion: reduce)': {
			animation: 'none',
		},
	},
	collapse: {
		animation: `${collapseRow} ${token('motion.duration.xshort')} ${token('motion.easing.in.practical')} forwards`,
		'@media (prefers-reduced-motion: reduce)': {
			animation: 'none',
		},
	},
});

const MessageGroup = ({
	children,
	transition,
}: {
	children: ReactNode;
	transition: MessageTransition;
}): ReactNode => (
	<div
		css={[
			messageGroupStyles.root,
			transition === 'groupEnter' && messageGroupStyles.expand,
			transition === 'groupExit' && messageGroupStyles.collapse,
		]}
		data-testid="message-wrapper-motion"
	>
		<div css={messageGroupStyles.row}>{children}</div>
	</div>
);

export default MessageGroup;
