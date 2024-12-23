import { utils } from '@atlaskit/util-service-support';
import { Emitter } from './emitter';
import type {
	Config,
	ChannelEvent,
	StepsPayload,
	InitAndAuthData,
	InitPayload,
	Catchupv2Response,
	PresencePayload,
	NamespaceStatus,
	AuthCallback,
	BroadcastIncomingPayload,
	ReconcileResponse,
} from './types';
import { createLogger, getProduct, getSubProduct } from './helpers/utils';
import { MEASURE_NAME, startMeasure, stopMeasure } from './analytics/performance';
import { EVENT_ACTION, EVENT_STATUS, type CatchupEventReason } from './helpers/const';
import type { Socket } from 'socket.io-client';
import ReconnectHelper from './connectivity/reconnect-helper';
import type { UFOExperience } from '@atlaskit/ufo';
import { createDocInitExp } from './analytics/ufo';
import { socketIOReasons } from './disconnected-reason-mapper';
import Network from './connectivity/network';
import type AnalyticsHelper from './analytics/analytics-helper';
import type {
	CatchUpFailedError,
	ConnectionError,
	DocumentNotFoundError,
	ReconnectionError,
	ReconnectionNetworkError,
	TokenPermissionError,
	InternalError,
} from './errors/internal-errors';
import type { RateLimitError } from './errors/ncs-errors';
import { INTERNAL_ERROR_CODE } from './errors/internal-errors';
import { NCS_ERROR_CODE } from './errors/ncs-errors';
import { NotConnectedError, NotInitializedError } from './errors/custom-errors';
import type { Metadata, UserPermitType } from '@atlaskit/editor-common/collab';

const logger = createLogger('Channel', 'green');

export class Channel extends Emitter<ChannelEvent> {
	private readonly RATE_LIMIT_TYPE_NONE = 0;
	private readonly RATE_LIMIT_TYPE_SOFT = 1;
	private readonly RATE_LIMIT_TYPE_HARD = 2;

	private connected: boolean = false;
	private readonly config: Config;
	private socket: Socket | null = null;
	private reconnectHelper?: ReconnectHelper | null = null;
	private initialized: boolean = false;
	private readonly analyticsHelper?: AnalyticsHelper;
	private initExperience?: UFOExperience;
	private token?: string;
	private network: Network | null = null;

	private readonly rateLimitWindowDurationMs: number = 60000;
	private rateLimitWindowStartMs: number = 0;
	private stepCounter: number = 0;
	private stepSizeCounter: number = 0;
	private maxStepSize: number = 0;

	constructor(config: Config, analyticsHelper: AnalyticsHelper) {
		super();
		this.config = config;
		this.analyticsHelper = analyticsHelper;
		this.initExperience = createDocInitExp(this.analyticsHelper);
	}

	// read-only getters used for tests
	getInitialized = () => this.initialized;
	getConnected = () => this.connected;
	getSocket: () => Socket | null = () => this.socket;
	getToken = () => this.token;

	// Used to retrieve the x-token for API requests
	getChannelToken = async () => {
		if (this.token) {
			return this.token;
		}
		if (!this.config.permissionTokenRefresh) {
			return undefined;
		}
		const token = (await this.config.permissionTokenRefresh()) ?? undefined;
		return token;
	};

	/**
	 * Connect to collab service using websockets
	 */
	connect(shouldInitialize: boolean = false) {
		startMeasure(MEASURE_NAME.SOCKET_CONNECT, this.analyticsHelper);
		// If provider already has access to the initial draft, explicitly set channel as initialized
		// to bypass BE doc retrieval
		if (shouldInitialize) {
			this.initialized = true;
		}
		if (!this.initialized) {
			startMeasure(MEASURE_NAME.DOCUMENT_INIT, this.analyticsHelper);
			this.initExperience?.start();
		}
		const { documentAri, url } = this.config;
		const { createSocket, permissionTokenRefresh } = this.config;

		let auth: AuthCallback;
		if (permissionTokenRefresh) {
			auth = async (cb: (data: InitAndAuthData) => void) => {
				// Rebuild authData to ensure values are current
				const authData: InitAndAuthData = {
					// The initialized status. If false, BE will send document, otherwise not.
					initialized: this.initialized,
					// ESS-1009 Allow to opt-in into 404 response
					need404: this.config.need404,
				};
				try {
					const token = await permissionTokenRefresh();

					if (token) {
						authData.token = token;
					} else {
						authData.token = undefined;
					}

					cb(authData);
				} catch (error) {
					// Pass the error back to the consumers so they can deal with exceptional cases themselves (eg. no permissions because the page was deleted)
					const authenticationError: TokenPermissionError = {
						message: 'Insufficient editing permissions',
						data: {
							status: 403,
							code: INTERNAL_ERROR_CODE.TOKEN_PERMISSION_ERROR,
							meta: {
								originalError: error,
								// Ignored via go/ees005
								// eslint-disable-next-line @typescript-eslint/no-explicit-any
								reason: (error as any)?.data?.meta?.reason, // Should always be 'RESOURCE_DELETED' Temporary, until Confluence Cloud removes their hack
								// https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/browse/next/packages/native-collab/src/fetchCollabPermissionToken.ts#37
							},
						},
					};
					this.emit('error', authenticationError);
				}
			};
		} else {
			// Ignored via go/ees005
			// eslint-disable-next-line require-await
			auth = async (cb: (data: InitAndAuthData) => void) => {
				// Rebuild authData to ensure values are current
				const authData: InitAndAuthData = {
					// The initialized status. If false, BE will send document, otherwise not.
					initialized: this.initialized,
					// ESS-1009 Allow to opt-in into 404 response
					need404: this.config.need404,
				};
				cb(authData);
			};
		}

		this.socket = createSocket(
			`${url}/session/${documentAri}`,
			auth,
			this.config.productInfo,
		) as Socket;

		// Due to https://github.com/socketio/socket.io-client/issues/1473,
		// reconnect no longer fired on the socket.
		// We should use `connect` for better cross platform compatibility(Mobile/Web).
		this.socket.on('connect', this.onConnect);
		this.socket.on('data', this.onReceiveData);
		this.socket.on('permission', (permit: UserPermitType) => {
			this.emit('permission', permit);
		});
		this.socket.on('steps:added', (data: StepsPayload) => {
			this.emit('steps:added', data);
		});
		this.socket.on('participant:telepointer', ({ timestamp, data }: BroadcastIncomingPayload) => {
			// data is TelepointerPayload without timestamp
			this.emit('participant:telepointer', { timestamp, ...data });
		});
		this.socket.on('participant:activity-ack', ({ data }: BroadcastIncomingPayload) => {
			this.emit('participant:activity-ack', data);
		});
		this.socket.on('participant:activity-join', ({ data }: BroadcastIncomingPayload) => {
			this.emit('participant:activity-join', data);
		});
		this.socket.on('presence:joined', (data: PresencePayload) => {
			this.emit('presence:joined', data);
		});
		this.socket.on('presence', (data: PresencePayload) => {
			this.emit('presence', data);
		});
		this.socket.on('participant:left', (data: PresencePayload) => {
			this.emit('participant:left', data);
		});
		this.socket.on(
			'participant:updated',
			({
				sessionId,
				timestamp,
				data,
				clientId,
			}: PresencePayload & { data: { userId: string } }) => {
				this.emit('participant:updated', {
					sessionId,
					timestamp,
					clientId,
					...data,
				});
			},
		);
		this.socket.on('metadata:changed', (payload: Metadata) => {
			this.emit('metadata:changed', payload);
		});

		// ESS-2916 namespace status event - lock/unlock
		this.socket.on('status', (data: NamespaceStatus) => {
			this.emit('status', data);
		});
		// Ignored via go/ees005
		// eslint-disable-next-line require-await
		this.socket.on('disconnect', async (reason: string) => {
			this.connected = false;
			logger(`disconnect reason: ${reason}`);
			this.emit('disconnect', { reason });
			if (reason === socketIOReasons.IO_SERVER_DISCONNECT && this.socket) {
				// The disconnection was initiated by the server, we need to reconnect manually.
				try {
					this.socket.connect();
				} catch (error) {
					this.analyticsHelper?.sendErrorEvent(error, 'Error while reconnecting the channel');
					const reconnectionError: ReconnectionError = {
						message: 'Caught error during reconnection',
						data: {
							status: 500,
							code: INTERNAL_ERROR_CODE.RECONNECTION_ERROR,
						},
					};
					this.emit('error', reconnectionError);
				}
			}
		});

		// Socket error, including errors from `packetMiddleware`, `controllers` and `onconnect` and more. Parameter is a plain JSON object.
		this.socket.on('error', (socketError: InternalError) => {
			this.emit('error', socketError);
		});

		// `connect_error`'s parameter type is `Error`.
		// Ensure the error emit to the provider has the same structure, so we can handle them unified.
		this.socket.on('connect_error', this.onConnectError);
		this.socket.on('permission:invalidateToken', this.handlePermissionInvalidateToken);
		this.socket.onAnyOutgoing((_event, ...args) => this.onAnyOutgoingHandler(Date.now(), args));

		// To trigger reconnection when browser comes back online
		if (!this.network) {
			this.network = new Network({
				onlineCallback: this.onOnlineHandler,
			});
		}

		// Helper class to track reconnection issues, to emit an error if too many failed reconnection attempts happen
		this.reconnectHelper = new ReconnectHelper();
		// Fired upon a reconnection attempt error (from Socket.IO Manager)
		this.socket.io.on('reconnect_error', this.onReconnectError);
	}

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onAnyOutgoingHandler(currentTimeMs: number, args: any[]) {
		const rateLimitType = this.config.rateLimitType || this.RATE_LIMIT_TYPE_NONE;
		if (rateLimitType === this.RATE_LIMIT_TYPE_NONE) {
			return;
		}

		const stepLimit = this.config.rateLimitStepCount || 0;
		const stepSizeLimit = this.config.rateLimitTotalStepSize || 0;
		const maxStepSizeLimit = this.config.rateLimitMaxStepSize || 0;

		for (const arg of args) {
			if (arg.type === 'steps:commit') {
				if (currentTimeMs - this.rateLimitWindowStartMs > this.rateLimitWindowDurationMs) {
					// Start a new window
					this.rateLimitWindowStartMs = currentTimeMs;
					this.stepCounter = 0;
					this.stepSizeCounter = 0;
					this.maxStepSize = 0;
				}

				this.stepCounter += arg.steps.length;
				for (const step of arg.steps) {
					const stepSize = JSON.stringify(step).length;
					this.stepSizeCounter += stepSize;
					if (stepSize > this.maxStepSize) {
						this.maxStepSize = stepSize;
					}
				}

				if (this.isLimitExceeded(stepLimit, stepSizeLimit, maxStepSizeLimit)) {
					const rateLimitError: RateLimitError = {
						message: 'Rate limited',
						data: {
							code: NCS_ERROR_CODE.RATE_LIMIT_ERROR,
							status: 500,
							meta: {
								rateLimitType,
								maxStepSize: this.maxStepSize,
								stepSizeCounter: this.stepSizeCounter,
								stepCounter: this.stepCounter,
							},
						},
					};

					if (rateLimitType === this.RATE_LIMIT_TYPE_HARD) {
						this.emit('error', rateLimitError);
						throw new Error();
					} else if (rateLimitType === this.RATE_LIMIT_TYPE_SOFT) {
						this.analyticsHelper?.sendErrorEvent(rateLimitError, 'Rate limited');
					}
				}
			}
		}
	}

	private async commonHeaders() {
		return {
			...(this.config.permissionTokenRefresh
				? {
						'x-token': await this.getChannelToken(),
					}
				: {}),
			'x-product': getProduct(this.config.productInfo),
			'x-subproduct': getSubProduct(this.config.productInfo),
		};
	}

	private isLimitExceeded(stepLimit: number, stepSizeLimit: number, maxStepSizeLimit: number) {
		return (
			(stepLimit > 0 && this.stepCounter > stepLimit) ||
			(stepSizeLimit > 0 && this.stepSizeCounter > stepSizeLimit) ||
			(maxStepSizeLimit > 0 && this.maxStepSize > maxStepSizeLimit)
		);
	}

	private handlePermissionInvalidateToken = (data: { reason: string }) => {
		logger('Received permission invalidate event ', data);
		this.analyticsHelper?.sendActionEvent(EVENT_ACTION.INVALIDATE_TOKEN, EVENT_STATUS.SUCCESS, {
			reason: data.reason,
			// Potentially incorrect when value of token changes between connecting and connect.
			// See: https://bitbucket.org/atlassian/%7Bc8e2f021-38d2-46d0-9b7a-b3f7b428f724%7D/pull-requests/29905#comment-375308874
			usedCachedToken: !!this.token,
		});
	};

	private onConnectError = (error: unknown) => {
		const measure = stopMeasure(MEASURE_NAME.SOCKET_CONNECT, this.analyticsHelper);

		this.analyticsHelper?.sendActionEvent(EVENT_ACTION.CONNECTION, EVENT_STATUS.FAILURE, {
			latency: measure?.duration,
			// Potentially incorrect when value of token changes between connecting and connect.
			// See: https://bitbucket.org/atlassian/%7Bc8e2f021-38d2-46d0-9b7a-b3f7b428f724%7D/pull-requests/29905#comment-375308874
			usedCachedToken: !!this.token,
		});
		this.analyticsHelper?.sendErrorEvent(error, 'Error while establishing connection');
		// If error received with `data`, it means the connection is rejected
		// by the server on purpose for example no permission, so no need to
		// keep the underneath connection, need to close. But some error like
		// `xhr polling error` needs to retry.
		const errorData = (error as InternalError).data;
		if (errorData) {
			this.socket?.close();
		}
		const connectionError: ConnectionError = {
			message: (error as Error).message ?? 'Connection error without message',
			data: {
				// @ts-expect-error I bet we'll see some connection errors, for the Socket IO errors
				code: errorData?.code ?? INTERNAL_ERROR_CODE.CONNECTION_ERROR,
				...errorData,
			},
		};
		this.emit('error', connectionError);
	};

	private onReconnectError = (error: Error) => {
		this.reconnectHelper?.countReconnectError();
		if (this.reconnectHelper?.isLikelyNetworkIssue()) {
			this.analyticsHelper?.sendErrorEvent(
				error,
				'Likely network issue while reconnecting the channel',
			);
			const reconnectionError: ReconnectionNetworkError = {
				message:
					'Reconnection failed 8 times when browser was offline, likely there was a network issue',
				data: {
					code: INTERNAL_ERROR_CODE.RECONNECTION_NETWORK_ISSUE,
				},
			};
			this.emit('error', reconnectionError);
		}
	};

	private onConnect = () => {
		this.connected = true;
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		logger('Connected.', this.socket!.id);
		const measure = stopMeasure(MEASURE_NAME.SOCKET_CONNECT, this.analyticsHelper);

		this.analyticsHelper?.sendActionEvent(EVENT_ACTION.CONNECTION, EVENT_STATUS.SUCCESS, {
			latency: measure?.duration,
			// Potentially incorrect when value of token changes between connecting and connect.
			// See: https://bitbucket.org/atlassian/%7Bc8e2f021-38d2-46d0-9b7a-b3f7b428f724%7D/pull-requests/29905#comment-375308874
			usedCachedToken: !!this.token,
		});
		this.emit('connected', {
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			sid: this.socket!.id!,
			initialized: this.initialized,
		});
	};

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private onReceiveData = (data: any) => {
		logger('Received data', data);

		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		logger('Session ID is', this.socket!.id);

		if (data.type === 'initial') {
			if (!this.initialized) {
				const { doc, version, userId, metadata }: InitPayload = data;

				const measure = stopMeasure(MEASURE_NAME.DOCUMENT_INIT, this.analyticsHelper);
				this.initExperience?.success();
				this.analyticsHelper?.sendActionEvent(
					EVENT_ACTION.DOCUMENT_INIT, // TODO: detect when document init fails and fire corresponding event for it
					EVENT_STATUS.SUCCESS,
					{
						latency: measure?.duration,
						resetReason: data.resetReason,
						hasTitle: !!data.metadata?.title,
					},
				);

				this.initialized = true;
				this.emit('init', {
					doc,
					version,
					userId,
					metadata,
				});
			} else {
				// Page has just been restored, need to fix all the participants as well.
				const { doc, version, userId, metadata, targetClientId }: InitPayload = data;
				this.emit('restore', {
					doc,
					version,
					userId,
					metadata,
					targetClientId,
				});
			}
		} else {
			this.emit('steps:added', data);
		}
	};

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/max-params
	fetchCatchupv2 = async (
		fromVersion: number,
		clientId: number | string | undefined,
		catchUpOutofSync: boolean | undefined,
		reason?: CatchupEventReason,
	): Promise<Catchupv2Response> => {
		try {
			const { steps, metadata } = await utils.requestService<Catchupv2Response>(this.config, {
				path: `document/${encodeURIComponent(this.config.documentAri)}/catchupv2`,
				queryParams: {
					version: fromVersion,
					clientId: clientId,
					catchUpOutofSync,
					reason,
				},
				requestInit: {
					headers: await this.commonHeaders(),
				},
			});
			return {
				steps,
				metadata,
			};
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			if (error.code === 404) {
				const errorNotFound: DocumentNotFoundError = {
					message: 'The requested document is not found',
					data: {
						status: error.code,
						code: INTERNAL_ERROR_CODE.DOCUMENT_NOT_FOUND,
					},
				};
				this.emit('error', errorNotFound);
				return {};
			}

			logger("Can't fetch the catchupv2", error.message);
			const errorCatchupv2: CatchUpFailedError = {
				message: 'Cannot fetch catchupv2 from collab service',
				data: {
					status: error.status,
					code: INTERNAL_ERROR_CODE.CATCHUP_FAILED,
				},
			};
			this.emit('error', errorCatchupv2);
			throw error;
		}
	};

	fetchReconcile = async (currentStateDoc: string, reason: string): Promise<ReconcileResponse> => {
		try {
			const reqBody = JSON.stringify({
				doc: currentStateDoc,
				productId: 'ccollab',
				reason,
			});
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const reconcileResponse = await utils.requestService<any>(this.config, {
				path: `document/${encodeURIComponent(this.config.documentAri)}/reconcile`,
				requestInit: {
					headers: {
						...(await this.commonHeaders()),
						'Content-Type': 'application/json',
					},
					method: 'POST',
					body: reqBody,
				},
			});
			return reconcileResponse;
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			this.analyticsHelper?.sendErrorEvent(error, 'Error while fetching reconciled document');
			throw error;
		}
	};

	/**
	 * Send message to the back-end service over the channel. Timestamp will be added server side.
	 * @throws {NotInitializedError} Channel not initialized
	 * @throws {NotConnectedError} Channel not connected
	 */
	broadcast = <K extends keyof ChannelEvent>(
		type: K,
		data: Omit<ChannelEvent[K], 'timestamp'>,
		callback?: Function,
	) => {
		if (!this.socket) {
			throw new NotInitializedError('Cannot broadcast, not initialized yet');
		}
		if (!this.connected) {
			if (this.config.throwOnNotConnected) {
				throw new NotConnectedError('Cannot broadcast, currently offline.');
			}
			return;
		}

		this.socket.emit('broadcast', { type, ...data }, callback);
	};

	/**
	 * Send metadata to the back-end service over the channel
	 * @throws {NotInitializedError} Channel not initialized
	 * @throws {NotConnectedError} Channel not connected
	 */
	sendMetadata = (metadata: Metadata) => {
		if (!this.socket) {
			throw new NotInitializedError('Cannot send metadata, not initialized yet');
		}
		if (!this.connected) {
			if (this.config.throwOnNotConnected) {
				throw new NotConnectedError('Cannot send metadata, currently offline.');
			}
		}
		this.socket.emit('metadata', metadata);
	};

	sendPresenceJoined = () => {
		if (!this.connected || !this.socket) {
			return;
		}
		this.socket.emit('presence:joined');
	};

	onOnlineHandler = () => {
		// Force an immediate reconnect, the socket must first be closed to reset reconnection delay logic
		if (!this.connected) {
			this.socket?.close();
			this.socket?.connect();
		}
	};

	disconnect() {
		this.unsubscribeAll();
		this.network?.destroy();
		this.network = null;

		if (this.socket) {
			this.socket.close();
			this.socket = null;
			this.reconnectHelper?.destroy();
		}
	}
}
