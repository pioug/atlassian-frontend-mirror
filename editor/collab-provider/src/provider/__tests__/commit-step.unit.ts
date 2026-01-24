import { Slice } from '@atlaskit/editor-prosemirror/model';
import { Transaction, type EditorState } from '@atlaskit/editor-prosemirror/state';
import { ReplaceStep } from '@atlaskit/editor-prosemirror/transform';
import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing';
import { CommitStepService, RESET_READYTOCOMMIT_INTERVAL_MS } from '../commit-step';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import { SetAttrsStep } from '@atlaskit/adf-schema/steps';
import { EVENT_STATUS } from '../../helpers/const';
import { createSocketIOCollabProvider } from '../../socket-io-provider';
import { AcknowledgementResponseTypes } from '../../types';
import { NotConnectedError } from '../../errors/custom-errors';
import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';

jest.mock('@atlaskit/feature-gate-js-client', () => ({
	...jest.requireActual('@atlaskit/feature-gate-js-client'),
	initialize: jest.fn(Promise.resolve),
	initializeCompleted: jest.fn(() => true),
	getExperimentValue: jest.fn(),
	checkGate: jest.fn(),
}));

// create editor state
const { collab: collabPlugin } = jest.requireActual('@atlaskit/prosemirror-collab');
const editorState: EditorState = createEditorState(
	doc(p('lol')),
	collabPlugin({ clientID: 3771180701 }),
);

// create provider
const config = {
	url: 'http://localhost:4999',
	documentAri: 'ari:cloud:confluence:ABC:page/def',
};
const provider = createSocketIOCollabProvider(config);
const fakeStep = new ReplaceStep(1, 1, Slice.empty);

const emitMock = jest.fn();

const createTestHelpers = (
	options: {
		offlineBroadcast?: boolean;
	} = {
		offlineBroadcast: false,
	},
) => {
	const broadcastSpy = jest.spyOn(provider['channel'], 'broadcast');
	const onStepsAddedSpy = jest.spyOn(provider['documentService'], 'onStepsAdded');
	const errorEventSpy = jest.spyOn(provider['analyticsHelper'] as any, 'sendErrorEvent');
	const actionEventSpy = jest.spyOn(provider['analyticsHelper'] as any, 'sendActionEvent');
	const onErrorHandledSpy = jest.spyOn(
		provider['documentService'],
		// @ts-ignore
		'onErrorHandled',
	);
	// using the Object['attribute'] syntax here to avoid calling
	// ts-ignore over every line. As a rule this syntax will only be used
	// to access a private variable within this function block

	const commitStepService = new CommitStepService(
		options.offlineBroadcast
			? jest.fn().mockImplementation(() => {
					throw new NotConnectedError('Cannot broadcast, currently offline.');
				})
			: provider['channel'].broadcast,
		provider['analyticsHelper'],
		emitMock,
		provider['documentService']['onErrorHandled'],
	);

	// pre set commitStep with necessary functions
	const presetCommitStepQueue = (
		steps: any,
		version = 1,
		userId = 'user1',
		clientId = 'client1',
		options: {
			__livePage?: boolean;
			collabMode?: string;
			hasRecovered?: boolean;
			isPublish?: boolean;
			lockSteps?: (stepOrigins?: readonly Transaction[]) => void;
			stepOrigins?: readonly Transaction[];
		} = {
			__livePage: false,
			hasRecovered: false,
			collabMode: 'collab',
			isPublish: false,
			lockSteps: jest.fn(),
			stepOrigins: [],
		},
	) => {
		commitStepService.commitStepQueue({
			steps,
			version,
			userId,
			clientId,
			onStepsAdded: provider['documentService'].onStepsAdded,
			__livePage: options.__livePage ?? false,
			hasRecovered: options.hasRecovered ?? false,
			collabMode: options.collabMode ?? 'collab',
			reason: options.isPublish ? 'publish' : undefined,
			lockSteps: options.lockSteps || jest.fn(),
			stepOrigins: options.stepOrigins ?? [],
		});
	};

	return {
		commitStepService,
		presetCommitStepQueue,
		broadcastSpy,
		onStepsAddedSpy,
		errorEventSpy,
		actionEventSpy,
		onErrorHandledSpy,
	};
};

// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

describe('commitStepQueue', () => {
	const {
		commitStepService,
		presetCommitStepQueue,
		broadcastSpy,
		onStepsAddedSpy,
		errorEventSpy,
		actionEventSpy,
		onErrorHandledSpy,
	} = createTestHelpers();

	beforeEach(() => {
		jest.useFakeTimers({ legacyFakeTimers: true });
		jest.spyOn(global, 'setTimeout');
		provider.initialize(() => editorState);
		jest.runOnlyPendingTimers(); // running pending timers will set `readyToCommit` flag to true
		errorEventSpy.mockReset();
	});
	afterEach(() => {
		jest.useRealTimers();
		jest.clearAllMocks();
	});

	it('Handles expand state steps for __livePages', () => {
		const fakeStep = new SetAttrsStep(1, { __expanded: true, title: 'any' });
		presetCommitStepQueue([fakeStep], 1, 'user1', 'client1', {
			__livePage: true,
			hasRecovered: false,
		});
		expect(broadcastSpy).toBeCalledTimes(1);
		// When feature flag on and __livePages on -- we strip out the __expanded attribute from the step.
		expect((broadcastSpy.mock.calls[0][1] as any).steps[0].attrs).toStrictEqual({
			title: 'any',
		});
	});

	it('Adds cliendIds and userIds to steps before broadcast', () => {
		presetCommitStepQueue([fakeStep], 1, 'user1', 'client1');

		expect(broadcastSpy).toBeCalledTimes(1);
		expect(broadcastSpy).toBeCalledWith(
			'steps:commit',
			{
				steps: [
					{
						...fakeStep.toJSON(),
						clientId: 'client1',
						userId: 'user1',
					},
				],
				version: 1,
				userId: 'user1',
				collabMode: 'collab',
			},
			expect.any(Function),
		);
	});

	it('Tags unconfirmed steps after recovery to steps before broadcast', () => {
		const fakeStep = new SetAttrsStep(1, { __expanded: true, title: 'any' });

		presetCommitStepQueue([fakeStep], 1, 'user1', 'client1', {
			__livePage: false,
			hasRecovered: true,
		});

		expect(broadcastSpy).toBeCalledTimes(1);
		expect(broadcastSpy).toBeCalledWith(
			'steps:commit',
			{
				steps: [
					{
						...fakeStep.toJSON(),
						clientId: 'client1',
						userId: 'user1',
						metadata: { unconfirmedStepAfterRecovery: true },
					},
				],
				version: 1,
				userId: 'user1',
				collabMode: 'collab',
			},
			expect.any(Function),
		);
	});

	eeTest.describe('platform_editor_offline_editing_web', '').variant(true, () => {
		it('Tags steps that are marked as offline before broadcast', () => {
			const fakeStep = new SetAttrsStep(1, { __expanded: true, title: 'any' });

			const stepOrigin = new Transaction({} as any);
			stepOrigin.setMeta('isOffline', true);
			presetCommitStepQueue([fakeStep], 1, 'user1', 'client1', {
				stepOrigins: [stepOrigin],
			});

			expect(broadcastSpy).toBeCalledTimes(1);
			expect(broadcastSpy).toBeCalledWith(
				'steps:commit',
				{
					steps: [
						{
							...fakeStep.toJSON(),
							clientId: 'client1',
							userId: 'user1',
							metadata: { createdOffline: true },
						},
					],
					version: 1,
					userId: 'user1',
					collabMode: 'collab',
				},
				expect.any(Function),
			);
		});

		it('Tags steps that were offline before broadcast', () => {
			const fakeStep = new SetAttrsStep(1, { __expanded: true, title: 'any' });

			const stepOrigin = new Transaction({} as any);
			stepOrigin.setMeta('wasOffline', true);
			presetCommitStepQueue([fakeStep], 1, 'user1', 'client1', {
				stepOrigins: [stepOrigin],
			});

			expect(broadcastSpy).toBeCalledTimes(1);
			expect(broadcastSpy).toBeCalledWith(
				'steps:commit',
				{
					steps: [
						{
							...fakeStep.toJSON(),
							clientId: 'client1',
							userId: 'user1',
							metadata: { createdOffline: true },
						},
					],
					version: 1,
					userId: 'user1',
					collabMode: 'collab',
				},
				expect.any(Function),
			);
		});
	});

	it('Send error analytics events with correct Error when broadcast throws', () => {
		broadcastSpy.mockImplementation(() => {
			throw new Error('Darn it!');
		});

		presetCommitStepQueue([fakeStep], 1, 'user1', 'client1');

		expect(broadcastSpy).toBeCalledTimes(1);
		expect(broadcastSpy).toThrow('Darn it!');
		expect(errorEventSpy).toBeCalledTimes(1);
		expect(errorEventSpy).toBeCalledWith(
			new Error('Darn it!'),
			'Error while adding steps - Broadcast threw exception',
		);
	});

	it('Adds collabMode to steps:commit', () => {
		presetCommitStepQueue([fakeStep], 1, 'user1', 'client1');

		expect(broadcastSpy).toHaveBeenCalledTimes(1);
		expect(broadcastSpy).toHaveBeenCalledWith(
			'steps:commit',
			expect.objectContaining({
				collabMode: 'collab',
			}),
			expect.any(Function),
		);
	});

	describe('broadcast callback', () => {
		const broadcastMockImplementation = ({
			type = '',
			version = -1,
			errCode = '',
			delay = undefined,
		}: {
			delay?: number;
			errCode?: string;
			type?: string;
			version?: number;
		}) => {
			broadcastSpy.mockImplementation(
				// @ts-ignore type checks
				(event: string, data: any, cb: (resp: any) => void) => {
					// calls broadcast callback with given data depending on type
					if (type === 'SUCCESS') {
						cb({ type, version, delay });
					} else {
						cb({
							type,
							// simulate how BE calls this:
							error: {
								message: 'Cookie monster is here!',
								data: {
									status: 500,
									...(errCode ? { code: errCode } : {}),
								},
								delay,
							},
						});
					}
				},
			);
		};

		describe('locks steps from merging when step merging experiment enabled', () => {
			eeTest('platform_editor_enable_single_player_step_merging', {
				true: () => {
					broadcastMockImplementation({ type: 'SUCCESS', version: 2 });

					const lockStepsMock = jest.fn();
					presetCommitStepQueue([fakeStep], 1, 'user1', 'client1', {
						lockSteps: lockStepsMock,
					});
					// lockSteps is called after a delay after the broadcast callback
					jest.advanceTimersByTime(680); // default delay when no backpressure delay is sent
					expect(lockStepsMock).toHaveBeenCalled();
				},
				false: () => {
					broadcastMockImplementation({ type: 'SUCCESS', version: 2 });

					const lockStepsMock = jest.fn();
					presetCommitStepQueue([fakeStep], 1, 'user1', 'client1', {
						lockSteps: lockStepsMock,
					});
					expect(lockStepsMock).not.toHaveBeenCalled();
				},
			});
		});

		describe('on successful response', () => {
			beforeEach(() => {
				jest.runOnlyPendingTimers();
				broadcastMockImplementation({ type: 'SUCCESS', version: 2 });
				jest.spyOn(global.Math, 'random').mockReturnValue(0.069);

				presetCommitStepQueue([fakeStep], 1, 'user1', 'client1');
			});

			afterEach(() => {
				jest.spyOn(global.Math, 'random').mockRestore();
			});

			it('onStepsAdded called with correct data after ACK', async () => {
				const steps = {
					steps: [
						{
							clientId: 'client1',
							from: 1,
							stepType: 'replace',
							to: 1,
							userId: 'user1',
						},
					],
					version: 2,
				};
				expect(commitStepService.getReadyToCommitStatus()).toBe(false);
				presetCommitStepQueue([fakeStep], 1, 'user1', 'client1');
				expect(commitStepService.getReadyToCommitStatus()).toBe(false);
				presetCommitStepQueue([fakeStep], 1, 'user1', 'client1');
				expect(commitStepService.getReadyToCommitStatus()).toBe(false);

				expect(onStepsAddedSpy).toBeCalledTimes(1);
				expect(onStepsAddedSpy).toBeCalledWith(steps);

				expect(commitStepService.getReadyToCommitStatus()).toBe(false);
				jest.advanceTimersByTime(RESET_READYTOCOMMIT_INTERVAL_MS);
				expect(commitStepService.getReadyToCommitStatus()).toBe(true);
				presetCommitStepQueue([fakeStep], 1, 'user1', 'client1');
				expect(onStepsAddedSpy).toBeCalledTimes(2);
				expect(onStepsAddedSpy).toBeCalledWith(steps);
			});

			it('analytics action event sent', () => {
				expect(actionEventSpy).toBeCalledTimes(2);
				expect(actionEventSpy).toBeCalledWith('addSteps', EVENT_STATUS.SUCCESS_10x_SAMPLED, {
					latency: 0,
					stepType: { replace: 1 },
					type: 'ACCEPTED',
				});
			});

			it('commit attempt & success event emitted', () => {
				expect(emitMock).toBeCalledTimes(2);
				expect(emitMock.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "commit-status",
			    {
			      "status": "attempt",
			      "version": 1,
			    },
			  ],
			  [
			    "commit-status",
			    {
			      "status": "success",
			      "version": 2,
			    },
			  ],
			]
		`);
			});
		});

		describe('backpressure delay handling', () => {
			it(`Resets readyToCommit flag after ${RESET_READYTOCOMMIT_INTERVAL_MS}`, () => {
				const lockStepsMock = jest.fn();
				presetCommitStepQueue([fakeStep], 1, 'user1', 'client1', { lockSteps: lockStepsMock });
				expect(commitStepService.getReadyToCommitStatus()).toBe(false);
				jest.advanceTimersByTime(RESET_READYTOCOMMIT_INTERVAL_MS);
				expect(lockStepsMock).toHaveBeenCalledTimes(1);
				expect(commitStepService.getReadyToCommitStatus()).toBe(true);
			});

			it('should honour back pressure delay sent from BE ack', () => {
				jest.runOnlyPendingTimers();
				broadcastMockImplementation({ type: 'SUCCESS', version: 2, delay: 500 });
				const lockStepsMock = jest.fn();
				presetCommitStepQueue([fakeStep], 1, 'user1', 'client1', { lockSteps: lockStepsMock });
				expect(commitStepService.getReadyToCommitStatus()).toBe(false);
				jest.advanceTimersByTime(260);
				expect(commitStepService.getReadyToCommitStatus()).toBe(false);
				jest.advanceTimersByTime(260);
				expect(lockStepsMock).toHaveBeenCalledTimes(1);
				expect(commitStepService.getReadyToCommitStatus()).toBe(true);
			});

			it('should wait 680ms when no backpressure delay is sent', () => {
				jest.runOnlyPendingTimers();
				broadcastMockImplementation({ type: 'SUCCESS', version: 2 });
				const lockStepsMock = jest.fn();
				presetCommitStepQueue([fakeStep], 1, 'user1', 'client1', { lockSteps: lockStepsMock });
				expect(commitStepService.getReadyToCommitStatus()).toBe(false);
				jest.advanceTimersByTime(600);
				expect(commitStepService.getReadyToCommitStatus()).toBe(false);
				jest.advanceTimersByTime(100);
				expect(lockStepsMock).toHaveBeenCalledTimes(1);
				expect(commitStepService.getReadyToCommitStatus()).toBe(true);
			});

			it('skips backpressure delay on publish', () => {
				jest.runOnlyPendingTimers();
				broadcastMockImplementation({ type: 'SUCCESS', version: 2, delay: 500 });
				presetCommitStepQueue([fakeStep], 1, 'user1', 'client1');
				expect(commitStepService.getReadyToCommitStatus()).toBe(false);
				presetCommitStepQueue([fakeStep], 1, 'user1', 'client1', { isPublish: true });
				// publish should trigger another broadcast
				expect(broadcastSpy).toHaveBeenCalledTimes(2);
			});
		});

		describe('on unsuccessfull (ERROR) response', () => {
			const broadcastMockErrorWithCode = (errCode?: string) => {
				broadcastMockImplementation({
					type: AcknowledgementResponseTypes.ERROR,
					...(errCode ? { errCode } : {}),
				});
			};

			it('onErrorHandled called with correct response error', () => {
				broadcastMockErrorWithCode('Some weird stuff going on');
				presetCommitStepQueue([fakeStep], 1, 'user1', 'client1');

				expect(onErrorHandledSpy).toBeCalledTimes(1);
				expect(onErrorHandledSpy).toBeCalledWith({
					message: 'Cookie monster is here!',
					data: {
						status: 500,
						code: 'Some weird stuff going on',
					},
				});
			});

			it('commit attempt & failure event emitted', () => {
				broadcastMockErrorWithCode('Some weird stuff going on');
				presetCommitStepQueue([fakeStep], 1, 'user1', 'client1');

				expect(emitMock).toBeCalledTimes(2);
				expect(emitMock.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "commit-status",
			    {
			      "status": "attempt",
			      "version": 1,
			    },
			  ],
			  [
			    "commit-status",
			    {
			      "status": "failure",
			      "version": 1,
			    },
			  ],
			]
		`);
			});

			it('should set readyToCommit to true when broadcast fails due to not being connected', () => {
				const { commitStepService, presetCommitStepQueue } = createTestHelpers({
					offlineBroadcast: true,
				});
				const lockStepsMock = jest.fn();

				presetCommitStepQueue([fakeStep], 1, 'user1', 'client1', {
					__livePage: false,
					hasRecovered: false,
					collabMode: 'collab',
					lockSteps: lockStepsMock,
				});
				expect(lockStepsMock).toHaveBeenCalledTimes(1);
				expect(commitStepService.getReadyToCommitStatus()).toBe(true);
			});

			describe('analytics action event send with', () => {
				it('unknown/no response error code', () => {
					broadcastMockErrorWithCode('Some weird stuff going on');
					presetCommitStepQueue([fakeStep], 1, 'user1', 'client1');

					expect(actionEventSpy).toBeCalledTimes(2);
					expect(actionEventSpy).toBeCalledWith('addSteps', 'FAILURE', {
						latency: 0,
						type: 'ERROR',
					});
				});

				it('head version failed response error code', () => {
					broadcastMockErrorWithCode('HEAD_VERSION_UPDATE_FAILED');
					presetCommitStepQueue([fakeStep], 1, 'user1', 'client1');

					expect(actionEventSpy).toBeCalledTimes(2);
					expect(actionEventSpy).toHaveBeenNthCalledWith(2, 'addSteps', 'FAILURE', {
						latency: 0,
						type: 'REJECTED',
					});
				});

				it('not ready to commit', () => {
					presetCommitStepQueue([fakeStep], 1, 'user1', 'client1');
					presetCommitStepQueue([fakeStep], 1, 'user1', 'client1');
					presetCommitStepQueue([fakeStep], 1, 'user1', 'client1');
					presetCommitStepQueue([fakeStep], 1, 'user1', 'client1');
					expect(onStepsAddedSpy).toBeCalledTimes(0);
				});
			});

			describe('analytics error event sent', () => {
				describe('with step related error code', () => {
					it('when head version update failed', () => {
						broadcastMockErrorWithCode('HEAD_VERSION_UPDATE_FAILED');
						presetCommitStepQueue([fakeStep], 1, 'user1', 'client1');

						expect(errorEventSpy).toBeCalledTimes(1);
						expect(errorEventSpy).toBeCalledWith(
							{
								data: { code: 'HEAD_VERSION_UPDATE_FAILED', status: 500 },
								message: 'Cookie monster is here!',
							},
							'Error while adding steps - Acknowledgement Error',
						);
					});

					// Ignored via go/ees005
					// eslint-disable-next-line jest/no-identical-title
					it('when head version update failed', () => {
						broadcastMockErrorWithCode('VERSION_NUMBER_ALREADY_EXISTS');
						presetCommitStepQueue([fakeStep], 1, 'user1', 'client1');

						expect(errorEventSpy).toBeCalledTimes(1);
						expect(errorEventSpy).toBeCalledWith(
							{
								data: { code: 'VERSION_NUMBER_ALREADY_EXISTS', status: 500 },
								message: 'Cookie monster is here!',
							},
							'Error while adding steps - Acknowledgement Error',
						);
					});
				});

				it('non steps related errors', () => {
					broadcastMockErrorWithCode('Naaniiii?');
					presetCommitStepQueue([fakeStep], 1, 'user1', 'client1');

					expect(errorEventSpy).toBeCalledTimes(2);
					// inside onErrorHandled
					expect(errorEventSpy).toHaveBeenNthCalledWith(
						1,
						{
							data: { code: 'Naaniiii?', status: 500 },
							message: 'Cookie monster is here!',
						},
						'Cookie monster is here!',
					);

					// in commitStep callback
					expect(errorEventSpy).toHaveBeenNthCalledWith(
						2,
						{
							data: { code: 'Naaniiii?', status: 500 },
							message: 'Cookie monster is here!',
						},
						'Error while adding steps - Acknowledgement Error',
					);
				});
			});
		});

		describe('analytics error event sent on unknown response', () => {
			it('with error type', () => {
				broadcastMockImplementation({ type: 'not really sure what' });
				presetCommitStepQueue([fakeStep], 1, 'user1', 'client1');

				expect(errorEventSpy).toBeCalledTimes(1);
				expect(errorEventSpy).toBeCalledWith(
					new Error('Response type: not really sure what'),
					'Error while adding steps - Invalid Acknowledgement',
				);
			});

			it('without error type', () => {
				broadcastSpy.mockImplementation(
					// @ts-ignore type checks
					(event: string, data: any, cb: (resp: any) => void) => {
						cb({});
					},
				);
				presetCommitStepQueue([fakeStep], 1, 'user1', 'client1');

				expect(errorEventSpy).toBeCalledTimes(1);
				expect(errorEventSpy).toBeCalledWith(
					new Error('Response type: No response type'),
					'Error while adding steps - Invalid Acknowledgement',
				);
			});
		});
	});
});
