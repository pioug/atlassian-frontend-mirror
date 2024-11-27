const mockStopMeasureDuration = 1234;
const mockStartTime = 1;
const mockResponseTime = 200;
jest.mock('@atlaskit/editor-common/performance-measures', () => ({
	...jest.requireActual<Object>('@atlaskit/editor-common/performance-measures'),
	startMeasure: jest.fn(),
	stopMeasure: jest.fn(
		(
			measureName: string,
			onMeasureComplete?: (measurement: {
				duration: number;
				startTime: number;
				distortedDuration: boolean;
			}) => void,
		) => {
			onMeasureComplete &&
				onMeasureComplete({
					duration: mockStopMeasureDuration,
					startTime: mockStartTime,
					distortedDuration: false,
				});
		},
	),
}));
jest.mock('@atlaskit/editor-common/performance/navigation', () => ({
	...jest.requireActual<Object>('@atlaskit/editor-common/performance/navigation'),
	getResponseEndTime: jest.fn(() => mockResponseTime),
}));

jest.mock('@atlaskit/editor-common/is-performance-api-available', () => ({
	...jest.requireActual<Object>('@atlaskit/editor-common/is-performance-api-available'),
	isPerformanceAPIAvailable: jest.fn(() => true),
}));

jest.mock('@atlaskit/editor-common/performance/measure-render', () => ({
	...jest.requireActual<Object>('@atlaskit/editor-common/performance/measure-render'),
	measureRender: jest.fn(async (name: string, callback: Function) => {
		await Promise.resolve(0);
		callback({
			duration: mockStopMeasureDuration,
			startTime: mockStartTime,
			distortedDuration: false,
		});
	}),
}));

jest.mock('@atlaskit/editor-plugin-base/src/utils/inputTrackingConfig', () => ({
	inputTracking: {
		enabled: true,
		samplingRate: 1,
		countNodes: true,
		trackSeverity: true,
		trackRenderingTime: false,
		trackSingleKeypress: false,
		severityDegradedThreshold: 3000,
		severityNormalThreshold: 2000,
	},
}));

jest.mock('@atlaskit/editor-common/analytics', () => ({
	...jest.requireActual<Object>('@atlaskit/editor-common/analytics'),
	fireAnalyticsEvent: jest.fn(),
}));

import React from 'react';

import { screen } from '@testing-library/react';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { mount, ReactWrapper } from 'enzyme';
import { createIntl } from 'react-intl-next';

import { FabricChannel } from '@atlaskit/analytics-listeners';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	fireAnalyticsEvent,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import type {
	AnalyticsEventPayload,
	DispatchAnalyticsEvent,
	FireAnalyticsEvent,
} from '@atlaskit/editor-common/analytics';
import { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import * as ProcessRawValueModule from '@atlaskit/editor-common/process-raw-value';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { PublicPluginAPI } from '@atlaskit/editor-common/types';
import { measureRender, SEVERITY } from '@atlaskit/editor-common/utils';
import { analyticsEventKey, toJSON } from '@atlaskit/editor-common/utils';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugins/analytics';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import { EditorView } from '@atlaskit/editor-prosemirror/view';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import createAnalyticsEventMock from '@atlaskit/editor-test-helpers/create-analytics-event-mock';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { blockquote, code_block, doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { media, mediaGroup, mention } from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import patchEditorViewForJSDOM from '@atlaskit/editor-test-helpers/jsdom-fixtures';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import type { MentionProvider } from '@atlaskit/mention/resource';
import { fg } from '@atlaskit/platform-feature-flags';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { mentionResourceProvider } from '@atlaskit/util-data-test/mention-story-data';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { mountWithIntl } from '../../../__tests__/__helpers/enzyme';
import type { EditorAppearance, EditorProps } from '../../../types';
import type { EditorConfig } from '../../../types/editor-config';
import PluginSlot from '../../../ui/PluginSlot';
import {
	PROSEMIRROR_RENDERED_DEGRADED_SEVERITY_THRESHOLD,
	PROSEMIRROR_RENDERED_NORMAL_SEVERITY_THRESHOLD,
} from '../../consts';
import { createUniversalPreset } from '../../create-universal-preset';
import { editorMessages } from '../../messages';
import { ReactEditorView } from '../../ReactEditorView';

export const editorAnalyticsChannel = FabricChannel.editor;

const portalProviderAPI: any = {
	render() {},
	remove() {},
};

const nodeViewPortalProviderAPI: any = {
	render() {},
	remove() {},
};

const requiredProps = () => ({
	providerFactory: ProviderFactory.create({}),
	portalProviderAPI,
	nodeViewPortalProviderAPI,
	onEditorCreated: () => {},
	onEditorDestroyed: () => {},
	editorProps: {},
	intl: createIntl({ locale: 'en' }),
	preset: createUniversalPreset({ props: {} }),
	editorAPI: {},
});

const analyticsProps = () => ({
	allowAnalyticsGASV3: true,
	createAnalyticsEvent: createAnalyticsEventMock() as any,
});

const payload: AnalyticsEventPayload = {
	action: ACTION.CLICKED,
	actionSubject: ACTION_SUBJECT.BUTTON,
	actionSubjectId: ACTION_SUBJECT_ID.BUTTON_HELP,
	attributes: { inputMethod: INPUT_METHOD.TOOLBAR },
	eventType: EVENT_TYPE.UI,
};

type Props = {
	view: EditorView;
	config: EditorConfig;
};
describe('@atlaskit/editor-core', () => {
	let mockFire: ReturnType<FireAnalyticsEvent>;

	beforeEach(() => {
		mockFire = jest.fn();
		(fireAnalyticsEvent as jest.Mock).mockReturnValue(mockFire);
	});

	afterEach(jest.clearAllMocks);

	// Skipping as tests timing out due to open handles (#hot-112198)
	describe.skip('<ReactEditorView />', () => {
		it('should place the initial selection at the end of the document', () => {
			const document = doc(p('hello{endPos}'))(defaultSchema);
			const wrapper = mountWithIntl(
				<ReactEditorView {...requiredProps()} editorProps={{ defaultValue: toJSON(document) }} />,
			);
			const { editorState } = wrapper.instance() as ReactEditorView;
			const cursorPos = (editorState.selection as TextSelection).$cursor!.pos;
			expect(cursorPos).toEqual(document.refs.endPos);
			wrapper.unmount();
		});

		it('should place the initial selection at the start of the document when in full-page appearance', () => {
			const document = doc(p('{startPos}hello'))(defaultSchema);
			const wrapper = mountWithIntl(
				<ReactEditorView
					{...requiredProps()}
					editorProps={{
						defaultValue: toJSON(document),
						appearance: 'full-page',
					}}
				/>,
			);
			const { editorState } = wrapper.instance() as ReactEditorView;
			const cursorPos = (editorState.selection as TextSelection).$cursor!.pos;
			expect(cursorPos).toEqual(document.refs.startPos);
			wrapper.unmount();
		});

		it('should place the initial selection at the start/end when document is empty', () => {
			const document = doc(p('{endPos}'))(defaultSchema);
			const wrapper = mountWithIntl(<ReactEditorView {...requiredProps()} />);
			const { editorState } = wrapper.instance() as ReactEditorView;
			const cursorPos = (editorState.selection as TextSelection).$cursor!.pos;
			expect(cursorPos).toEqual(document.refs.endPos);
			wrapper.unmount();
		});

		it('should place the initial selection near the end if a valid selection at the end does not exist', () => {
			// See ED-3507
			const mediaNode = media({ id: '1', type: 'file', collection: '2' });
			const document = doc(p('Start'), mediaGroup(mediaNode()))(defaultSchema);
			const mediaProvider = storyMediaProviderFactory();
			const wrapper = mountWithIntl(
				<ReactEditorView
					{...requiredProps()}
					editorProps={{
						defaultValue: toJSON(document),
						media: { provider: mediaProvider },
					}}
					providerFactory={ProviderFactory.create({ mediaProvider })}
				/>,
			);
			const { editorState } = wrapper.instance() as ReactEditorView;
			const selectionAtEndOfDocument = TextSelection.atEnd(editorState.doc);
			expect(editorState.selection.eq(selectionAtEndOfDocument)).toBe(false);
			expect(editorState.selection.toJSON()).toEqual({
				head: 6,
				anchor: 6,
				type: 'text',
			});
			wrapper.unmount();
		});

		it("should set `key` on the ProseMirror div node to aid React's reconciler", () => {
			const wrapper = mountWithIntl(<ReactEditorView {...requiredProps()} />);

			expect(wrapper.children().key()).toEqual('ProseMirror');
			wrapper.unmount();
		});

		it('should forward all events dispatched with analyticsEventKey to analytics plugin', () => {
			const wrapper = mountWithIntl(<ReactEditorView {...requiredProps()} {...analyticsProps()} />);

			(wrapper.instance() as ReactEditorView).eventDispatcher.emit(analyticsEventKey, { payload });
			expect(mockFire).toHaveBeenCalledWith({ payload });
		});

		it('should trigger editor started analytics event', () => {
			const wrapper = mountWithIntl(<ReactEditorView {...requiredProps()} {...analyticsProps()} />);

			expect(mockFire).toHaveBeenCalledWith({
				payload: expect.objectContaining({
					action: 'started',
					actionSubject: 'editor',
				}),
			});
			wrapper.unmount();
		});

		it('should set and update aria-label of editor ProseMirror div with passed assistiveLabel prop. ', () => {
			const label = 'Description field: Main content area, start typing to enter text.';

			const { rerender } = renderWithIntl(
				<ReactEditorView
					{...requiredProps()}
					{...analyticsProps()}
					editorProps={{
						assistiveLabel: label,
					}}
				/>,
			);

			expect(screen.getByLabelText(label)).toBeInTheDocument();

			const newLabel = 'Page comment editor';
			rerender(
				<ReactEditorView
					{...requiredProps()}
					{...analyticsProps()}
					editorProps={{
						assistiveLabel: newLabel,
					}}
				/>,
			);

			expect(screen.getByLabelText(newLabel)).toBeInTheDocument();
		});

		it('should not recreate editor if assistiveLabel prop is not changed between re-renders. ', () => {
			const label = 'Description field: Main content area, start typing to enter text.';

			const renderMock = jest.fn((editor) => <div />);
			const { rerender } = renderWithIntl(
				<ReactEditorView
					{...requiredProps()}
					{...analyticsProps()}
					editorProps={{
						assistiveLabel: label,
					}}
					render={renderMock}
				/>,
			);

			expect(renderMock).toHaveBeenCalledTimes(1);

			rerender(
				<ReactEditorView
					{...requiredProps()}
					{...analyticsProps()}
					onEditorCreated={() => {}}
					editorProps={{
						assistiveLabel: label,
					}}
					render={renderMock}
				/>,
			);

			const isNewEditorCreated =
				renderMock.mock.calls[0][0].editor !== renderMock.mock.calls[1][0].editor;

			expect(renderMock).toHaveBeenCalledTimes(2);
			expect(isNewEditorCreated).toEqual(false);
		});

		it('should render editor ProseMirror div with default aria-label.', () => {
			const { getByRole } = renderWithIntl(
				<ReactEditorView {...requiredProps()} {...analyticsProps()} />,
			);

			expect(
				getByRole('textbox', {
					name: editorMessages.editorAssistiveLabel.defaultMessage,
				}),
			).toBeInTheDocument();
		});

		it('should set and update aria-describedby of editor ProseMirror div with passed assistiveDescribedBy prop. ', () => {
			const associatedId = 'test-id';
			const dummyContent = 'This is a test span';
			const { rerender } = renderWithIntl(
				<>
					<ReactEditorView
						{...requiredProps()}
						{...analyticsProps()}
						editorProps={{
							assistiveDescribedBy: associatedId,
						}}
					/>
					<span id={associatedId}>{dummyContent}</span>
				</>,
			);

			expect(screen.getByRole('textbox', { description: dummyContent })).toBeInTheDocument();

			const newAssociatedId = 'new-test-id';
			const newDummyContent = 'This is a new test span';
			rerender(
				<>
					<ReactEditorView
						{...requiredProps()}
						{...analyticsProps()}
						editorProps={{
							assistiveDescribedBy: newAssociatedId,
						}}
					/>
					<span id={newAssociatedId}>{newDummyContent}</span>
				</>,
			);

			expect(screen.getByRole('textbox', { description: newDummyContent })).toBeInTheDocument();
		});

		describe('when a transaction is dispatched', () => {
			it('should not trigger a re-render', () => {
				const wrapper = mountWithIntl(<ReactEditorView {...requiredProps()} />);

				const editor = wrapper.instance() as ReactEditorView;
				patchEditorViewForJSDOM(editor.view);

				const renderSpy = jest.spyOn(editor, 'render');
				editor.view!.dispatch(editor.view!.state.tr);

				expect(renderSpy).toHaveBeenCalledTimes(0);
				wrapper.unmount();
			});

			it('should discard stale transactions after componentWillUnmount is triggered', () => {
				const unmountSpy = jest.spyOn(ReactEditorView.prototype, 'componentWillUnmount');
				const wrapper = mountWithIntl(<ReactEditorView {...requiredProps()} />);

				const editor = wrapper.instance() as ReactEditorView;
				patchEditorViewForJSDOM(editor.view);

				const expectedTransactionCount = 1;

				const dispatchTransactionSpy: jest.SpyInstance<ReactEditorView['dispatchTransaction']> =
					jest.spyOn(editor as any, 'dispatchTransaction');
				editor.view!.dispatch(editor.view!.state.tr);
				expect(dispatchTransactionSpy).toHaveBeenCalledTimes(expectedTransactionCount);

				// Manually invoke componentWillUnmount.
				// This won't actually unmount it, but it allows us to check the logic
				// peformed inside that lifecycle method, ahead of the actual unmounting,
				// which allows us to dispatch from our view reference before it gets wiped out.
				editor.componentWillUnmount();

				// Simulate dispatching a stale async transaction after a dismount is triggered.
				editor.view!.dispatch(editor.view!.state.tr);

				// Because we block transactions once a dismount is imminent the surplus transaction
				// should have been discarded and the count shouldn't have increased.
				expect(dispatchTransactionSpy).toHaveBeenCalledTimes(expectedTransactionCount);

				wrapper.unmount();
				expect(unmountSpy).toHaveBeenCalledTimes(2);
			});

			describe('valid analytics events with perf tracking and no sampling', () => {
				const performanceNowFixedTime = 100;
				let wrapper: ReactWrapper;

				const setupEditor = () => {
					let validTr;
					wrapper = mountWithIntl(
						<ReactEditorView
							{...requiredProps()}
							{...analyticsProps()}
							editorProps={{
								allowDate: true,
								...analyticsProps(),
								onChange: () => {}, // For testing onChange analytics
							}}
						/>,
					);
					let editor: any = wrapper.instance() as ReactEditorView;

					const dispatchValidTransaction = () => {
						const { tr } = editor.view.state;
						validTr = tr.insertText('hello');
						editor.view.dispatch(validTr);
					};
					const dispatchValidTransactionNthTimes = (times: number) => {
						for (let count = 0; count < times; count++) {
							dispatchValidTransaction();
						}
					};
					// @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
					//See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
					mockFire.mockClear();
					return {
						dispatchValidTransactionNthTimes,
					};
				};

				beforeEach(() => {
					jest.spyOn(window.performance, 'now').mockReturnValue(performanceNowFixedTime);
				});

				afterEach(() => {
					wrapper.unmount();
					jest.spyOn(window.performance, 'now').mockRestore();
				});

				it(`doesn't send onChange analytics event when performance object doesn't include onChangeCallbackTracking`, () => {
					const { dispatchValidTransactionNthTimes } = setupEditor();
					dispatchValidTransactionNthTimes(1);
					const onChangeEvents = (mockFire as jest.Mock).mock.calls.filter(
						(mockCall) => mockCall[0].payload.action === 'onChangeCalled',
					);
					expect(onChangeEvents.length).toBe(0);
				});

				it(`doesn't send onChange analytics event when TransactionTracking not enabled`, () => {
					const { dispatchValidTransactionNthTimes } = setupEditor();
					dispatchValidTransactionNthTimes(1);
					const onChangeEvents = (mockFire as jest.Mock).mock.calls.filter(
						(mockCall) => mockCall[0].payload.action === 'onChangeCalled',
					);
					expect(onChangeEvents.length).toBe(0);
				});

				it('sends onChange analytics event when enabled and TransactionTracking enabled', () => {
					const { dispatchValidTransactionNthTimes } = setupEditor();
					dispatchValidTransactionNthTimes(1);
					const onChangeEvents = (mockFire as jest.Mock).mock.calls.filter(
						(mockCall) => mockCall[0].payload.action === 'onChangeCalled',
					);
					expect(onChangeEvents.length).toBe(1);
					expect(onChangeEvents[0]).toEqual([
						{
							payload: {
								action: 'onChangeCalled',
								actionSubject: 'editor',
								eventType: 'operational',
								attributes: {
									duration: 0,
									startTime: 100,
								},
							},
						},
					]);
				});
			});
		});

		describe('when an invalid transaction is dispatched', () => {
			function createInvalidCodeBlock() {
				return 'codebl(date())';
			}

			/** dispatches an invalid transaction which adds a code block with a date node child */
			const dispatchInvalidTransaction = (tr = editor.view.state.tr) => {
				const { date, codeBlock } = editor.view.state.schema.nodes;
				invalidTr = tr.replaceRangeWith(1, 1, codeBlock.create({}, date.create()));
				editor.view.dispatch(invalidTr);
			};

			let wrapper: ReactWrapper;
			let editor: any;
			let invalidTr;
			let editorAPI: PublicPluginAPI<[AnalyticsPlugin]>;

			const setupEditor = (additionalProps: EditorProps = {}) => {
				const editorProps = {
					allowDate: true,
					...analyticsProps(),
					...additionalProps,
				};
				wrapper = mountWithIntl(
					<ReactEditorView
						{...requiredProps()}
						{...analyticsProps()}
						setEditorAPI={(api) => (editorAPI = api as PublicPluginAPI<[AnalyticsPlugin]>)}
						editorProps={editorProps}
						preset={createUniversalPreset({ props: editorProps })}
						render={({ editor, view, config: { pluginHooks } }) => {
							return (
								<>
									{editor}
									{/* @ts-ignore We just need the hooks to render for analytics */}
									<PluginSlot editorView={view} pluginHooks={pluginHooks} />
								</>
							);
						}}
					/>,
				);
				editor = wrapper.instance() as ReactEditorView;
			};

			it('should not throw error', () => {
				setupEditor();
				expect(() => dispatchInvalidTransaction()).not.toThrowError();
			});

			it('sends V3 analytics event with info on failed transaction', () => {
				setupEditor();
				const analyticsEventPayload: AnalyticsEventPayload = {
					action: ACTION.CLICKED,
					actionSubject: ACTION_SUBJECT.BUTTON,
					actionSubjectId: ACTION_SUBJECT_ID.BUTTON_HELP,
					attributes: { inputMethod: INPUT_METHOD.SHORTCUT },
					eventType: EVENT_TYPE.UI,
				};

				const tr = editor.view.state.tr;

				editorAPI?.analytics?.actions?.attachAnalyticsEvent(analyticsEventPayload)(tr);

				// @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
				//See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
				mockFire.mockClear();
				dispatchInvalidTransaction(
					// add v3 analytics meta to transaction as we want to check this info is sent on
					tr,
				);
				expect(mockFire).toHaveBeenCalledWith({
					payload: {
						action: 'dispatchedInvalidTransaction',
						actionSubject: 'editor',
						eventType: 'operational',
						attributes: {
							analyticsEventPayloads: [
								{
									channel: editorAnalyticsChannel,
									payload: analyticsEventPayload,
								},
							],
							invalidNodes: [createInvalidCodeBlock()],
						},
					},
				});
			});

			it('does not send V3 analytics event if transaction tracking is explicitly disabled on performanceTracking flag', () => {
				setupEditor();
				const analyticsEventPayload: AnalyticsEventPayload = {
					action: ACTION.CLICKED,
					actionSubject: ACTION_SUBJECT.BUTTON,
					actionSubjectId: ACTION_SUBJECT_ID.BUTTON_HELP,
					attributes: { inputMethod: INPUT_METHOD.SHORTCUT },
					eventType: EVENT_TYPE.UI,
				};

				const tr = editor.view.state.tr;

				editorAPI?.analytics?.actions?.attachAnalyticsEvent(analyticsEventPayload)(tr);

				// @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
				//See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
				mockFire.mockClear();
				dispatchInvalidTransaction(
					// add v3 analytics meta to transaction as we want to check this info is sent on
					tr,
				);
				expect(mockFire).toHaveBeenCalledTimes(0);
			});

			it('does not apply the transaction', () => {
				setupEditor();
				const originalState = editor.editorState;
				dispatchInvalidTransaction();
				expect(editor.editorState).toEqual(originalState);
			});
		});

		it('should call onEditorCreated once the editor is initialised', () => {
			let handleEditorCreated = jest.fn();
			let wrapper = mountWithIntl(
				<ReactEditorView
					{...requiredProps()}
					editorProps={{ appearance: 'comment' }}
					onEditorCreated={handleEditorCreated}
				/>,
			);

			expect(handleEditorCreated).toHaveBeenCalledTimes(1);
			expect(handleEditorCreated).toHaveBeenCalledWith({
				view: expect.any(EditorView),
				eventDispatcher: expect.any(EventDispatcher),
				config: {
					contentComponents: expect.anything(),
					pluginHooks: expect.anything(),
					marks: expect.anything(),
					nodes: expect.anything(),
					pmPlugins: expect.anything(),
					primaryToolbarComponents: expect.anything(),
					secondaryToolbarComponents: expect.anything(),
					onEditorViewStateUpdatedCallbacks: expect.anything(),
				},
			});
			wrapper.unmount();
		});

		it('should call onEditorDestroyed when the editor is unmounting', () => {
			let handleEditorDestroyed = jest.fn();
			const wrapper = mountWithIntl(
				<ReactEditorView
					{...requiredProps()}
					editorProps={{ appearance: 'comment' }}
					onEditorDestroyed={handleEditorDestroyed}
				/>,
			);
			wrapper.unmount();

			expect(handleEditorDestroyed).toHaveBeenCalledTimes(1);
			expect(handleEditorDestroyed).toHaveBeenCalledWith({
				view: expect.any(EditorView),
				eventDispatcher: expect.any(EventDispatcher),
				config: {
					contentComponents: expect.anything(),
					pluginHooks: expect.anything(),
					marks: expect.anything(),
					nodes: expect.anything(),
					pmPlugins: expect.anything(),
					primaryToolbarComponents: expect.anything(),
					secondaryToolbarComponents: expect.anything(),
					onEditorViewStateUpdatedCallbacks: expect.anything(),
				},
			});
		});

		it('should call destroy() on EventDispatcher when it gets unmounted', () => {
			let eventDispatcherDestroySpy;
			const wrapper = mountWithIntl(
				<ReactEditorView
					{...requiredProps()}
					onEditorCreated={({ eventDispatcher }) => {
						eventDispatcherDestroySpy = jest.spyOn(eventDispatcher, 'destroy');
					}}
				/>,
			);
			wrapper.unmount();
			expect(eventDispatcherDestroySpy).toHaveBeenCalledTimes(1);
		});

		it('should disable grammarly in the editor', () => {
			const wrapper = mountWithIntl(<ReactEditorView {...requiredProps()} />);
			const editorDOM = (wrapper.instance() as ReactEditorView).view!.dom;
			expect(editorDOM.getAttribute('data-gramm')).toBe('false');
			wrapper.unmount();
		});

		describe('when re-creating the editor view after a props change', () => {
			it('should call onEditorDestroyed', () => {
				let handleEditorDestroyed = jest.fn();
				const wrapper = mount(
					<ReactEditorView
						{...requiredProps()}
						editorProps={{ appearance: 'comment' }}
						onEditorDestroyed={handleEditorDestroyed}
					/>,
				);

				// Force a re-mount of the editor-view by changing the React tree
				wrapper.setProps({
					render: ({ editor }: { editor: React.ReactChild }) => <div>{editor}</div>,
				});

				expect(handleEditorDestroyed).toHaveBeenCalledTimes(1);
				expect(handleEditorDestroyed).toHaveBeenCalledWith({
					view: expect.any(EditorView),
					eventDispatcher: expect.any(EventDispatcher),
					config: {
						contentComponents: expect.anything(),
						pluginHooks: expect.anything(),
						marks: expect.anything(),
						nodes: expect.anything(),
						pmPlugins: expect.anything(),
						primaryToolbarComponents: expect.anything(),
						secondaryToolbarComponents: expect.anything(),
						onEditorViewStateUpdatedCallbacks: expect.anything(),
					},
				});
			});

			it('should call destroy on the old EditorView', () => {
				let editorViewDestroy: jest.SpyInstance | undefined;
				const wrapper = mount(
					<ReactEditorView
						{...requiredProps()}
						onEditorCreated={({ view }) => {
							// So we don't accidently re-set this when we create the new editor view
							if (!editorViewDestroy) {
								editorViewDestroy = jest.spyOn(view, 'destroy');
							}
						}}
					/>,
				);

				// Force a re-mount of the editor-view by changing the React tree
				wrapper.setProps({
					render: ({ editor }: { editor: React.ReactChild }) => <div>{editor}</div>,
				});

				expect(editorViewDestroy).toHaveBeenCalled();
			});

			it('should call onEditorCreated with the new EditorView', () => {
				let oldEditorView;
				let newEditorView;
				const wrapper = mountWithIntl(
					<ReactEditorView
						{...requiredProps()}
						onEditorCreated={({ view }) => {
							newEditorView = view;
						}}
						onEditorDestroyed={({ view }) => {
							oldEditorView = view;
						}}
					/>,
				);

				// Force a re-mount of the editor-view by changing the React tree
				wrapper.setProps({
					render: ({ editor }: { editor: React.ReactChild }) => <div>{editor}</div>,
				});

				expect(newEditorView).toBeInstanceOf(EditorView);
				expect(oldEditorView).not.toBe(newEditorView);
			});

			it('should not re-create the event dispatcher', () => {
				let oldEventDispatcher: EventDispatcher | undefined;
				let eventDispatcherDestroySpy;
				const wrapper = mountWithIntl(
					<ReactEditorView
						{...requiredProps()}
						onEditorCreated={({ eventDispatcher }) => {
							// So we don't accidently re-set this when we create the new editor view
							if (!oldEventDispatcher) {
								oldEventDispatcher = eventDispatcher;
								eventDispatcherDestroySpy = jest.spyOn(eventDispatcher, 'destroy');
							}
						}}
					/>,
				);

				// Force a re-mount of the editor-view by changing the React tree
				wrapper.setProps({
					render: ({ editor }: { editor: React.ReactChild }) => <div>{editor}</div>,
				});

				expect(oldEventDispatcher).toBe((wrapper.instance() as ReactEditorView).eventDispatcher);
				expect(eventDispatcherDestroySpy).not.toHaveBeenCalled();
			});
		});

		describe('when appearance changes to full width', () => {
			const initFullWidthEditor = (appearance: EditorAppearance) =>
				mount(
					<ReactEditorView
						{...requiredProps()}
						{...analyticsProps()}
						editorProps={{ appearance }}
					/>,
				);

			it('fires analytics event when entering full-width mode', () => {
				const wrapper = initFullWidthEditor('full-page');
				wrapper.setProps({ editorProps: { appearance: 'full-width' } });

				expect(mockFire).toHaveBeenCalledWith({
					payload: {
						action: 'changedFullWidthMode',
						actionSubject: 'editor',
						attributes: {
							previousMode: 'fixedWidth',
							newMode: 'fullWidth',
						},
						eventType: 'track',
					},
				});
			});

			it('fires analytics event when leaving full-width mode', () => {
				const wrapper = initFullWidthEditor('full-width');
				wrapper.setProps({ editorProps: { appearance: 'full-page' } });

				expect(mockFire).toHaveBeenCalledWith({
					payload: {
						action: 'changedFullWidthMode',
						actionSubject: 'editor',
						attributes: {
							previousMode: 'fullWidth',
							newMode: 'fixedWidth',
						},
						eventType: 'track',
					},
				});
			});
		});

		it('should disable analytics event forwarding on unmount', () => {
			const wrapper = mountWithIntl(<ReactEditorView {...requiredProps()} {...analyticsProps()} />);
			const { eventDispatcher } = wrapper.instance() as ReactEditorView;
			jest.spyOn(eventDispatcher, 'off');

			wrapper.unmount();
			expect(eventDispatcher.off).toHaveBeenCalled();
		});

		describe('dispatch analytics event', () => {
			function setupDispatchAnalyticsTest(allowAnalyticsGASV3: boolean) {
				let dispatch: undefined | DispatchAnalyticsEvent;
				const wrapper = mountWithIntl(
					<ReactEditorView
						{...requiredProps()}
						{...analyticsProps()}
						allowAnalyticsGASV3={allowAnalyticsGASV3}
						render={({ dispatchAnalyticsEvent }) => {
							dispatch = dispatchAnalyticsEvent;
							return <p>Component</p>;
						}}
					/>,
				);
				const { eventDispatcher } = wrapper.instance() as ReactEditorView;
				jest.spyOn(eventDispatcher, 'emit');

				return {
					dispatch: dispatch!,
					eventDispatcher,
				};
			}

			it('should call event dispatcher if it is allowed to call analytics', () => {
				const { dispatch, eventDispatcher } = setupDispatchAnalyticsTest(true);

				dispatch(payload);
				expect(eventDispatcher.emit).toHaveBeenCalledWith(analyticsEventKey, {
					payload,
				});
			});
		});
	});

	describe('sanitize private content', () => {
		const document = doc(p('hello', mention({ id: '1', text: '@cheese' })(), '{endPos}'))(
			defaultSchema,
		);

		const mentionProvider: Promise<MentionProvider> = Promise.resolve(mentionResourceProvider);

		it('mentions should be sanitized when sanitizePrivateContent true', () => {
			const editorProps = {
				defaultValue: toJSON(document),
				mentionProvider,
				sanitizePrivateContent: true,
			};
			const wrapper = mountWithIntl(
				<ReactEditorView
					{...requiredProps()}
					editorProps={editorProps}
					preset={createUniversalPreset({ props: editorProps })}
					providerFactory={ProviderFactory.create({ mentionProvider })}
				/>,
			);
			const { editorState } = wrapper.instance() as ReactEditorView;
			// Expect document changed with mention text attr empty
			expect(editorState.doc.toJSON()).toEqual(
				doc(p('hello', mention({ id: '1' })(), '{endPos}'))(defaultSchema).toJSON(),
			);

			wrapper.unmount();
		});

		it('mentions should not be sanitized when sanitizePrivateContent false', () => {
			const editorProps = {
				defaultValue: toJSON(document),
				sanitizePrivateContent: false,
				mentionProvider,
			};
			const wrapper = mountWithIntl(
				<ReactEditorView
					{...requiredProps()}
					editorProps={editorProps}
					preset={createUniversalPreset({ props: editorProps })}
					providerFactory={ProviderFactory.create({ mentionProvider })}
				/>,
			);
			const { editorState } = wrapper.instance() as ReactEditorView;
			// Expect document unchanged
			expect(editorState.doc.toJSON()).toEqual(document.toJSON());

			wrapper.unmount();
		});

		it('mentions should not be sanitized when no collabEdit options', () => {
			const editorProps = {
				defaultValue: toJSON(document),
				mentionProvider,
			};
			const wrapper = mountWithIntl(
				<ReactEditorView
					{...requiredProps()}
					editorProps={editorProps}
					preset={createUniversalPreset({ props: editorProps })}
					providerFactory={ProviderFactory.create({ mentionProvider })}
				/>,
			);
			const { editorState } = wrapper.instance() as ReactEditorView;
			// Expect document unchanged
			expect(editorState.doc.toJSON()).toEqual(document.toJSON());

			wrapper.unmount();
		});
	});

	describe('onEditorViewStateUpdated', () => {
		describe('when EditorView dispatch is called', () => {
			it('should call onEditorViewStateUpdated from editor configuration', () => {
				const document = doc(p('hello{endPos}'))(defaultSchema);
				const mock = jest.fn();
				const onEditorCreated = ({ view, config }: Props) => {
					config.onEditorViewStateUpdatedCallbacks.push({
						pluginName: 'mock',
						callback: mock,
					});

					const { tr } = view!.state;
					tr.setMeta('lol', 'lol');
					view!.dispatch(tr);
				};
				const wrapper = mountWithIntl(
					<ReactEditorView
						{...requiredProps()}
						onEditorCreated={onEditorCreated}
						editorProps={{ defaultValue: toJSON(document) }}
					/>,
				);
				wrapper.unmount();

				expect(mock).toHaveBeenCalled();
			});
		});
	});

	describe('Remote onChange', () => {
		const document = doc(p('hello{endPos}'))(defaultSchema);
		let onChange = jest.fn();

		beforeEach(() => {
			onChange = jest.fn();
		});

		describe('when transaction is local', () => {
			it('should be called with source local', () => {
				const onEditorCreated = ({ view, config }: Props) => {
					const { tr } = view!.state;
					tr.insertText('a', 2);
					view!.dispatch(tr);
				};
				const wrapper = mountWithIntl(
					<ReactEditorView
						{...requiredProps()}
						onEditorCreated={onEditorCreated}
						editorProps={{ defaultValue: toJSON(document), onChange }}
					/>,
				);
				wrapper.unmount();

				expect(onChange).toHaveBeenCalledTimes(1);
				expect(onChange).toHaveBeenCalledWith(expect.anything(), {
					source: 'local',
				});
			});
		});
		describe('when transaction is remote', () => {
			it('should be called with source remote', () => {
				const onEditorCreated = ({ view, config }: Props) => {
					const { tr } = view!.state;
					tr.setMeta('isRemote', 'true');
					tr.insertText('a', 2);
					view!.dispatch(tr);
				};

				const wrapper = mountWithIntl(
					<ReactEditorView
						{...requiredProps()}
						onEditorCreated={onEditorCreated}
						editorProps={{ defaultValue: toJSON(document), onChange }}
					/>,
				);
				wrapper.unmount();

				expect(onChange).toHaveBeenCalledTimes(1);
				expect(onChange).toHaveBeenCalledWith(expect.anything(), {
					source: 'remote',
				});
			});
		});

		describe('when transaction does not change the document', () => {
			it('should not be called', () => {
				const onEditorCreated = ({ view, config }: Props) => {
					const { tr } = view!.state;
					tr.setMeta('isRemote', 'true');
					view!.dispatch(tr);
				};

				const editorProps = { defaultValue: toJSON(document), onChange };
				const wrapper = mountWithIntl(
					<ReactEditorView
						{...requiredProps()}
						onEditorCreated={onEditorCreated}
						preset={createUniversalPreset({ props: editorProps })}
						editorProps={editorProps}
					/>,
				);
				wrapper.unmount();

				expect(onChange).not.toHaveBeenCalled();
			});
		});
	});

	describe('proseMirrorRenderedSeverity', () => {
		it.each`
			condition                                                                         | threshold                                               | severity
			${'when duration <= NORMAL_SEVERITY_THRESHOLD'}                                   | ${PROSEMIRROR_RENDERED_NORMAL_SEVERITY_THRESHOLD}       | ${SEVERITY.NORMAL}
			${'when duration > NORMAL_SEVERITY_THRESHOLD and <= DEGRADED_SEVERITY_THRESHOLD'} | ${PROSEMIRROR_RENDERED_NORMAL_SEVERITY_THRESHOLD + 1}   | ${SEVERITY.DEGRADED}
			${'when duration > DEGRADED_SEVERITY_THRESHOLD'}                                  | ${PROSEMIRROR_RENDERED_DEGRADED_SEVERITY_THRESHOLD + 1} | ${SEVERITY.BLOCKING}
		`('should set $severity to severity when $condition', ({ condition, threshold, severity }) => {
			(measureRender as any).mockImplementationOnce((name: any, callback: any) => {
				callback && callback({ duration: threshold, startTime: 1 });
			});

			const editorProps = {};

			const wrapper = mountWithIntl(
				<ReactEditorView
					{...requiredProps()}
					{...analyticsProps()}
					allowAnalyticsGASV3={true}
					preset={createUniversalPreset({ props: editorProps })}
					editorProps={editorProps}
				/>,
			);

			expect((wrapper.instance() as ReactEditorView).proseMirrorRenderedSeverity).toBe(severity);
		});
	});

	describe('resetEditorState', () => {
		it('should call createEditorState', () => {
			const wrapper = mountWithIntl(<ReactEditorView {...requiredProps()} />);

			const instance = wrapper.instance() as ReactEditorView;
			const mock = jest.spyOn(instance, 'createEditorState');

			instance.resetEditorState({ doc: '', shouldScrollToBottom: false });

			expect(mock).toHaveBeenCalled();
		});

		it('should not create a new schema when resetting editorState', () => {
			const wrapper = mountWithIntl(<ReactEditorView {...requiredProps()} />);
			const instance = wrapper.instance() as ReactEditorView;
			const schema = instance.view?.state.schema;
			expect(schema).not.toBeNull();
			instance.resetEditorState({ doc: '', shouldScrollToBottom: false });

			expect(schema === instance.view?.state.schema).toBeTruthy();
		});
	});

	ffTest.on('platform_editor_disable_rerender_tracking_jira', 'rerenders', () => {
		it('should not fire re-render tracking events when enabled', () => {
			const { rerender } = renderWithIntl(
				<ReactEditorView {...requiredProps()} {...analyticsProps()} />,
			);
			// @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
			//See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
			mockFire.mockClear();
			rerender(<ReactEditorView {...requiredProps()} {...analyticsProps()} />);
			expect(mockFire).not.toHaveBeenCalled();
		});
	});

	ffTest.off('platform_editor_disable_rerender_tracking_jira', 'rerenders', () => {
		it('should fire re-render tracking events when disabled', () => {
			const { rerender } = renderWithIntl(
				<ReactEditorView {...requiredProps()} {...analyticsProps()} />,
			);
			// @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
			//See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
			mockFire.mockClear();
			rerender(<ReactEditorView {...requiredProps()} {...analyticsProps()} />);
			expect(mockFire).toHaveBeenCalledWith({
				payload: expect.objectContaining({
					action: 'reRendered',
					actionSubject: 'reactEditorView',
				}),
			});
		});
	});

	ffTest.on(
		'editor_load_conf_collab_docs_without_checks',
		'calling processRawValue in createEditorState',
		() => {
			it('When setup without the collab plugin -- should call processRawValue', () => {
				// call feature gate to avoid the ffTest failing
				fg('editor_load_conf_collab_docs_without_checks');
				const mockDocument = doc(p('example doc'))(defaultSchema).toJSON();
				const processRawValueSpy = jest.spyOn(ProcessRawValueModule, 'processRawValue');
				const { editorView } = createEditorFactory()({
					editorProps: {
						defaultValue: mockDocument,
					},
				});

				expect(processRawValueSpy).toHaveBeenCalledTimes(1);

				expect(editorView.state.doc.toJSON()).toEqual({
					...mockDocument,
					version: undefined,
				});
			});

			it('When setup with the collab plugin -- should not call processRawValue', () => {
				const mockDocument = doc(p('example doc'))(defaultSchema).toJSON();
				const processRawValueSpy = jest.spyOn(ProcessRawValueModule, 'processRawValue');
				const processRawValueWithoutValidationSpy = jest.spyOn(
					ProcessRawValueModule,
					'processRawValueWithoutValidation',
				);

				const { editorView } = createEditorFactory()({
					editorProps: {
						defaultValue: mockDocument,
						collabEdit: {},
					},
				});

				expect(processRawValueSpy).not.toHaveBeenCalled();
				expect(processRawValueWithoutValidationSpy).toHaveBeenCalledTimes(1);

				expect(editorView.state.doc.toJSON()).toEqual({
					...mockDocument,
					version: undefined,
				});
			});

			it('When setup with the collab plugin -- with string document', () => {
				const mockDocument =
					'{"type":"doc","content":[{"type":"blockquote","content":[{"type":"codeBlock","attrs":{"language":null,"uniqueId":null}}]}]}';
				const processRawValueSpy = jest.spyOn(ProcessRawValueModule, 'processRawValue');
				const processRawValueWithoutValidationSpy = jest.spyOn(
					ProcessRawValueModule,
					'processRawValueWithoutValidation',
				);

				const { editorView } = createEditorFactory()({
					editorProps: {
						defaultValue: mockDocument,
						collabEdit: {},
					},
				});

				expect(processRawValueSpy).not.toHaveBeenCalled();
				expect(processRawValueWithoutValidationSpy).toHaveBeenCalledTimes(1);

				expect(editorView.state.doc.toJSON()).toEqual(
					doc(blockquote(code_block()()))(defaultSchema).toJSON(),
				);
			});
		},
	);

	ffTest.off(
		'editor_load_conf_collab_docs_without_checks',
		'calling processRawValue in createEditorState',
		() => {
			it('When setup without the collab plugin -- should call processRawValue', () => {
				// call feature gate to avoid the ffTest failing
				fg('editor_load_conf_collab_docs_without_checks');
				const mockDocument = doc(p('example doc'))(defaultSchema).toJSON();
				const processRawValueSpy = jest.spyOn(ProcessRawValueModule, 'processRawValue');

				const { editorView } = createEditorFactory()({
					editorProps: {
						defaultValue: mockDocument,
					},
				});

				expect(processRawValueSpy).toHaveBeenCalledTimes(1);

				expect(editorView.state.doc.toJSON()).toEqual({
					...mockDocument,
					version: undefined,
				});
			});

			it('When setup with the collab plugin -- should call processRawValue', () => {
				const mockDocument = doc(p('example doc'))(defaultSchema).toJSON();
				const processRawValueSpy = jest.spyOn(ProcessRawValueModule, 'processRawValue');
				const processRawValueWithoutValidationSpy = jest.spyOn(
					ProcessRawValueModule,
					'processRawValueWithoutValidation',
				);

				const { editorView } = createEditorFactory()({
					editorProps: {
						defaultValue: mockDocument,
						collabEdit: {},
					},
				});

				expect(processRawValueSpy).toHaveBeenCalledTimes(1);
				expect(processRawValueWithoutValidationSpy).not.toHaveBeenCalled();

				expect(editorView.state.doc.toJSON()).toEqual({
					...mockDocument,
					version: undefined,
				});
			});

			ffTest.on('platform_editor_nest_in_quotes_adf_change', '', () => {
				it('When setup with the collab plugin -- with string document', () => {
					const mockDocument =
						'{"type":"doc","content":[{"type":"blockquote","content":[{"type":"codeBlock","attrs":{"language":null,"uniqueId":null}}]}]}';
					const processRawValueSpy = jest.spyOn(ProcessRawValueModule, 'processRawValue');
					const processRawValueWithoutValidationSpy = jest.spyOn(
						ProcessRawValueModule,
						'processRawValueWithoutValidation',
					);

					const { editorView } = createEditorFactory()({
						editorProps: {
							defaultValue: mockDocument,
							collabEdit: {},
						},
					});

					expect(processRawValueSpy).toHaveBeenCalledTimes(1);
					expect(processRawValueWithoutValidationSpy).not.toHaveBeenCalled();

					expect(editorView.state.doc.toJSON()).toEqual(
						doc(blockquote(code_block()()))(defaultSchema).toJSON(),
					);
				});
			});
		},
	);
});
