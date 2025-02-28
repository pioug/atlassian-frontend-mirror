/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useState } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { Box, Pressable, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { type Topic, usePublish, useSubscribe } from '../src';

const styles = cssMap({
	content: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		height: '100%',
		textAlign: 'center',
	},

	description: {
		paddingTop: token('space.300'),
		paddingRight: token('space.300'),
		paddingBottom: token('space.300'),
		paddingLeft: token('space.300'),
	},

	publisher: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
		width: '100%',
	},

	subscriber: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
		width: '100%',
	},

	subscriberChild: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
		height: '100%',
	},

	button: {
		marginTop: token('space.300'),
		borderRadius: token('border.radius.300'),
		paddingTop: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.150'),
		paddingRight: token('space.150'),
		backgroundColor: token('color.background.accent.gray.subtlest'),
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
	},

	publisherMate: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
		height: '100%',
	},

	publisherSain: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
		height: '100%',
	},

	result: {
		paddingTop: token('space.150'),
		paddingRight: token('space.150'),
		paddingBottom: token('space.150'),
		paddingLeft: token('space.150'),
		borderRadius: token('border.radius.050'),
		marginTop: token('space.300'),
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
	},
});

const Pub = ({ topic, message }: { topic: Topic; message: string }) => {
	const publish = usePublish(topic);
	return (
		<Box
			xcss={topic === 'ai-mate' ? styles.publisherMate : styles.publisherSain}
			backgroundColor={
				topic === 'ai-mate'
					? 'color.background.accent.red.subtlest'
					: 'color.background.accent.red.subtler'
			}
		>
			<Heading size="medium">
				Publisher
				<br />
				<small>{topic}</small>
			</Heading>
			<Pressable
				xcss={styles.button}
				onClick={() => {
					publish({ type: 'message-send', data: { prompt: message }, source: 'my-source' });
				}}
			>
				Publish "{message}"
			</Pressable>
		</Box>
	);
};
const Sub = ({ topic }: { topic: Topic }) => {
	const [count, setCount] = useState(0);
	const [msg, setMsg] = useState('');
	const [val, setVal] = useState(0);

	useEffect(() => {
		const ticker = window.setInterval(() => {
			setVal((val) => val + 1);
		}, 1000);

		return () => {
			window.clearInterval(ticker);
		};
	}, []);

	useSubscribe({ topic }, (payload) => {
		if (payload.type === 'message-send') {
			setMsg(`${payload.data} when timer was ${val}`);
			setCount(count + 1);
		}
	});

	return (
		<Box xcss={styles.subscriberChild} backgroundColor="color.background.accent.blue.subtler">
			<Heading size="medium">
				Subscriber
				<br />
				<small>{topic}</small>
				<br />
				<small>Timer state value: {val}</small>
			</Heading>
			{count <= 0 ? (
				<Box xcss={styles.result}>No events</Box>
			) : (
				<Box xcss={styles.result}>
					{msg}
					<br />
					<small>
						<Text color="color.text.subtlest" size="small" as="em">
							{count} events
						</Text>
					</small>
				</Box>
			)}
		</Box>
	);
};

export default function () {
	return (
		<Box xcss={styles.content} backgroundColor="color.background.accent.gray.subtler">
			<Stack space="space.150" xcss={styles.description}>
				<Heading size="medium">Description</Heading>
				<Text as="p">⤵ Demonstrates subscriber callbacks utilising state values</Text>
			</Stack>
			<Box xcss={styles.subscriber}>
				<Sub topic="ai-mate" />
			</Box>
			<Box xcss={styles.publisher}>
				<Pub topic="ai-mate" message="Hi, Mate!" />
			</Box>
		</Box>
	);
}
