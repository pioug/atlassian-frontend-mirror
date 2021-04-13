import { EditorView } from 'prosemirror-view';
import { doc, p, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { find, replace, cancelSearch } from '../../../commands';
import { cancelSearchWithAnalytics } from '../../../commands-with-analytics';
import { editor } from '../_utils';
import { getPluginState } from '../../../plugin';
import { TRIGGER_METHOD } from '../../../../analytics/types';

const createAnalyticsEvent: CreateUIAnalyticsEvent = jest.fn(
  () => ({ fire: () => {} } as UIAnalyticsEvent),
);
let editorView: EditorView;

const initEditor = (doc: DocBuilder) => {
  ({ editorView } = editor(doc, createAnalyticsEvent));
};

describe('find/replace commands: cancelSearch', () => {
  beforeEach(() => {
    initEditor(doc(p('{<>}this is a document'), p('this is a document')));

    // do some things so there is state to clear
    find(editorView, null, 'this')(editorView.state, editorView.dispatch);
    replace('the dog')(editorView.state, editorView.dispatch);

    cancelSearch()(editorView.state, editorView.dispatch);
  });

  it('deactivates find/replace', () => {
    expect(getPluginState(editorView.state)).toMatchObject({
      isActive: false,
    });
  });

  it('resets all values', () => {
    expect(getPluginState(editorView.state)).toMatchObject({
      findText: '',
      replaceText: '',
      matches: [],
    });
  });
});

describe('find/replace commands: cancelSearchWithAnalytics', () => {
  it('should fire analytics event', () => {
    initEditor(doc(p('{<>}word')));
    cancelSearchWithAnalytics({ triggerMethod: TRIGGER_METHOD.BUTTON })(
      editorView.state,
      editorView.dispatch,
    );
    expect(createAnalyticsEvent).toBeCalledWith({
      eventType: 'ui',
      action: 'deactivated',
      actionSubject: 'findReplaceDialog',
      attributes: expect.objectContaining({
        triggerMethod: 'button',
      }),
    });
  });
});
