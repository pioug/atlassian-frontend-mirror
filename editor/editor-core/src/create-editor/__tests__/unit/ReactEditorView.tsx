const mockStopMeasureDuration = 1234;
jest.mock('@atlaskit/editor-common', () => ({
  ...jest.requireActual<Object>('@atlaskit/editor-common'),
  startMeasure: jest.fn(),
  measureRender: jest.fn(),
  stopMeasure: jest.fn(
    (
      measureName: string,
      onMeasureComplete?: (duration: number, startTime: number) => void,
    ) => {
      onMeasureComplete && onMeasureComplete(mockStopMeasureDuration, 1);
    },
  ),
  isPerformanceAPIAvailable: jest.fn(() => true),
}));

import React from 'react';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { EditorView } from 'prosemirror-view';
import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import {
  measureRender,
  ProviderFactory,
  SEVERITY,
} from '@atlaskit/editor-common';
import { toJSON } from '../../../utils';
import ReactEditorView, { shouldReconfigureState } from '../../ReactEditorView';
import { EditorConfig } from '../../../types/editor-config';
import { ReactWrapper, shallow } from 'enzyme';
import { TextSelection } from 'prosemirror-state';
import createAnalyticsEventMock from '@atlaskit/editor-test-helpers/create-analytics-event-mock';
import patchEditorViewForJSDOM from '@atlaskit/editor-test-helpers/jsdom-fixtures';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';
import {
  media,
  mediaGroup,
  mention,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { mentionResourceProvider } from '@atlaskit/util-data-test/mention-story-data';
import { MentionProvider } from '@atlaskit/mention/resource';
import { EventDispatcher } from '../../../event-dispatcher';

import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  addAnalytics,
  AnalyticsEventPayload,
  DispatchAnalyticsEvent,
  EVENT_TYPE,
  INPUT_METHOD,
} from '../../../plugins/analytics';
import { EditorAppearance, EditorProps } from '../../../types';
import {
  analyticsEventKey,
  editorAnalyticsChannel,
} from '../../../plugins/analytics/consts';
import {
  PROSEMIRROR_RENDERED_NORMAL_SEVERITY_THRESHOLD,
  PROSEMIRROR_RENDERED_DEGRADED_SEVERITY_THRESHOLD,
} from '../../consts';

import * as FireAnalyticsEvent from '../../../plugins/analytics/fire-analytics-event';

const portalProviderAPI: any = {
  render() {},
  remove() {},
};

const requiredProps = () => ({
  providerFactory: ProviderFactory.create({}),
  portalProviderAPI,
  onEditorCreated: () => {},
  onEditorDestroyed: () => {},
  editorProps: {},
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
  let mockFire: ReturnType<typeof FireAnalyticsEvent.fireAnalyticsEvent>;

  beforeEach(() => {
    mockFire = jest.fn();
    jest
      .spyOn(FireAnalyticsEvent, 'fireAnalyticsEvent')
      .mockReturnValue(mockFire);
  });

  afterEach(() => {
    (FireAnalyticsEvent.fireAnalyticsEvent as jest.Mock).mockRestore();
  });

  describe('<ReactEditorView />', () => {
    it('should place the initial selection at the end of the document', () => {
      const document = doc(p('hello{endPos}'))(defaultSchema);
      const wrapper = shallow(
        <ReactEditorView
          {...requiredProps()}
          editorProps={{ defaultValue: toJSON(document) }}
        />,
      );
      const { editorState } = wrapper.instance() as ReactEditorView;
      const cursorPos = (editorState.selection as TextSelection).$cursor!.pos;
      expect(cursorPos).toEqual(document.refs.endPos);
      wrapper.unmount();
    });

    it('should place the initial selection at the start of the document when in full-page appearance', () => {
      const document = doc(p('{startPos}hello'))(defaultSchema);
      const wrapper = shallow(
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
      const wrapper = shallow(<ReactEditorView {...requiredProps()} />);
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
      const wrapper = mountWithIntl(
        <ReactEditorView {...requiredProps()} {...analyticsProps()} />,
      );

      (wrapper.instance() as ReactEditorView).eventDispatcher.emit(
        analyticsEventKey,
        { payload },
      );
      expect(mockFire).toHaveBeenCalledWith({ payload });
    });

    it('should trigger editor started analytics event', () => {
      const wrapper = mountWithIntl(
        <ReactEditorView {...requiredProps()} {...analyticsProps()} />,
      );

      expect(mockFire).toHaveBeenCalledWith({
        payload: expect.objectContaining({
          action: 'started',
          actionSubject: 'editor',
        }),
      });
      wrapper.unmount();
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
        const unmountSpy = jest.spyOn(
          ReactEditorView.prototype,
          'componentWillUnmount',
        );
        const wrapper = mountWithIntl(<ReactEditorView {...requiredProps()} />);

        const editor = wrapper.instance() as ReactEditorView;
        patchEditorViewForJSDOM(editor.view);

        const expectedTransactionCount = 1;

        const dispatchTransactionSpy: jest.SpyInstance<
          ReactEditorView['dispatchTransaction']
        > = jest.spyOn(editor as any, 'dispatchTransaction');
        editor.view!.dispatch(editor.view!.state.tr);
        expect(dispatchTransactionSpy).toHaveBeenCalledTimes(
          expectedTransactionCount,
        );

        // Manually invoke componentWillUnmount.
        // This won't actually unmount it, but it allows us to check the logic
        // peformed inside that lifecycle method, ahead of the actual unmounting,
        // which allows us to dispatch from our view reference before it gets wiped out.
        editor.componentWillUnmount();

        // Simulate dispatching a stale async transaction after a dismount is triggered.
        editor.view!.dispatch(editor.view!.state.tr);

        // Because we block transactions once a dismount is imminent the surplus transaction
        // should have been discarded and the count shouldn't have increased.
        expect(dispatchTransactionSpy).toHaveBeenCalledTimes(
          expectedTransactionCount,
        );

        wrapper.unmount();
        expect(unmountSpy).toHaveBeenCalledTimes(2);
      });

      describe('valid analytics events with perf tracking and no sampling', () => {
        const performanceNowFixedTime = 100;
        let wrapper: ReactWrapper;

        const setupEditor = (
          performanceTracking?: EditorProps['performanceTracking'],
        ) => {
          let validTr;
          wrapper = mountWithIntl(
            <ReactEditorView
              {...requiredProps()}
              {...analyticsProps()}
              editorProps={{
                allowDate: true,
                ...analyticsProps(),
                performanceTracking,
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
          jest
            .spyOn(window.performance, 'now')
            .mockReturnValue(performanceNowFixedTime);
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
          const { dispatchValidTransactionNthTimes } = setupEditor({
            onChangeCallbackTracking: { enabled: true },
          });
          dispatchValidTransactionNthTimes(1);
          const onChangeEvents = (mockFire as jest.Mock).mock.calls.filter(
            (mockCall) => mockCall[0].payload.action === 'onChangeCalled',
          );
          expect(onChangeEvents.length).toBe(0);
        });

        it('sends onChange analytics event when enabled and TransactionTracking enabled', () => {
          const { dispatchValidTransactionNthTimes } = setupEditor({
            transactionTracking: { enabled: true, samplingRate: 1 },
            onChangeCallbackTracking: { enabled: true },
          });
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

      describe('valid transaction analytic events (with sampling)', () => {
        let wrapper: ReactWrapper;
        const setupEditor = (
          trackValidTransactions: EditorProps['trackValidTransactions'],
        ) => {
          let validTr;
          wrapper = mountWithIntl(
            <ReactEditorView
              {...requiredProps()}
              {...analyticsProps()}
              editorProps={{
                allowDate: true,
                ...analyticsProps(),
                ...(trackValidTransactions && { trackValidTransactions }),
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
        const expectedTransactionEvent = {
          payload: {
            action: 'dispatchedValidTransaction',
            actionSubject: 'editor',
            eventType: 'operational',
          },
        };

        afterEach(() => {
          wrapper.unmount();
        });

        it('sends V3 analytics event on valid transactions at the custom samplingRate', () => {
          const trackValidTransactions = { samplingRate: 3 };
          const { dispatchValidTransactionNthTimes } = setupEditor(
            trackValidTransactions,
          );
          dispatchValidTransactionNthTimes(10);
          expect(mockFire).toHaveBeenCalledTimes(3);
          const expectedDispatchedEvents = new Array(3).fill([
            expectedTransactionEvent,
          ]);
          expect((mockFire as jest.Mock).mock.calls).toEqual(
            expectedDispatchedEvents,
          );
        });
        it('sends V3 analytics event on valid transactions at the default samplingRate if custom samplingRate is not defined', () => {
          const trackValidTransactions = true;
          const { dispatchValidTransactionNthTimes } = setupEditor(
            trackValidTransactions,
          );
          dispatchValidTransactionNthTimes(120);
          expect(mockFire).toHaveBeenCalledTimes(1);
          const expectedDispatchedEvents = new Array(1).fill([
            expectedTransactionEvent,
          ]);
          expect((mockFire as jest.Mock).mock.calls).toEqual(
            expectedDispatchedEvents,
          );
        });
        it('does not send V3 analytics event on valid transactions if trackValidTransactions editorProp is not set', () => {
          const trackValidTransactions = undefined;
          const { dispatchValidTransactionNthTimes } = setupEditor(
            trackValidTransactions,
          );
          dispatchValidTransactionNthTimes(120);
          expect(mockFire).toHaveBeenCalledTimes(0);
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
        invalidTr = tr.replaceRangeWith(
          1,
          1,
          codeBlock.create({}, date.create()),
        );
        editor.view.dispatch(invalidTr);
      };

      let wrapper: ReactWrapper;
      let editor: any;
      let invalidTr;

      beforeEach(() => {
        wrapper = mountWithIntl(
          <ReactEditorView
            {...requiredProps()}
            {...analyticsProps()}
            editorProps={{
              allowDate: true,
              ...analyticsProps(),
            }}
          />,
        );
        editor = wrapper.instance() as ReactEditorView;
      });

      it('should not throw error', () => {
        expect(() => dispatchInvalidTransaction()).not.toThrowError();
      });

      it('sends V3 analytics event with info on failed transaction', () => {
        const analyticsEventPayload: AnalyticsEventPayload = {
          action: ACTION.CLICKED,
          actionSubject: ACTION_SUBJECT.BUTTON,
          actionSubjectId: ACTION_SUBJECT_ID.BUTTON_HELP,
          attributes: { inputMethod: INPUT_METHOD.SHORTCUT },
          eventType: EVENT_TYPE.UI,
        };

        // @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
        //See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
        mockFire.mockClear();
        dispatchInvalidTransaction(
          // add v3 analytics meta to transaction as we want to check this info is sent on
          addAnalytics(
            editor.view.state,
            editor.view.state.tr,
            analyticsEventPayload,
          ),
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

      it('does not apply the transaction', () => {
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
        const wrapper = mountWithIntl(
          <ReactEditorView
            {...requiredProps()}
            editorProps={{ appearance: 'comment' }}
            onEditorDestroyed={handleEditorDestroyed}
          />,
        );

        // Force a re-mount of the editor-view by changing the React tree
        wrapper.setProps({
          render: ({ editor }: { editor: React.ReactChild }) => (
            <div>{editor}</div>
          ),
        });

        expect(handleEditorDestroyed).toHaveBeenCalledTimes(1);
        expect(handleEditorDestroyed).toHaveBeenCalledWith({
          view: expect.any(EditorView),
          eventDispatcher: expect.any(EventDispatcher),
          config: {
            contentComponents: expect.anything(),
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
        const wrapper = mountWithIntl(
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
          render: ({ editor }: { editor: React.ReactChild }) => (
            <div>{editor}</div>
          ),
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
          render: ({ editor }: { editor: React.ReactChild }) => (
            <div>{editor}</div>
          ),
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
                eventDispatcherDestroySpy = jest.spyOn(
                  eventDispatcher,
                  'destroy',
                );
              }
            }}
          />,
        );

        // Force a re-mount of the editor-view by changing the React tree
        wrapper.setProps({
          render: ({ editor }: { editor: React.ReactChild }) => (
            <div>{editor}</div>
          ),
        });

        expect(oldEventDispatcher).toBe(
          (wrapper.instance() as ReactEditorView).eventDispatcher,
        );
        expect(eventDispatcherDestroySpy).not.toHaveBeenCalled();
      });
    });

    describe('when appearance changes to full width', () => {
      const initFullWidthEditor = (appearance: EditorAppearance) =>
        mountWithIntl(
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
      const wrapper = mountWithIntl(
        <ReactEditorView {...requiredProps()} {...analyticsProps()} />,
      );
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

      it('should NOT call event dispatcher if it is NOT allowed to call analytics', () => {
        const { dispatch, eventDispatcher } = setupDispatchAnalyticsTest(false);

        dispatch(payload);
        expect(eventDispatcher.emit).not.toHaveBeenCalled();
      });
    });
  });

  describe('sanitize private content', () => {
    const document = doc(
      p('hello', mention({ id: '1', text: '@cheese' })(), '{endPos}'),
    )(defaultSchema);

    const mentionProvider: Promise<MentionProvider> = Promise.resolve(
      mentionResourceProvider,
    );

    it('mentions should be sanitized when sanitizePrivateContent true', () => {
      const wrapper = shallow(
        <ReactEditorView
          {...requiredProps()}
          editorProps={{
            defaultValue: toJSON(document),
            mentionProvider,
            sanitizePrivateContent: true,
          }}
          providerFactory={ProviderFactory.create({ mentionProvider })}
        />,
      );
      const { editorState } = wrapper.instance() as ReactEditorView;
      // Expect document changed with mention text attr empty
      expect(editorState.doc.toJSON()).toEqual(
        doc(p('hello', mention({ id: '1' })(), '{endPos}'))(
          defaultSchema,
        ).toJSON(),
      );

      wrapper.unmount();
    });

    it('mentions should not be sanitized when sanitizePrivateContent false', () => {
      const wrapper = shallow(
        <ReactEditorView
          {...requiredProps()}
          editorProps={{
            defaultValue: toJSON(document),
            sanitizePrivateContent: false,
            mentionProvider,
          }}
          providerFactory={ProviderFactory.create({ mentionProvider })}
        />,
      );
      const { editorState } = wrapper.instance() as ReactEditorView;
      // Expect document unchanged
      expect(editorState.doc.toJSON()).toEqual(document.toJSON());

      wrapper.unmount();
    });

    it('mentions should not be sanitized when no collabEdit options', () => {
      const wrapper = shallow(
        <ReactEditorView
          {...requiredProps()}
          editorProps={{
            defaultValue: toJSON(document),
            mentionProvider,
          }}
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
        const wrapper = mountWithIntl(
          <ReactEditorView
            {...requiredProps()}
            onEditorCreated={onEditorCreated}
            editorProps={{ defaultValue: toJSON(document), onChange }}
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
    `(
      'should set $severity to severity when $condition',
      ({ condition, threshold, severity }) => {
        (measureRender as any).mockImplementationOnce(
          (name: any, callback: any) => {
            callback && callback(threshold, 1);
          },
        );

        const wrapper = mountWithIntl(
          <ReactEditorView
            {...requiredProps()}
            {...analyticsProps()}
            allowAnalyticsGASV3={true}
            editorProps={{
              performanceTracking: {
                proseMirrorRenderedTracking: {
                  trackSeverity: true,
                  severityNormalThreshold: PROSEMIRROR_RENDERED_NORMAL_SEVERITY_THRESHOLD,
                  severityDegradedThreshold: PROSEMIRROR_RENDERED_DEGRADED_SEVERITY_THRESHOLD,
                },
              },
            }}
          />,
        );

        expect(wrapper.instance().proseMirrorRenderedSeverity).toBe(severity);
      },
    );
  });

  describe('shouldReconfigureState', () => {
    const props: EditorProps = {
      appearance: 'full-width',
    };

    it('should return TRUE when appearance changed', () => {
      const nextProps: EditorProps = {
        ...props,
        appearance: 'full-page',
      };

      const actual = shouldReconfigureState(props, nextProps);

      expect(actual).toBe(true);
    });

    it('should return TRUE when UNSAFE_allowUndoRedoButtons is changed', () => {
      const nextProps: EditorProps = {
        ...props,
        UNSAFE_allowUndoRedoButtons: true,
      };

      const actual = shouldReconfigureState(props, nextProps);

      expect(actual).toBe(true);
    });

    it('should return TRUE when persistScrollGutter changed', () => {
      const nextProps: EditorProps = {
        ...props,
        persistScrollGutter: true,
      };

      const actual = shouldReconfigureState(props, nextProps);

      expect(actual).toBe(true);
    });

    it('should return FALSE when relevant properties is not changed', () => {
      const nextProps = {
        ...props,
        inputSamplingLimit: 5,
      };

      const actual = shouldReconfigureState(props, nextProps);

      expect(actual).toBe(false);
    });
  });

  describe('dangerouslyAppendPlugins', () => {
    it('should call pmPlugins factory of passed plugin', () => {
      const pmPlugins = jest.fn(() => []);
      const __plugins = [{ name: 'dangerouslyAppendPlugins', pmPlugins }];

      mountWithIntl(
        <ReactEditorView
          {...requiredProps()}
          editorProps={{
            dangerouslyAppendPlugins: { __plugins },
          }}
        />,
      );

      expect(pmPlugins).toHaveBeenCalled();
    });
  });
});
