import { replaceRaf } from 'raf-stub';
import { EditorView } from 'prosemirror-view';
import {
  Preset,
  LightEditorPlugin,
  createProsemirrorEditorFactory,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { doc, p, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';

import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '../../../analytics';
import {
  DEFAULT_TRACK_SEVERITY_THRESHOLD_NORMAL,
  DEFAULT_TRACK_SEVERITY_THRESHOLD_DEGRADED,
} from '../../pm-plugins/frozen-editor';
import basePlugin from '../../';
import * as timingUtils from '../../../../utils/performance/get-performance-timing';

jest.mock('@atlaskit/editor-common', () => ({
  ...jest.requireActual<Object>('@atlaskit/editor-common'),
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
  ) => {
    return editorFactory({
      doc,
      preset: new Preset<LightEditorPlugin>().add([
        basePlugin,
        {
          inputTracking: {
            enabled: true,
            samplingRate: 1, // send analytics for every second keystroke
            trackSeverity,
            severityNormalThreshold,
            severityDegradedThreshold,
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

        //@ts-ignore
        requestAnimationFrame.step();

        expect(dispatchAnalyticsEvent).toHaveBeenCalledWith({
          action: ACTION.INPUT_PERF_SAMPLING,
          actionSubject: ACTION_SUBJECT.EDITOR,
          attributes: expect.not.objectContaining({
            severity: 'normal',
          }),
          eventType: EVENT_TYPE.OPERATIONAL,
        });

        expect(dispatchAnalyticsEvent).toHaveBeenCalledTimes(1);
      });

      it('should not send analytics event with severity when trackSeverity is turned off', () => {
        const editor = createEditor(adfDoc, false);
        const { editorView, dispatchAnalyticsEvent } = editor;
        typeText(editorView, 'XY');

        //@ts-ignore
        requestAnimationFrame.step();

        expect(dispatchAnalyticsEvent).toHaveBeenCalledWith({
          action: ACTION.INPUT_PERF_SAMPLING,
          actionSubject: ACTION_SUBJECT.EDITOR,
          attributes: expect.not.objectContaining({
            severity: 'normal',
          }),
          eventType: EVENT_TYPE.OPERATIONAL,
        });

        expect(dispatchAnalyticsEvent).toHaveBeenCalledTimes(1);
      });

      it('should send analytics event with severity normal when duration < DEFAULT_TRACK_SEVERITY_THRESHOLD_NORMAL', () => {
        const editor = createEditor(adfDoc, true);
        const { editorView, dispatchAnalyticsEvent } = editor;
        typeText(editorView, 'XY');

        //@ts-ignore
        requestAnimationFrame.step();

        expect(dispatchAnalyticsEvent).toHaveBeenCalledWith({
          action: ACTION.INPUT_PERF_SAMPLING,
          actionSubject: ACTION_SUBJECT.EDITOR,
          attributes: expect.objectContaining({
            severity: 'normal',
          }),
          eventType: EVENT_TYPE.OPERATIONAL,
        });

        expect(dispatchAnalyticsEvent).toHaveBeenCalledTimes(1);
      });

      it('should send analytics event with severity degraded when duration > DEFAULT_TRACK_SEVERITY_THRESHOLD_NORMAL', async () => {
        const editor = createEditor(adfDoc, true);
        const { editorView, dispatchAnalyticsEvent } = editor;
        typeText(editorView, 'XY');

        await new Promise((success) => {
          const getTimeSinceMock = jest.spyOn(timingUtils, 'getTimeSince');
          getTimeSinceMock.mockImplementation(
            (startTime) => DEFAULT_TRACK_SEVERITY_THRESHOLD_NORMAL + 1,
          );

          //@ts-ignore
          requestAnimationFrame.step();

          expect(dispatchAnalyticsEvent).toHaveBeenCalledWith({
            action: ACTION.INPUT_PERF_SAMPLING,
            actionSubject: ACTION_SUBJECT.EDITOR,
            attributes: expect.objectContaining({
              severity: 'degraded',
            }),
            eventType: EVENT_TYPE.OPERATIONAL,
          });

          expect(dispatchAnalyticsEvent).toHaveBeenCalledTimes(1);

          getTimeSinceMock.mockClear();

          success();
        });
      });

      it('should send analytics event with severity blocking when duration > DEFAULT_TRACK_SEVERITY_THRESHOLD_DEGRADED', async () => {
        const editor = createEditor(adfDoc, true);
        const { editorView, dispatchAnalyticsEvent } = editor;
        typeText(editorView, 'XY');

        await new Promise((success) => {
          const getTimeSinceMock = jest.spyOn(timingUtils, 'getTimeSince');
          getTimeSinceMock.mockImplementation(
            (startTime) => DEFAULT_TRACK_SEVERITY_THRESHOLD_DEGRADED + 1,
          );

          //@ts-ignore
          requestAnimationFrame.step();

          expect(dispatchAnalyticsEvent).nthCalledWith(1, {
            action: ACTION.INPUT_PERF_SAMPLING,
            actionSubject: ACTION_SUBJECT.EDITOR,
            attributes: expect.objectContaining({
              severity: 'blocking',
            }),
            eventType: EVENT_TYPE.OPERATIONAL,
          });

          // once for INPUT_PERF_SAMPLING, second is SLOW_INPUT
          expect(dispatchAnalyticsEvent).toHaveBeenCalledTimes(2);

          getTimeSinceMock.mockClear();

          success();
        });
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

        expect(dispatchAnalyticsEvent).toHaveBeenCalledWith({
          action: ACTION.INPUT_PERF_SAMPLING,
          actionSubject: ACTION_SUBJECT.EDITOR,
          attributes: expect.objectContaining({
            severity: 'normal',
          }),
          eventType: EVENT_TYPE.OPERATIONAL,
        });

        expect(dispatchAnalyticsEvent).toHaveBeenCalledTimes(1);

        getTimeSinceMock.mockClear();
      });

      it('should send analytics event with severity degraded when duration > custom severityNormalThreshold', async () => {
        const { editorView, dispatchAnalyticsEvent } = createEditor(
          adfDoc,
          true,
          customSettings.normalThreshold,
          customSettings.degradedThreshold,
        );
        typeText(editorView, 'XY');

        await new Promise((success) => {
          const getTimeSinceMock = jest.spyOn(timingUtils, 'getTimeSince');
          getTimeSinceMock.mockImplementation(
            (startTime) => customSettings.normalThreshold + 1,
          );

          //@ts-ignore
          requestAnimationFrame.step();

          expect(dispatchAnalyticsEvent).toHaveBeenCalledWith({
            action: ACTION.INPUT_PERF_SAMPLING,
            actionSubject: ACTION_SUBJECT.EDITOR,
            attributes: expect.objectContaining({
              severity: 'degraded',
            }),
            eventType: EVENT_TYPE.OPERATIONAL,
          });

          expect(dispatchAnalyticsEvent).toHaveBeenCalledTimes(1);

          getTimeSinceMock.mockClear();

          success();
        });
      });

      it('should send analytics event with severity blocking when duration > custom severityDegradedThreshold', async () => {
        const { editorView, dispatchAnalyticsEvent } = createEditor(
          adfDoc,
          true,
          customSettings.normalThreshold,
          customSettings.degradedThreshold,
        );
        typeText(editorView, 'XY');

        await new Promise((success) => {
          const getTimeSinceMock = jest.spyOn(timingUtils, 'getTimeSince');
          getTimeSinceMock.mockImplementation(
            (startTime) => customSettings.degradedThreshold + 1,
          );

          //@ts-ignore
          requestAnimationFrame.step();

          expect(dispatchAnalyticsEvent).nthCalledWith(1, {
            action: ACTION.INPUT_PERF_SAMPLING,
            actionSubject: ACTION_SUBJECT.EDITOR,
            attributes: expect.objectContaining({
              severity: 'blocking',
            }),
            eventType: EVENT_TYPE.OPERATIONAL,
          });

          expect(dispatchAnalyticsEvent).toHaveBeenCalledTimes(2);

          getTimeSinceMock.mockClear();

          success();
        });
      });
    });
  });
});
