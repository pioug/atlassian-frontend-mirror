import fetchMock from 'fetch-mock';
import { SocketIO, Server } from 'mock-socket';
import { v4 as uuid } from 'uuid';

import { type DocNode } from '@atlaskit/adf-schema';
import { Provider as CollabProvider } from '@atlaskit/collab-provider';
import type { CollabTelepointerPayload, StepJson } from '@atlaskit/editor-common/collab';

const baseURL = 'ws://example.com';
const fakeURL = `${baseURL}/session/`;
const mockServer = new Server(fakeURL, { mock: true });

class NCSServer {
	currentVersion = 0;
	stepMap = new Map<number, StepJson[]>();
	constructor() {}

	addSteps(version: number, steps: StepJson[]) {
		const currentSteps = this.stepMap.get(this.currentVersion);
		this.currentVersion = version + steps.length;
		this.stepMap.set(this.currentVersion, [...(currentSteps ?? []), ...steps]);
	}

	catchupSteps(version: number): StepJson[] | undefined {
		const stepsAtVersion = this.stepMap.get(version);
		const currentSteps = this.stepMap.get(this.currentVersion - 1);
		return currentSteps?.slice(stepsAtVersion?.length ?? 0);
	}
}

const ncsServer = new NCSServer();

fetchMock.get(/\/catchupv2/u, (wsUrl: string) => {
	const url = new URL(wsUrl.replace('ws://', 'http://'));
	const params = new URLSearchParams(url.search);
	const version = Number(params.get('version'));

	const steps = ncsServer.catchupSteps(version);
	return {
		steps,
	};
});

// @ts-expect-error - io not defined
window.io = SocketIO;

type BroadcastMessage =
	| ({
			type: 'participant:telepointer';
	  } & Omit<CollabTelepointerPayload, 'type'>)
	| {
			steps: StepJson[];
			type: 'broadcast';
			version: number;
	  };

// @ts-expect-error Incorrect callback typing
mockServer.on('broadcast', (broadcastMessage: BroadcastMessage) => {
	if (broadcastMessage.type === 'participant:telepointer') {
		mockServer.emit('participant:telepointer', {
			data: {
				type: 'telepointer',
				selection: broadcastMessage.selection,
				sessionId: broadcastMessage.sessionId,
				timestamp: new Date(),
			},
		});
	} else {
		ncsServer.addSteps(broadcastMessage.version, broadcastMessage.steps);

		mockServer.emit('data', {
			steps: broadcastMessage.steps,
			version: broadcastMessage.version + broadcastMessage.steps.length,
		});
	}
});

const initialDoc: DocNode = { version: 1, content: [], type: 'doc' };

// @ts-expect-error Incorrect callback typing
mockServer.on('connect', (_sever, client: SocketIO) => {
	mockServer.emit('data', {
		type: 'initial',
		doc: initialDoc,
		version: 0,
		userId: client.id,
		metadata: {},
	});

	// Setup presence service
	mockServer.emit('presence', {
		userId: client.id,
		timestamp: new Date(),
	});

	mockServer.emit('participant:updated', {
		sessionId: client.id,
		timestamp: new Date(),
	});
});

const createSocket = (path: string) => {
	// @ts-expect-error - Typing incorrect in mock-socket
	const socket = new SocketIO(path);
	socket.id = `test_${uuid()}`;

	const originalEmit = socket.emit;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	socket.emit = function (...args: any) {
		// In socket IO we have acks, which mock-socket doesn't support
		if ('function' === typeof args[args.length - 1]) {
			const ack = args.pop();
			// For simplicity we always send the success ACK immediately on emit
			ack({
				type: 'SUCCESS',
				version: ncsServer.currentVersion + 1,
			});
		}
		// Call the original emit function with the correct context
		return originalEmit.apply(socket, args);
	};

	// Not mocked correctly in mock-socket
	socket.onAnyOutgoing = () => {
		// Unused for now
	};
	socket.io = {
		on: () => {
			// Unused for now
		},
	};
	return socket;
};

export const createProvider = () =>
	new CollabProvider({
		createSocket(path, auth, productInfo, isPresenceOnly, analyticsHelper) {
			return createSocket(path);
		},
		url: baseURL,
		documentAri: '',
	});
