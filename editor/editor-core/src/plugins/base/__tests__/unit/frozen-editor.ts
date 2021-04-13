import {
  Preset,
  LightEditorPlugin,
  createProsemirrorEditorFactory,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';

import {
  ACTION,
  ACTION_SUBJECT,
  BROWSER_FREEZE_INTERACTION_TYPE,
  EVENT_TYPE,
} from '../../../analytics';
import { SEVERITY } from '@atlaskit/editor-common';
import { doc, p, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import basePlugin from '../../';
import * as frozenEditor from '../../pm-plugins/frozen-editor';
import * as utils from '../../utils/frozen-editor';

describe('frozen editor', () => {
  const createEditor = createProsemirrorEditorFactory();

  const editor = (doc: DocBuilder) => {
    return createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>().add([
        basePlugin,
        {
          inputTracking: { enabled: true },
          browserFreezeTracking: {
            trackInteractionType: true,
            trackSeverity: true,
            severityNormalThreshold: frozenEditor.NORMAL_SEVERITY_THRESHOLD,
            severityDegradedThreshold: frozenEditor.DEGRADED_SEVERITY_THRESHOLD,
          },
        },
      ]),
    });
  };

  beforeAll(() => {
    jest
      .spyOn(window, 'PerformanceObserver')
      .mockImplementation((callback: PerformanceObserverCallback) => ({
        disconnect: () => {},
        observe: () =>
          callback(
            {
              getEntries: () => [
                {
                  name: 'self',
                  duration: frozenEditor.DEFAULT_FREEZE_THRESHOLD + 1,
                  entryType: 'longtask',
                  startTime: 1,
                  toJSON: () => {},
                } as PerformanceEntry,
              ],
            } as PerformanceObserverEntryList,
            {} as PerformanceObserver,
          ),
        takeRecords: () => [],
      }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('browser freeze event', () => {
    it('should fire event with LOADING type when duration > DEFAULT_FREEZE_THRESHOLD', () => {
      const { editorView, dispatchAnalyticsEvent } = editor(doc(p('{<>}')));

      expect(dispatchAnalyticsEvent).toHaveBeenCalledWith({
        action: ACTION.BROWSER_FREEZE,
        actionSubject: ACTION_SUBJECT.EDITOR,
        attributes: expect.objectContaining({
          freezeTime: frozenEditor.DEFAULT_FREEZE_THRESHOLD + 1,
          nodeSize: editorView.state.doc.nodeSize,
          interactionType: BROWSER_FREEZE_INTERACTION_TYPE.LOADING,
        }),
        eventType: EVENT_TYPE.OPERATIONAL,
      });

      expect(dispatchAnalyticsEvent).toHaveBeenCalledTimes(1);
    });

    it('should fire event with TYPING type when duration > DEFAULT_FREEZE_THRESHOLD and there is a typing interaction', () => {
      jest
        .spyOn(utils, 'setInteractionType')
        .mockImplementationOnce(() => BROWSER_FREEZE_INTERACTION_TYPE.TYPING);
      const { editorView, dispatchAnalyticsEvent } = editor(doc(p('{<>}')));

      expect(dispatchAnalyticsEvent).toHaveBeenCalledWith({
        action: ACTION.BROWSER_FREEZE,
        actionSubject: ACTION_SUBJECT.EDITOR,
        attributes: expect.objectContaining({
          freezeTime: frozenEditor.DEFAULT_FREEZE_THRESHOLD + 1,
          nodeSize: editorView.state.doc.nodeSize,
          interactionType: BROWSER_FREEZE_INTERACTION_TYPE.TYPING,
        }),
        eventType: EVENT_TYPE.OPERATIONAL,
      });
      expect(dispatchAnalyticsEvent).toHaveBeenCalledTimes(1);
    });

    it('should fire event with CLICKING type when duration > DEFAULT_FREEZE_THRESHOLD and there is a clicking interaction', () => {
      jest
        .spyOn(utils, 'setInteractionType')
        .mockImplementationOnce(() => BROWSER_FREEZE_INTERACTION_TYPE.CLICKING);
      const { editorView, dispatchAnalyticsEvent } = editor(doc(p('{<>}')));

      expect(dispatchAnalyticsEvent).toHaveBeenCalledWith({
        action: ACTION.BROWSER_FREEZE,
        actionSubject: ACTION_SUBJECT.EDITOR,
        attributes: expect.objectContaining({
          freezeTime: frozenEditor.DEFAULT_FREEZE_THRESHOLD + 1,
          nodeSize: editorView.state.doc.nodeSize,
          interactionType: BROWSER_FREEZE_INTERACTION_TYPE.CLICKING,
        }),
        eventType: EVENT_TYPE.OPERATIONAL,
      });

      expect(dispatchAnalyticsEvent).toHaveBeenCalledTimes(1);
    });

    it('should fire event with PASTING type when duration > DEFAULT_FREEZE_THRESHOLD and there is a pasting interaction', () => {
      jest
        .spyOn(utils, 'setInteractionType')
        .mockImplementationOnce(() => BROWSER_FREEZE_INTERACTION_TYPE.PASTING);
      const { editorView, dispatchAnalyticsEvent } = editor(doc(p('{<>}')));

      expect(dispatchAnalyticsEvent).toHaveBeenCalledWith({
        action: ACTION.BROWSER_FREEZE,
        actionSubject: ACTION_SUBJECT.EDITOR,
        attributes: expect.objectContaining({
          freezeTime: frozenEditor.DEFAULT_FREEZE_THRESHOLD + 1,
          nodeSize: editorView.state.doc.nodeSize,
          interactionType: BROWSER_FREEZE_INTERACTION_TYPE.PASTING,
        }),
        eventType: EVENT_TYPE.OPERATIONAL,
      });

      expect(dispatchAnalyticsEvent).toHaveBeenCalledTimes(1);
    });

    it.each`
      condition                                                                         | threshold                                       | severity
      ${'when duration <= NORMAL_SEVERITY_THRESHOLD'}                                   | ${frozenEditor.NORMAL_SEVERITY_THRESHOLD}       | ${SEVERITY.NORMAL}
      ${'when duration > NORMAL_SEVERITY_THRESHOLD and <= DEGRADED_SEVERITY_THRESHOLD'} | ${frozenEditor.NORMAL_SEVERITY_THRESHOLD + 1}   | ${SEVERITY.DEGRADED}
      ${'when duration > DEGRADED_SEVERITY_THRESHOLD'}                                  | ${frozenEditor.DEGRADED_SEVERITY_THRESHOLD + 1} | ${SEVERITY.BLOCKING}
    `(
      'should fire event with $severity severity when $condition',
      ({ condition, threshold, severity }) => {
        jest
          .spyOn(window, 'PerformanceObserver')
          .mockImplementation((callback: PerformanceObserverCallback) => ({
            disconnect: () => {},
            observe: () =>
              callback(
                {
                  getEntries: () => [
                    {
                      name: 'self',
                      duration: threshold,
                      entryType: 'longtask',
                      startTime: 1,
                      toJSON: () => {},
                    } as PerformanceEntry,
                  ],
                } as PerformanceObserverEntryList,
                {} as PerformanceObserver,
              ),
            takeRecords: () => [],
          }));
        const { editorView, dispatchAnalyticsEvent } = editor(doc(p('{<>}')));

        expect(dispatchAnalyticsEvent).toHaveBeenCalledWith({
          action: ACTION.BROWSER_FREEZE,
          actionSubject: ACTION_SUBJECT.EDITOR,
          attributes: expect.objectContaining({
            freezeTime: threshold,
            nodeSize: editorView.state.doc.nodeSize,
            severity,
          }),
          eventType: EVENT_TYPE.OPERATIONAL,
        });

        expect(dispatchAnalyticsEvent).toHaveBeenCalledTimes(1);
      },
    );

    it('should not fire event when duration <= DEFAULT_FREEZE_THRESHOLD', () => {
      jest
        .spyOn(window, 'PerformanceObserver')
        .mockImplementation((callback: PerformanceObserverCallback) => ({
          disconnect: () => {},
          observe: () =>
            callback(
              {
                getEntries: () => [
                  {
                    name: 'self',
                    duration: frozenEditor.DEFAULT_FREEZE_THRESHOLD,
                    entryType: 'longtask',
                    startTime: 1,
                    toJSON: () => {},
                  } as PerformanceEntry,
                ],
              } as PerformanceObserverEntryList,
              {} as PerformanceObserver,
            ),
          takeRecords: () => [],
        }));
      const { dispatchAnalyticsEvent } = editor(doc(p('{<>}')));

      expect(dispatchAnalyticsEvent).not.toHaveBeenCalled();
    });
  });
});
