import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import type {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { find, replace, cancelSearch } from '../../../commands';
import { cancelSearchWithAnalytics } from '../../../commands-with-analytics';
import { editor } from '../_utils';
import { getPluginState } from '../../../plugin';
import { TRIGGER_METHOD } from '@atlaskit/editor-common/analytics';

const createAnalyticsEvent: CreateUIAnalyticsEvent = jest.fn(
  () => ({ fire: () => {} } as UIAnalyticsEvent),
);
let editorView: EditorView;
let editorAPI: any;

const initEditor = (doc: DocBuilder) => {
  ({ editorView, editorAPI } = editor(doc, createAnalyticsEvent));
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
    cancelSearchWithAnalytics(editorAPI?.analytics?.actions)({
      triggerMethod: TRIGGER_METHOD.BUTTON,
    })(editorView.state, editorView.dispatch);
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
