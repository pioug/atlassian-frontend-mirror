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
import {
  isPerformanceObserverAvailable,
  isPerformanceAPIAvailable,
} from '@atlaskit/editor-common';
import { doc, p } from '@atlaskit/editor-test-helpers/schema-builder';
import basePlugin from '../../';
import * as frozenEditor from '../../pm-plugins/frozen-editor';
jest.mock('@atlaskit/editor-common');

(isPerformanceObserverAvailable as jest.Mock<any>).mockReturnValue(true);
(isPerformanceAPIAvailable as jest.Mock<any>).mockReturnValue(true);

describe('frozen editor', () => {
  const createEditor = createProsemirrorEditorFactory();

  const editor = (doc: any) => {
    return createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>().add([
        basePlugin,
        {
          inputTracking: { enabled: true },
          allowBrowserFreezeInteractionType: true,
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
              getEntriesByName: () => [],
              getEntriesByType: () => [],
            },
            {} as PerformanceObserver,
          ),
        takeRecords: () => [],
      }));
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
        .spyOn(frozenEditor, 'setInteractionType')
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
        .spyOn(frozenEditor, 'setInteractionType')
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
        .spyOn(frozenEditor, 'setInteractionType')
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
      jest.resetAllMocks();
    });

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
                getEntriesByName: () => [],
                getEntriesByType: () => [],
              },
              {} as PerformanceObserver,
            ),
          takeRecords: () => [],
        }));
      const { dispatchAnalyticsEvent } = editor(doc(p('{<>}')));

      expect(dispatchAnalyticsEvent).not.toHaveBeenCalled();
    });
  });
});
