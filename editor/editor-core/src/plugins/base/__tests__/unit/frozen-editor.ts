jest.mock('@atlaskit/editor-common/utils', () => ({
  ...jest.requireActual<Object>('@atlaskit/editor-common/utils'),
  isPerformanceAPIAvailable: () => true,
}));
const mockStore = {
  get: jest.fn(),
  getAll: jest.fn(),
  start: jest.fn(),
  addMetadata: jest.fn(),
  mark: jest.fn(),
  success: jest.fn(),
  fail: jest.fn(),
  abort: jest.fn(),
  failAll: jest.fn(),
  abortAll: jest.fn(),
};
jest.mock('@atlaskit/editor-common/ufo', () => ({
  ...jest.requireActual<Object>('@atlaskit/editor-common/ufo'),
  ExperienceStore: {
    getInstance: () => mockStore,
  },
}));
jest.mock('../../../../utils/performance/get-performance-timing', () => ({
  ...jest.requireActual<Object>(
    '../../../../utils/performance/get-performance-timing',
  ),
  getTimeSince: jest.fn(() => 10),
}));

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
import { SEVERITY } from '@atlaskit/editor-common/utils';
import { EditorExperience } from '@atlaskit/editor-common/ufo';
import { doc, p, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import basePlugin, { BasePluginOptions } from '../../';
import {
  frozenEditorPluginKey,
  NORMAL_SEVERITY_THRESHOLD,
  DEGRADED_SEVERITY_THRESHOLD,
  DEFAULT_FREEZE_THRESHOLD,
} from '../../pm-plugins/frozen-editor';
import * as utils from '../../utils/frozen-editor';
import { getTimeSince } from '../../../../utils/performance/get-performance-timing';

describe('frozen editor', () => {
  const createEditor = createProsemirrorEditorFactory();

  const editor = (
    doc: DocBuilder,
    options: Partial<BasePluginOptions> = {},
  ) => {
    return createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>().add([
        basePlugin,
        {
          inputTracking: { enabled: true },
          browserFreezeTracking: {
            trackInteractionType: true,
            trackSeverity: true,
            severityNormalThreshold: NORMAL_SEVERITY_THRESHOLD,
            severityDegradedThreshold: DEGRADED_SEVERITY_THRESHOLD,
          },
          ...options,
        },
      ]),
      pluginKey: frozenEditorPluginKey,
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
                  duration: DEFAULT_FREEZE_THRESHOLD + 1,
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
          freezeTime: DEFAULT_FREEZE_THRESHOLD + 1,
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
          freezeTime: DEFAULT_FREEZE_THRESHOLD + 1,
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
          freezeTime: DEFAULT_FREEZE_THRESHOLD + 1,
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
          freezeTime: DEFAULT_FREEZE_THRESHOLD + 1,
          nodeSize: editorView.state.doc.nodeSize,
          interactionType: BROWSER_FREEZE_INTERACTION_TYPE.PASTING,
        }),
        eventType: EVENT_TYPE.OPERATIONAL,
      });

      expect(dispatchAnalyticsEvent).toHaveBeenCalledTimes(1);
    });

    it.each`
      condition                                                                         | threshold                          | severity
      ${'when duration <= NORMAL_SEVERITY_THRESHOLD'}                                   | ${NORMAL_SEVERITY_THRESHOLD}       | ${SEVERITY.NORMAL}
      ${'when duration > NORMAL_SEVERITY_THRESHOLD and <= DEGRADED_SEVERITY_THRESHOLD'} | ${NORMAL_SEVERITY_THRESHOLD + 1}   | ${SEVERITY.DEGRADED}
      ${'when duration > DEGRADED_SEVERITY_THRESHOLD'}                                  | ${DEGRADED_SEVERITY_THRESHOLD + 1} | ${SEVERITY.BLOCKING}
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
                    duration: DEFAULT_FREEZE_THRESHOLD,
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

  describe('ufo', () => {
    describe('when ufo option enabled', () => {
      let rafCallback: FrameRequestCallback;

      beforeEach(() => {
        jest
          .spyOn(window, 'requestAnimationFrame')
          .mockImplementation((callback) => {
            rafCallback = callback;
            return 1;
          });

        const { editorView, plugin } = editor(doc(p('{<>}')), {
          ufo: true,
          inputTracking: { enabled: true, samplingRate: 1 },
        });
        plugin?.props?.handleTextInput?.(editorView, 0, 1, 'a');
      });

      it('starts new typing experience', () => {
        expect(mockStore.start).toHaveBeenCalledWith(EditorExperience.typing);
      });

      it('succeeds typing experience on next animation frame', () => {
        expect(mockStore.success).not.toHaveBeenCalled();
        rafCallback?.(1631497795504);
        expect(mockStore.success).toHaveBeenCalledWith(
          EditorExperience.typing,
          expect.any(Object),
        );
      });

      it('adds metadata for slow input if threshold exceeded', () => {
        (getTimeSince as any).mockReturnValue(2000);
        rafCallback?.(1631497795504);
        expect(
          mockStore.addMetadata,
        ).toHaveBeenCalledWith(EditorExperience.typing, { slowInput: true });
      });
    });

    describe('when ufo option not enabled', () => {
      it("doesn't start new typing experience", () => {
        const { editorView, plugin } = editor(doc(p('{<>}')), {
          inputTracking: { enabled: true, samplingRate: 1 },
        });
        plugin?.props?.handleTextInput?.(editorView, 0, 1, 'a');
        expect(mockStore.start).not.toHaveBeenCalled();
      });
    });
  });
});
