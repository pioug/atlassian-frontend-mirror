import { useCallback, useEffect, useRef, useState } from 'react';

import { bind } from 'bind-event-listener';

import { usePublish } from '../../../main';
import { type Payload } from '../../../types';

export const ROVO_POST_MESSAGE_EVENT_TYPE = 'rovo-post-message';
export const ROVO_POST_MESSAGE_ACK_EVENT_TYPE = 'rovo-post-message-ack';

type PostMessageSendEventType = {
	eventType: typeof ROVO_POST_MESSAGE_EVENT_TYPE;
	payload: Payload;
	payloadId: string;
};

type PostMessageAckEventType = {
	eventType: typeof ROVO_POST_MESSAGE_ACK_EVENT_TYPE;
	payloadId: string;
};

// allow subdomains of these domains
const allowedSubdomains = ['.jira-dev.com', '.atlassian.com', '.atlassian.net', '.atl-paas.net'];
const allowedOrigins = ['bitbucket.org', 'trello.com'];

export const isAllowedOrigin = (origin: string | undefined) => {
	if (!origin) {
		return false;
	}
	const url = new URL(origin);
	const hostname = url.hostname;

	return (
		hostname === 'localhost' ||
		(url.protocol === 'https:' &&
			(allowedSubdomains.some((subdomain) => hostname.endsWith(subdomain)) ||
				allowedOrigins.includes(hostname)))
	);
};

export const RovoPostMessagePubsubListener = () => {
	const publish = usePublish('ai-mate');

	useEffect(() => {
		const handlerUnbind = bind(window, {
			type: 'message',
			listener: (event) => {
				if (!isAllowedOrigin(event.origin)) {
					return;
				}

				if (event.data.eventType === ROVO_POST_MESSAGE_EVENT_TYPE) {
					const eventData = event.data as PostMessageSendEventType;

					const ackPayload: PostMessageAckEventType = {
						eventType: ROVO_POST_MESSAGE_ACK_EVENT_TYPE,
						payloadId: eventData.payloadId,
					};
					event.source?.postMessage(ackPayload);
					publish(event.data.payload);
				}
			},
		});

		return handlerUnbind;
	}, [publish]);

	return null;
};

const TIMEOUT_WAIT_FOR_ACK = 100;

/**
 * Hook to send a publish event to parent iframe using postMessage
 * Only supports 1 pubsub event at a time and waits for acknowledgment or timed out
 */
export const useRovoPostMessageToPubsub = () => {
	const onAcknowledgeTimeoutTimeoutRef = useRef<{ timeout: number; lastPayloadId: string } | null>(
		null,
	);
	const [isWaitingForAck, setIsWaitingForAck] = useState(false);

	useEffect(() => {
		const handlerUnbind = bind(window, {
			type: 'message',
			// handler for acknowledgment from parent
			listener: (event) => {
				if (!isAllowedOrigin(event.origin)) {
					return;
				}

				if (
					event.data.eventType !== ROVO_POST_MESSAGE_ACK_EVENT_TYPE ||
					onAcknowledgeTimeoutTimeoutRef.current === null
				) {
					return;
				}

				const eventData = event.data as PostMessageAckEventType;

				// if the parent acknowledges different payload (e.g. from different hook instance)
				// disregard the event
				if (eventData.payloadId !== onAcknowledgeTimeoutTimeoutRef.current.lastPayloadId) {
					return;
				}

				// Clear the onAcknowledgeTimeoutTimeout if acknowledgment is received
				clearTimeout(onAcknowledgeTimeoutTimeoutRef.current.timeout);
				onAcknowledgeTimeoutTimeoutRef.current = null;
				setIsWaitingForAck(false);
			},
		});

		return handlerUnbind;
	}, []);

	const publishWithPostMessage = useCallback(
		({
			targetWindow = window.parent,
			payload,
			onAcknowledgeTimeout,
		}: {
			targetWindow?: Window;
			payload: Payload;
			onAcknowledgeTimeout: (params: { payload: Payload }) => void;
		}) => {
			if (!targetWindow) {
				return;
			}

			const payloadId = Math.floor(Math.random() * 1e6).toString();

			targetWindow.postMessage(
				{
					eventType: ROVO_POST_MESSAGE_EVENT_TYPE,
					payload,
					payloadId,
				} as PostMessageSendEventType,
				'*',
			);

			// waiting for acknowledgment from parent
			// if no acknowledgment is received, call onAcknowledgeTimeout
			setIsWaitingForAck(true);
			const timeout = window.setTimeout(() => {
				onAcknowledgeTimeout({ payload });
				onAcknowledgeTimeoutTimeoutRef.current = null;
				setIsWaitingForAck(false);
			}, TIMEOUT_WAIT_FOR_ACK);

			onAcknowledgeTimeoutTimeoutRef.current = {
				timeout,
				lastPayloadId: payloadId,
			};
		},
		[],
	);

	return {
		publishWithPostMessage,
		isWaitingForAck,
	};
};
