import { doc, p } from '@atlaskit/editor-test-helpers/schema-builder';
import { setSelectionTransform } from '@atlaskit/editor-test-helpers/set-selection-transform';
import { EditorState, Transaction } from 'prosemirror-state';

import { defaultSchema } from '../../../schema/default-schema';
import {
  AnalyticsPayload,
  AnalyticsStep,
  AnalyticsWithChannel,
} from '../../analytics';

export const setup = (
  docBuilder: ReturnType<typeof doc>,
  plugins: Plugin[] = [],
) => {
  const docWithRefs = docBuilder(defaultSchema);
  const editorState = EditorState.create({
    doc: docWithRefs,
  });

  const { tr, refs } = setSelectionTransform(docWithRefs, editorState.tr);

  return {
    editorState: editorState.apply(tr),
    refs,
  };
};

describe('Analytics Step', () => {
  let state: EditorState;

  function dispatch(tr: Transaction) {
    state = state.apply(tr);
  }

  beforeEach(() => {
    ({ editorState: state } = setup(doc(p('hello world'))));
  });

  it('should call analytics handler when dispatched', function () {
    const handleAnalytics = jest.fn();
    const event: AnalyticsWithChannel<AnalyticsPayload> = {
      channel: 'test',
      payload: {
        action: 'test-action',
        actionSubject: 'test-action-subject',
        eventType: 'test-event-type',
      },
    };
    const analyticsStep = new AnalyticsStep(handleAnalytics, [event]);

    dispatch(state.tr.step(analyticsStep));

    expect(handleAnalytics).toBeCalledWith(event.payload, event.channel);
  });

  it('should call analytics handler with undo event when inverted', function () {
    const handleAnalytics = jest.fn();
    const event: AnalyticsWithChannel<AnalyticsPayload> = {
      channel: 'test',
      payload: {
        action: 'test-action',
        actionSubject: 'test-action-subject',
        eventType: 'test-event-type',
      },
    };
    const analyticsStep = new AnalyticsStep(handleAnalytics, [event]).invert();

    dispatch(state.tr.step(analyticsStep));

    expect(handleAnalytics).toBeCalledWith(
      {
        ...event.payload,
        action: 'undid',
        actionSubjectId: event.payload.action,
        attributes: {
          ...(event.payload.attributes ? event.payload.attributes : {}),
          actionSubjectId: event.payload.actionSubjectId,
        },
        eventType: 'track',
      },
      event.channel,
    );
  });

  it('should call analytics handler with redid event when inverted twice', function () {
    const handleAnalytics = jest.fn();
    const event: AnalyticsWithChannel<AnalyticsPayload> = {
      channel: 'test',
      payload: {
        action: 'test-action',
        actionSubject: 'test-action-subject',
        eventType: 'test-event-type',
      },
    };
    const analyticsStep = new AnalyticsStep(handleAnalytics, [event])
      .invert()
      .invert();

    dispatch(state.tr.step(analyticsStep));

    expect(handleAnalytics).toBeCalledWith(
      {
        ...event.payload,
        action: 'redid',
        actionSubjectId: event.payload.action,
        attributes: {
          ...(event.payload.attributes ? event.payload.attributes : {}),
          actionSubjectId: event.payload.actionSubjectId,
        },
        eventType: 'track',
      },
      event.channel,
    );
  });
});
