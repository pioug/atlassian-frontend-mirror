/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useId, useRef, useState } from 'react';

import Avatar from '@atlaskit/avatar/avatar';
import Button from '@atlaskit/button/default/button';
import { cssMap, cx, jsx } from '@atlaskit/css';
import { Label } from '@atlaskit/form/label/default';
import Heading from '@atlaskit/heading/heading';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Grid } from '@atlaskit/primitives/compiled/grid';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import Textarea from '@atlaskit/textarea/text-area';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
		maxWidth: '800px',
		minWidth: 0,
		marginInline: 'auto',
		backgroundColor: token('elevation.surface'),
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
		borderRadius: token('radius.large'),
		overflow: 'hidden',
		overflowWrap: 'anywhere',
	},
	header: {
		// eslint-disable-next-line @atlaskit/platform/expand-spacing-shorthand -- Inset tokens require equal padding on all sides.
		padding: token('space.inset.xlarge'),
	},
	conversation: {
		// eslint-disable-next-line @atlaskit/platform/expand-spacing-shorthand -- Inset tokens require equal padding on all sides.
		padding: token('space.inset.xxlarge'),
		backgroundColor: token('elevation.surface.sunken'),
	},
	date: {
		// eslint-disable-next-line @atlaskit/platform/expand-spacing-shorthand -- Inset tokens require equal padding on all sides.
		padding: token('space.inset.xxsmall'),
		backgroundColor: token('color.background.neutral'),
		borderRadius: token('radius.small'),
	},
	context: {
		// eslint-disable-next-line @atlaskit/platform/expand-spacing-shorthand -- Inset tokens require equal padding on all sides.
		padding: token('space.inset.small'),
		backgroundColor: token('color.background.information'),
		borderRadius: token('radius.medium'),
	},
	row: { gridTemplateColumns: 'auto minmax(0, 1fr)', alignItems: 'start' },
	ownRow: { gridTemplateColumns: 'minmax(0, 1fr) auto' },
	message: { minWidth: 0 },
	bubble: {
		// eslint-disable-next-line @atlaskit/platform/expand-spacing-shorthand -- Inset tokens require equal padding on all sides.
		padding: token('space.inset.medium'),
		maxWidth: '520px',
		minWidth: 0,
		backgroundColor: token('elevation.surface'),
		borderRadius: token('radius.large'),
		whiteSpace: 'pre-wrap',
	},
	ownBubble: { backgroundColor: token('color.background.accent.blue.subtlest') },
	attachment: {
		// eslint-disable-next-line @atlaskit/platform/expand-spacing-shorthand -- Inset tokens require equal padding on all sides.
		padding: token('space.inset.xsmall'),
		backgroundColor: token('elevation.surface.sunken'),
		borderRadius: token('radius.medium'),
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
	},
	composer: {
		// eslint-disable-next-line @atlaskit/platform/expand-spacing-shorthand -- Inset tokens require equal padding on all sides.
		padding: token('space.inset.large'),
	},
	divider: {
		borderBlockStartWidth: token('border.width'),
		borderBlockStartStyle: 'solid',
		borderBlockStartColor: token('color.border'),
	},
});

type Message = {
	id: number;
	author: string;
	time: string;
	text: string;
	isOwn?: boolean;
	attachment?: { name: string; detail: string };
};

const initialMessages: Message[] = [
	{
		id: 1,
		author: 'You',
		time: '10:02 AM',
		text: 'Can you review these mobile layouts and suggest where the spacing could be clearer?',
		isOwn: true,
		attachment: { name: 'Homepage review.pdf', detail: '6 pages · 2.4 MB' },
	},
	{
		id: 2,
		author: 'Design agent',
		time: '10:03 AM',
		text: 'I’d start with the navigation and content cards. The navigation feels crowded, while the cards could use more padding to separate their content from the edges.',
	},
	{
		id: 3,
		author: 'You',
		time: '10:04 AM',
		text: 'Let’s focus on the cards. What would you change first?',
		isOwn: true,
	},
	{
		id: 4,
		author: 'Design agent',
		time: '10:05 AM',
		text: 'Try increasing the padding inside each card by one size, while keeping the gaps between cards the same. Then compare both versions at mobile width to check the text still has enough room.',
	},
];

function ChatMessage({ message }: { message: Message }): React.JSX.Element {
	return (
		<Grid gap="space.gap.large" xcss={cx(styles.row, message.isOwn && styles.ownRow)}>
			{!message.isOwn && <Avatar name={message.author} size="small" />}
			<Stack
				space="space.gap.small"
				alignInline={message.isOwn ? 'end' : 'start'}
				xcss={styles.message}
			>
				<Inline space="space.gap.medium" alignBlock="center" shouldWrap>
					<Text size="small" weight="semibold">
						{message.author}
					</Text>
					<Text size="small" color="color.text.subtle">
						{message.time}
					</Text>
				</Inline>
				<Stack space="space.gap.large" xcss={cx(styles.bubble, message.isOwn && styles.ownBubble)}>
					<Text as="p">{message.text}</Text>
					{message.attachment && (
						<Stack space="space.gap.xsmall" xcss={styles.attachment}>
							<Text weight="semibold">{message.attachment.name}</Text>
							<Text size="small" color="color.text.subtle">
								{message.attachment.detail}
							</Text>
						</Stack>
					)}
				</Stack>
			</Stack>
			{message.isOwn && <Avatar name={message.author} size="small" />}
		</Grid>
	);
}

export function ChatLayout(): React.JSX.Element {
	const id = useId();
	const [messages, setMessages] = useState(initialMessages);
	const [draft, setDraft] = useState('');
	const composerRef = useRef<HTMLTextAreaElement>(null);

	return (
		<Box xcss={styles.root}>
			<Stack space="space.gap.small" xcss={styles.header}>
				<Heading as="h1" size="medium">
					Chat with Design agent
				</Heading>
				<Text color="color.text.subtle">Example conversation · Website refresh</Text>
			</Stack>
			<Stack space="space.gap.xxlarge" xcss={cx(styles.conversation, styles.divider)}>
				<Stack space="space.gap.xsmall" xcss={styles.context}>
					<Text weight="semibold" color="color.text.information">
						Task context
					</Text>
					<Text size="small">Review the mobile layouts and suggest clearer spacing.</Text>
				</Stack>
				<Inline alignInline="center">
					<Box xcss={styles.date}>
						<Text size="small" color="color.text.subtle">
							Today
						</Text>
					</Box>
				</Inline>
				<Stack
					role="log"
					aria-label="Conversation"
					aria-live="polite"
					aria-relevant="additions"
					space="space.gap.xxlarge"
				>
					{messages.map((message) => (
						<ChatMessage key={message.id} message={message} />
					))}
				</Stack>
			</Stack>
			<form
				onSubmit={(event) => {
					event.preventDefault();
					const text = draft.trim();
					if (!text) return;
					setMessages((current) => [
						...current,
						{
							id: current.length + 1,
							author: 'You',
							time: 'Just now',
							text,
							isOwn: true,
						},
					]);
					setDraft('');
					composerRef.current?.focus();
				}}
			>
				<Stack space="space.gap.large" xcss={cx(styles.composer, styles.divider)}>
					<Stack space="space.gap.small">
						<Label htmlFor={`${id}-message`}>Message</Label>
						<Textarea
							ref={composerRef}
							id={`${id}-message`}
							value={draft}
							minimumRows={2}
							resize="smart"
							aria-describedby={`${id}-help`}
							onChange={(event) => setDraft(event.currentTarget.value)}
						/>
					</Stack>
					<Inline spread="space-between" alignBlock="center" space="space.gap.medium" shouldWrap>
						<Text id={`${id}-help`} size="small" color="color.text.subtle">
							Messages stay in this preview.
						</Text>
						<Button type="submit" appearance="primary" isDisabled={!draft.trim()}>
							Send
						</Button>
					</Inline>
				</Stack>
			</form>
		</Box>
	);
}
