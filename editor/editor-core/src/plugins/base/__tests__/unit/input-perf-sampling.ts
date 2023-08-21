import { replaceRaf } from 'raf-stub';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  Preset,
  createProsemirrorEditorFactory,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import type { DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';

import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '../../../analytics';
import {
  DEFAULT_TRACK_SEVERITY_THRESHOLD_NORMAL,
  DEFAULT_TRACK_SEVERITY_THRESHOLD_DEGRADED,
} from '../../pm-plugins/frozen-editor';
import { basePlugin } from '../../';
import * as timingUtils from '../../../../utils/performance/get-performance-timing';
import featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';

jest.mock('@atlaskit/editor-common/utils', () => ({
  ...jest.requireActual<Object>('@atlaskit/editor-common/utils'),
  isPerformanceAPIAvailable: () => true,
}));

// allow us to control requestAnimationFrame execution
replaceRaf();

// helper function to trigger Plugin.handleTextInput()
const typeText = (view: EditorView, text: string) => {
  const { $from, $to } = view.state.selection;
  const cb = (f: any) => f(view, $from.pos, $to.pos, text);

  if (!view.someProp('handleTextInput', cb)) {
    view.dispatch(view.state.tr.insertText(text, $from.pos, $to.pos));
  }
};

const adfDoc = doc(p('{<>}'));
const customSettings = {
  normalThreshold: 150,
  degradedThreshold: 300,
};

describe('Input performance latency', () => {
  const editorFactory = createProsemirrorEditorFactory();

  const createEditor = (
    doc: DocBuilder,
    trackSeverity?: boolean,
    severityNormalThreshold?: number,
    severityDegradedThreshold?: number,
    samplingRate = 1, // send analytics event every x keystrokes,
    trackSingleKeypress = false,
    trackRenderingTime = false,
  ) => {
    return editorFactory({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add([featureFlagsPlugin, {}])
        .add([
          basePlugin,
          {
            inputTracking: {
              enabled: true,
              samplingRate,
              trackSeverity,
              severityNormalThreshold,
              severityDegradedThreshold,
              trackSingleKeypress,
              trackRenderingTime,
            },
          },
        ]),
    });
  };

  describe('trackSeverity', () => {
    describe('default settings', () => {
      it('should not send analytics event with severity when trackSeverity is undefined', () => {
        const { editorView, dispatchAnalyticsEvent } = createEditor(adfDoc);
        typeText(editorView, 'XY');

        const getTimeSinceMock = jest.spyOn(timingUtils, 'getTimeSince');
        getTimeSinceMock.mockImplementation((startTime) => 1);

        //@ts-ignore
        requestAnimationFrame.step();

        expect(dispatchAnalyticsEvent).nthCalledWith(1, {
          action: ACTION.INPUT_PERF_SAMPLING,
          actionSubject: ACTION_SUBJECT.EDITOR,
          attributes: expect.not.objectContaining({
            severity: 'normal',
          }),
          eventType: EVENT_TYPE.OPERATIONAL,
        });

        expect(dispatchAnalyticsEvent).nthCalledWith(2, {
          action: ACTION.INPUT_PERF_SAMPLING_AVG,
          actionSubject: ACTION_SUBJECT.EDITOR,
          attributes: expect.objectContaining({
            mean: 1,
            median: 1,
            sampleSize: 1,
          }),
          eventType: EVENT_TYPE.OPERATIONAL,
        });

        expect(dispatchAnalyticsEvent).toHaveBeenCalledTimes(2);

        getTimeSinceMock.mockRestore();
      });

      it('should not send analytics event with severity when trackSeverity is turned off', () => {
        const editor = createEditor(adfDoc, false);
        const { editorView, dispatchAnalyticsEvent } = editor;
        typeText(editorView, 'XY');

        const getTimeSinceMock = jest.spyOn(timingUtils, 'getTimeSince');
        getTimeSinceMock.mockImplementation((startTime) => 1);

        //@ts-ignore
        requestAnimationFrame.step();

        expect(dispatchAnalyticsEvent).nthCalledWith(1, {
          action: ACTION.INPUT_PERF_SAMPLING,
          actionSubject: ACTION_SUBJECT.EDITOR,
          attributes: expect.not.objectContaining({
            severity: 'normal',
          }),
          eventType: EVENT_TYPE.OPERATIONAL,
        });

        expect(dispatchAnalyticsEvent).nthCalledWith(2, {
          action: ACTION.INPUT_PERF_SAMPLING_AVG,
          actionSubject: ACTION_SUBJECT.EDITOR,
          attributes: expect.objectContaining({
            mean: 1,
            median: 1,
            sampleSize: 1,
          }),
          eventType: EVENT_TYPE.OPERATIONAL,
        });

        expect(dispatchAnalyticsEvent).toHaveBeenCalledTimes(2);

        getTimeSinceMock.mockRestore();
      });

      it('should send analytics event with severity normal when duration < DEFAULT_TRACK_SEVERITY_THRESHOLD_NORMAL', () => {
        const editor = createEditor(adfDoc, true);
        const { editorView, dispatchAnalyticsEvent } = editor;
        typeText(editorView, 'XY');

        const getTimeSinceMock = jest.spyOn(timingUtils, 'getTimeSince');
        getTimeSinceMock.mockImplementation((startTime) => 1);

        //@ts-ignore
        requestAnimationFrame.step();

        expect(dispatchAnalyticsEvent).nthCalledWith(1, {
          action: ACTION.INPUT_PERF_SAMPLING,
          actionSubject: ACTION_SUBJECT.EDITOR,
          attributes: expect.objectContaining({
            severity: 'normal',
          }),
          eventType: EVENT_TYPE.OPERATIONAL,
        });

        expect(dispatchAnalyticsEvent).nthCalledWith(2, {
          action: ACTION.INPUT_PERF_SAMPLING_AVG,
          actionSubject: ACTION_SUBJECT.EDITOR,
          attributes: expect.objectContaining({
            mean: 1,
            median: 1,
            sampleSize: 1,
            severity: 'normal',
          }),
          eventType: EVENT_TYPE.OPERATIONAL,
        });

        expect(dispatchAnalyticsEvent).toHaveBeenCalledTimes(2);

        getTimeSinceMock.mockRestore();
      });

      it('should send analytics event with severity degraded when duration > DEFAULT_TRACK_SEVERITY_THRESHOLD_NORMAL', async () => {
        const editor = createEditor(adfDoc, true);
        const { editorView, dispatchAnalyticsEvent } = editor;
        typeText(editorView, 'XY');

        const getTimeSinceMock = jest.spyOn(timingUtils, 'getTimeSince');
        getTimeSinceMock.mockImplementation(
          (startTime) => DEFAULT_TRACK_SEVERITY_THRESHOLD_NORMAL + 1,
        );

        //@ts-ignore
        requestAnimationFrame.step();

        expect(dispatchAnalyticsEvent).nthCalledWith(1, {
          action: ACTION.INPUT_PERF_SAMPLING,
          actionSubject: ACTION_SUBJECT.EDITOR,
          attributes: expect.objectContaining({
            severity: 'degraded',
          }),
          eventType: EVENT_TYPE.OPERATIONAL,
        });

        expect(dispatchAnalyticsEvent).nthCalledWith(2, {
          action: ACTION.INPUT_PERF_SAMPLING_AVG,
          actionSubject: ACTION_SUBJECT.EDITOR,
          attributes: expect.objectContaining({
            mean: DEFAULT_TRACK_SEVERITY_THRESHOLD_NORMAL + 1,
            median: DEFAULT_TRACK_SEVERITY_THRESHOLD_NORMAL + 1,
            sampleSize: 1,
            severity: 'degraded',
          }),
          eventType: EVENT_TYPE.OPERATIONAL,
        });

        expect(dispatchAnalyticsEvent).toHaveBeenCalledTimes(2);

        getTimeSinceMock.mockRestore();
      });

      it('should send analytics event with severity blocking when duration > DEFAULT_TRACK_SEVERITY_THRESHOLD_DEGRADED', async () => {
        const editor = createEditor(adfDoc, true);
        const { editorView, dispatchAnalyticsEvent } = editor;
        typeText(editorView, 'XY');

        const getTimeSinceMock = jest.spyOn(timingUtils, 'getTimeSince');
        getTimeSinceMock.mockImplementation(
          (startTime) => DEFAULT_TRACK_SEVERITY_THRESHOLD_DEGRADED + 1,
        );

        //@ts-ignore
        requestAnimationFrame.step();

        expect(dispatchAnalyticsEvent).nthCalledWith(1, {
          action: ACTION.SLOW_INPUT,
          actionSubject: ACTION_SUBJECT.EDITOR,
          attributes: expect.objectContaining({
            time: DEFAULT_TRACK_SEVERITY_THRESHOLD_DEGRADED + 1,
          }),
          eventType: EVENT_TYPE.OPERATIONAL,
        });

        expect(dispatchAnalyticsEvent).nthCalledWith(2, {
          action: ACTION.INPUT_PERF_SAMPLING,
          actionSubject: ACTION_SUBJECT.EDITOR,
          attributes: expect.objectContaining({
            severity: 'blocking',
          }),
          eventType: EVENT_TYPE.OPERATIONAL,
        });

        expect(dispatchAnalyticsEvent).nthCalledWith(3, {
          action: ACTION.INPUT_PERF_SAMPLING_AVG,
          actionSubject: ACTION_SUBJECT.EDITOR,
          attributes: expect.objectContaining({
            mean: DEFAULT_TRACK_SEVERITY_THRESHOLD_DEGRADED + 1,
            median: DEFAULT_TRACK_SEVERITY_THRESHOLD_DEGRADED + 1,
            sampleSize: 1,
            severity: 'blocking',
          }),
          eventType: EVENT_TYPE.OPERATIONAL,
        });

        // once for INPUT_PERF_SAMPLING, once for INPUT_PERF_SAMPLING_AVG and once for SLOW_INPUT
        expect(dispatchAnalyticsEvent).toHaveBeenCalledTimes(3);

        getTimeSinceMock.mockRestore();
      });
    });

    describe('custom settings', () => {
      it('should send analytics event with severity normal when duration < custom severityNormalThreshold', () => {
        const { editorView, dispatchAnalyticsEvent } = createEditor(
          adfDoc,
          true,
          customSettings.normalThreshold,
          customSettings.degradedThreshold,
        );
        typeText(editorView, 'XY');

        const getTimeSinceMock = jest.spyOn(timingUtils, 'getTimeSince');
        getTimeSinceMock.mockImplementation(
          (startTime) => DEFAULT_TRACK_SEVERITY_THRESHOLD_NORMAL,
        );

        //@ts-ignore
        requestAnimationFrame.step();

        expect(dispatchAnalyticsEvent).nthCalledWith(1, {
          action: ACTION.INPUT_PERF_SAMPLING,
          actionSubject: ACTION_SUBJECT.EDITOR,
          attributes: expect.objectContaining({
            severity: 'normal',
          }),
          eventType: EVENT_TYPE.OPERATIONAL,
        });

        expect(dispatchAnalyticsEvent).nthCalledWith(2, {
          action: ACTION.INPUT_PERF_SAMPLING_AVG,
          actionSubject: ACTION_SUBJECT.EDITOR,
          attributes: expect.objectContaining({
            mean: DEFAULT_TRACK_SEVERITY_THRESHOLD_NORMAL,
            median: DEFAULT_TRACK_SEVERITY_THRESHOLD_NORMAL,
            sampleSize: 1,
            severity: 'normal',
          }),
          eventType: EVENT_TYPE.OPERATIONAL,
        });

        expect(dispatchAnalyticsEvent).toHaveBeenCalledTimes(2);

        getTimeSinceMock.mockRestore();
      });

      it('should send analytics event with severity degraded when duration > custom severityNormalThreshold', async () => {
        const { editorView, dispatchAnalyticsEvent } = createEditor(
          adfDoc,
          true,
          customSettings.normalThreshold,
          customSettings.degradedThreshold,
        );
        typeText(editorView, 'XY');

        const getTimeSinceMock = jest.spyOn(timingUtils, 'getTimeSince');
        getTimeSinceMock.mockImplementation(
          (startTime) => customSettings.normalThreshold + 1,
        );

        //@ts-ignore
        requestAnimationFrame.step();

        expect(dispatchAnalyticsEvent).nthCalledWith(1, {
          action: ACTION.INPUT_PERF_SAMPLING,
          actionSubject: ACTION_SUBJECT.EDITOR,
          attributes: expect.objectContaining({
            severity: 'degraded',
          }),
          eventType: EVENT_TYPE.OPERATIONAL,
        });

        expect(dispatchAnalyticsEvent).nthCalledWith(2, {
          action: ACTION.INPUT_PERF_SAMPLING_AVG,
          actionSubject: ACTION_SUBJECT.EDITOR,
          attributes: expect.objectContaining({
            mean: customSettings.normalThreshold + 1,
            median: customSettings.normalThreshold + 1,
            sampleSize: 1,
            severity: 'degraded',
          }),
          eventType: EVENT_TYPE.OPERATIONAL,
        });

        expect(dispatchAnalyticsEvent).toHaveBeenCalledTimes(2);

        getTimeSinceMock.mockRestore();
      });

      it('should send analytics event with severity blocking when duration > custom severityDegradedThreshold', async () => {
        const { editorView, dispatchAnalyticsEvent } = createEditor(
          adfDoc,
          true,
          customSettings.normalThreshold,
          customSettings.degradedThreshold,
        );
        typeText(editorView, 'XY');

        const getTimeSinceMock = jest.spyOn(timingUtils, 'getTimeSince');
        getTimeSinceMock.mockImplementation(
          (startTime) => customSettings.degradedThreshold + 1,
        );

        //@ts-ignore
        requestAnimationFrame.step();

        expect(dispatchAnalyticsEvent).nthCalledWith(1, {
          action: ACTION.SLOW_INPUT,
          actionSubject: ACTION_SUBJECT.EDITOR,
          attributes: expect.objectContaining({
            time: customSettings.degradedThreshold + 1,
          }),
          eventType: EVENT_TYPE.OPERATIONAL,
        });

        expect(dispatchAnalyticsEvent).nthCalledWith(2, {
          action: ACTION.INPUT_PERF_SAMPLING,
          actionSubject: ACTION_SUBJECT.EDITOR,
          attributes: expect.objectContaining({
            severity: 'blocking',
          }),
          eventType: EVENT_TYPE.OPERATIONAL,
        });

        expect(dispatchAnalyticsEvent).nthCalledWith(3, {
          action: ACTION.INPUT_PERF_SAMPLING_AVG,
          actionSubject: ACTION_SUBJECT.EDITOR,
          attributes: expect.objectContaining({
            mean: customSettings.degradedThreshold + 1,
            median: customSettings.degradedThreshold + 1,
            sampleSize: 1,
            severity: 'blocking',
          }),
          eventType: EVENT_TYPE.OPERATIONAL,
        });

        expect(dispatchAnalyticsEvent).toHaveBeenCalledTimes(3);

        getTimeSinceMock.mockRestore();
      });

      it('should flush analytics when editorView is destroyed', () => {
        const { editorView, dispatchAnalyticsEvent } = createEditor(
          adfDoc,
          true,
          undefined,
          undefined,
          3,
        );
        typeText(editorView, 'XY');

        const getTimeSinceMock = jest.spyOn(timingUtils, 'getTimeSince');
        getTimeSinceMock.mockImplementation((startTime) => 1);

        //@ts-ignore
        requestAnimationFrame.step();

        expect(dispatchAnalyticsEvent).not.toHaveBeenCalled();

        editorView.destroy();

        expect(dispatchAnalyticsEvent).toHaveBeenCalledTimes(2);
        expect(dispatchAnalyticsEvent).toHaveBeenNthCalledWith(
          1,
          expect.objectContaining({
            action: ACTION.INPUT_PERF_SAMPLING,
            actionSubject: ACTION_SUBJECT.EDITOR,
            eventType: EVENT_TYPE.OPERATIONAL,
          }),
        );

        expect(dispatchAnalyticsEvent).toHaveBeenNthCalledWith(
          2,
          expect.objectContaining({
            action: ACTION.INPUT_PERF_SAMPLING_AVG,
            actionSubject: ACTION_SUBJECT.EDITOR,
            eventType: EVENT_TYPE.OPERATIONAL,
          }),
        );

        getTimeSinceMock.mockRestore();
      });
    });
  });

  describe('tracking timings', () => {
    it('should not share tracking start time and calculate timings separately', () => {
      const editor = createEditor(adfDoc, true);
      const { editorView, dispatchAnalyticsEvent } = editor;
      const performanceNowMock = jest.spyOn(performance, 'now');

      performanceNowMock.mockImplementation(() => 1);
      typeText(editorView, 'X');

      performanceNowMock.mockImplementation(() => 2);
      typeText(editorView, 'Y');

      performanceNowMock.mockImplementation(() => 3);
      //@ts-ignore
      requestAnimationFrame.step();

      expect(dispatchAnalyticsEvent).nthCalledWith(1, {
        action: ACTION.INPUT_PERF_SAMPLING,
        actionSubject: ACTION_SUBJECT.EDITOR,
        attributes: expect.objectContaining({
          time: 2,
        }),
        eventType: EVENT_TYPE.OPERATIONAL,
      });

      expect(dispatchAnalyticsEvent).nthCalledWith(2, {
        action: ACTION.INPUT_PERF_SAMPLING_AVG,
        actionSubject: ACTION_SUBJECT.EDITOR,
        attributes: expect.objectContaining({
          mean: 2,
          median: 2,
          sampleSize: 1,
        }),
        eventType: EVENT_TYPE.OPERATIONAL,
      });

      expect(dispatchAnalyticsEvent).nthCalledWith(3, {
        action: ACTION.INPUT_PERF_SAMPLING,
        actionSubject: ACTION_SUBJECT.EDITOR,
        attributes: expect.objectContaining({
          time: 1,
        }),
        eventType: EVENT_TYPE.OPERATIONAL,
      });

      expect(dispatchAnalyticsEvent).nthCalledWith(4, {
        action: ACTION.INPUT_PERF_SAMPLING_AVG,
        actionSubject: ACTION_SUBJECT.EDITOR,
        attributes: expect.objectContaining({
          mean: 1,
          median: 1,
          sampleSize: 1,
        }),
        eventType: EVENT_TYPE.OPERATIONAL,
      });

      expect(dispatchAnalyticsEvent).toHaveBeenCalledTimes(4);

      performanceNowMock.mockRestore();
    });

    it('should track individual keypress processing time when 2 keys are pressed at the same time', async () => {
      const editor = createEditor(
        adfDoc,
        true,
        undefined,
        undefined,
        undefined,
        true,
      );
      const { editorView, dispatchAnalyticsEvent } = editor;
      const performanceNowMock = jest.spyOn(performance, 'now');

      performanceNowMock.mockImplementation(() => 1);
      typeText(editorView, 'X');

      performanceNowMock.mockImplementation(() => 2);
      await Promise.resolve();

      performanceNowMock.mockImplementation(() => 3);
      typeText(editorView, 'Y');

      performanceNowMock.mockImplementation(() => 5);
      await Promise.resolve();

      //@ts-ignore
      requestAnimationFrame.step();

      expect(dispatchAnalyticsEvent).nthCalledWith(1, {
        action: ACTION.INPUT_PERF_SAMPLING_SINGLE_KEYPRESS,
        actionSubject: ACTION_SUBJECT.EDITOR,
        attributes: expect.objectContaining({
          time: 1,
        }),
        eventType: EVENT_TYPE.OPERATIONAL,
      });

      expect(dispatchAnalyticsEvent).nthCalledWith(2, {
        action: ACTION.INPUT_PERF_SAMPLING_SINGLE_KEYPRESS_AVG,
        actionSubject: ACTION_SUBJECT.EDITOR,
        attributes: expect.objectContaining({
          mean: 1,
          median: 1,
          sampleSize: 1,
        }),
        eventType: EVENT_TYPE.OPERATIONAL,
      });

      expect(dispatchAnalyticsEvent).nthCalledWith(3, {
        action: ACTION.INPUT_PERF_SAMPLING_SINGLE_KEYPRESS,
        actionSubject: ACTION_SUBJECT.EDITOR,
        attributes: expect.objectContaining({
          time: 2,
        }),
        eventType: EVENT_TYPE.OPERATIONAL,
      });

      expect(dispatchAnalyticsEvent).nthCalledWith(4, {
        action: ACTION.INPUT_PERF_SAMPLING_SINGLE_KEYPRESS_AVG,
        actionSubject: ACTION_SUBJECT.EDITOR,
        attributes: expect.objectContaining({
          mean: 2,
          median: 2,
          sampleSize: 1,
        }),
        eventType: EVENT_TYPE.OPERATIONAL,
      });

      expect(dispatchAnalyticsEvent).toHaveBeenCalledTimes(8);

      performanceNowMock.mockRestore();
    });
  });
});
