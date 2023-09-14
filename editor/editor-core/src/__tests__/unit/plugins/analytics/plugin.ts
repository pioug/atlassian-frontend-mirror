import type { AnalyticsEventPayload } from '../../../../plugins/analytics';
import {
  addAnalytics,
  analyticsPluginKey,
  ACTION,
  ACTION_SUBJECT,
  INPUT_METHOD,
  EVENT_TYPE,
  ACTION_SUBJECT_ID,
} from '../../../../plugins/analytics';
import { extendPayload } from '../../../../plugins/analytics/plugin';
import type {
  EditorState,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import type { CommandDispatch } from '../../../../types';
import type { AnalyticsStep } from '@atlaskit/adf-schema/steps';

describe('analytics', () => {
  const createEditor = createEditorFactory();
  const payload: AnalyticsEventPayload = {
    action: ACTION.CLICKED,
    actionSubject: ACTION_SUBJECT.BUTTON,
    actionSubjectId: ACTION_SUBJECT_ID.BUTTON_HELP,
    attributes: { inputMethod: INPUT_METHOD.TOOLBAR },
    eventType: EVENT_TYPE.UI,
  };

  let createAnalyticsEvent: jest.Mock;
  let fireMock: jest.Mock;

  describe('addAnalytics', () => {
    let editorView;
    let dispatch: CommandDispatch;
    let state: EditorState;
    let tr: Transaction;

    const editor = (doc: DocBuilder) => {
      fireMock = jest.fn();
      createAnalyticsEvent = jest.fn(() => ({ fire: fireMock }));
      return createEditor({
        doc,
        editorProps: {
          allowAnalyticsGASV3: true,
        },
        createAnalyticsEvent,
        pluginKey: analyticsPluginKey,
      });
    };

    beforeEach(() => {
      ({ editorView } = editor(doc(p('hello world'))));
      ({ dispatch, state } = editorView);
      tr = editorView.state.tr.insertText('hello ');
    });

    it('should add current selection position to analytics step', () => {
      tr = addAnalytics(state, tr, payload);

      const pos = state.selection.$from.pos;
      const analyticsStep = tr.steps[
        tr.steps.length - 1
      ] as AnalyticsStep<AnalyticsEventPayload>;

      expect(pos).toEqual(analyticsStep.pos);
    });

    it('should map position through tr steps', () => {
      tr.deleteRange(0, tr.doc.content.size);
      tr = addAnalytics(state, tr, payload);

      const analyticsStep = tr.steps[
        tr.steps.length - 1
      ] as AnalyticsStep<AnalyticsEventPayload>;

      expect(analyticsStep.pos).toEqual(0);
    });

    it('create analytics event with payload', () => {
      tr = addAnalytics(state, tr, payload);
      dispatch(tr);

      expect(createAnalyticsEvent).toHaveBeenCalledWith(payload);
    });

    it('fires analytics event for channel', () => {
      tr = addAnalytics(state, tr, payload, 'atlassian');
      dispatch(tr);

      expect(fireMock).toHaveBeenCalledWith('atlassian');
    });

    it('handles firing multiple analytics events for one transaction', () => {
      const secondPayload: AnalyticsEventPayload = {
        action: ACTION.STOPPED,
        actionSubject: ACTION_SUBJECT.EDITOR,
        actionSubjectId: ACTION_SUBJECT_ID.SAVE,
        attributes: {
          inputMethod: INPUT_METHOD.SHORTCUT,
          documentSize: state.doc.nodeSize,
        },
        eventType: EVENT_TYPE.UI,
      };

      tr = addAnalytics(state, tr, payload);
      tr = addAnalytics(state, tr, secondPayload);

      dispatch(tr);

      expect(createAnalyticsEvent).toHaveBeenCalledWith(payload);
      expect(createAnalyticsEvent).toHaveBeenCalledWith(secondPayload);
    });

    describe('#extendPayload', () => {
      it('should extend event attributes with performance metric: duration', () => {
        expect(
          extendPayload({ payload, duration: 123, distortedDuration: false })
            .attributes,
        ).toHaveProperty('duration');
      });
    });
  });
});
