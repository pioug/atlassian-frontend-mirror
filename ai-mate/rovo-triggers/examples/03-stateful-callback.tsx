import React, { useEffect, useState } from 'react';

import Heading from '@atlaskit/heading';
import { Box, Pressable, Stack, Text, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { type Topic, usePublish, useSubscribe } from '../src';

const contentStyles = xcss({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	width: '100vw',
	background: '#eff7f6',
	height: '100vh',
	textAlign: 'center',
});

const descriptionStyles = xcss({
	padding: 'space.300',
	fontSize: token('font.body.small'),
});

const publisherStyles = xcss({
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	justifyContent: 'center',
	flex: '1',
	width: '100%',
});

const subscriberStyles = xcss({
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	justifyContent: 'center',
	flex: '1',
	width: '100%',
});

const subscriberChildStyles = xcss({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	flex: '1',
	background: '#7bdff2',
	height: '100%',
});

const buttonStyles = xcss({
	marginTop: 'space.300',
	borderRadius: 'border.radius.300',
	paddingTop: 'space.100',
	paddingBottom: 'space.100',
	paddingLeft: 'space.150',
	paddingRight: 'space.150',
	background: '#eff7f6',
	border: '4px solid rgba(0,0,0,0.1)',
});

const publisherMateStyles = xcss({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	flex: '1',
	background: '#f7d6e0',
	height: '100%',
});

const publisherSainStyles = xcss({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	flex: '1',
	background: '#f2b5d4',
	height: '100%',
});

const resultStyles = xcss({
	background: 'rgba(0,0,0,0.05)',
	padding: 'space.150',
	borderRadius: 'border.radius.050',
	marginTop: 'space.300',
	border: '1px solid rgba(0,0,0,0.3)',
});

const Pub = ({ topic, message }: { topic: Topic; message: string }) => {
	const publish = usePublish(topic);
	return (
		<Box xcss={topic === 'ai-mate' ? publisherMateStyles : publisherSainStyles}>
			<Heading size="medium">
				Publisher
				<br />
				<small>{topic}</small>
			</Heading>
			<Pressable
				xcss={buttonStyles}
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
		<Box xcss={subscriberChildStyles}>
			<Heading size="medium">
				Subscriber
				<br />
				<small>{topic}</small>
				<br />
				<small>Timer state value: {val}</small>
			</Heading>
			{count <= 0 ? (
				<Box xcss={resultStyles}>No events</Box>
			) : (
				<Box xcss={resultStyles}>
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
		<Box xcss={contentStyles}>
			<Stack space="space.150" xcss={descriptionStyles}>
				<Heading size="medium">Description</Heading>
				<Text as="p">⤵ Demonstrates subscriber callbacks utilising state values</Text>
			</Stack>
			<Box xcss={subscriberStyles}>
				<Sub topic="ai-mate" />
			</Box>
			<Box xcss={publisherStyles}>
				<Pub topic="ai-mate" message="Hi, Mate!" />
			</Box>
		</Box>
	);
}
