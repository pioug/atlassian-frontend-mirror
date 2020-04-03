import {
  doc,
  p,
  a,
  code_block,
  code,
} from '@atlaskit/editor-test-helpers/schema-builder';
import { EditorTestCardProvider } from '@atlaskit/editor-test-helpers/card-provider';
import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import {
  setLinkHref,
  setLinkText,
  showLinkToolbar,
  insertLink,
  hideLinkToolbar,
  removeLink,
  insertLinkWithAnalytics,
  updateLink,
} from '../../commands';
import {
  stateKey as hyperlinkStateKey,
  LinkAction,
  canLinkBeCreatedInRange,
} from '../../pm-plugins/main';
import { pluginKey as cardPluginKey } from '../../../card/pm-plugins/main';
import { INPUT_METHOD } from '../../../analytics';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';

const googleUrl = 'https://google.com';
const yahooUrl = 'https://yahoo.com';

describe('hyperlink commands', () => {
  const createEditor = createEditorFactory();
  const cardProvider = new EditorTestCardProvider();
  let createAnalyticsEvent: CreateUIAnalyticsEvent;
  const editor = (doc: any) => {
    createAnalyticsEvent = jest.fn(
      () => ({ fire: () => {} } as UIAnalyticsEvent),
    );
    return createEditor({
      doc,
      editorProps: {
        allowAnalyticsGASV3: true,
        UNSAFE_cards: {
          provider: Promise.resolve(cardProvider),
        },
      },
      createAnalyticsEvent,
    });
  };

  describe('#setLinkHref', () => {
    it('should not set the link href when pos is not inside existing text node', () => {
      const { editorView: view, sel } = editor(doc(p('{<>}')));
      expect(setLinkHref(googleUrl, sel)(view.state, view.dispatch)).toBe(
        false,
      );
    });
    it('should not set the link when href is same', () => {
      const { editorView: view, sel } = editor(
        doc(p(a({ href: googleUrl })('{<>}text'))),
      );
      expect(setLinkHref(googleUrl, sel)(view.state, view.dispatch)).toBe(
        false,
      );
    });
    it('should remove the link mark when the href is an empty string', () => {
      const { editorView: view, sel } = editor(
        doc(p(a({ href: googleUrl })('{<>}text'))),
      );
      expect(setLinkHref('', sel)(view.state, view.dispatch)).toBe(true);
      expect(view.state.doc).toEqualDocument(doc(p('text')));
    });
    it('should set normalized link href when the href is non-empty', () => {
      const { editorView: view, sel } = editor(
        doc(p(a({ href: 'google.com' })('{<>}text'))),
      );
      expect(setLinkHref('google.com', sel)(view.state, view.dispatch)).toBe(
        true,
      );
      expect(view.state.doc).toEqualDocument(
        doc(p(a({ href: 'http://google.com' })('text'))),
      );
    });
    it('should set mailto: prefix when the href is email-like', () => {
      const { editorView: view, sel } = editor(
        doc(p(a({ href: googleUrl })('{<>}text'))),
      );
      expect(
        setLinkHref('scott@google.com', sel)(view.state, view.dispatch),
      ).toBe(true);
      expect(view.state.doc).toEqualDocument(
        doc(p(a({ href: 'mailto:scott@google.com' })('text'))),
      );
    });
    it('should set link on selection only', () => {
      const { editorView: view } = editor(doc(p('this is a {<}selection{>}')));
      const { from, to } = view.state.selection;
      expect(setLinkHref(googleUrl, from, to)(view.state, view.dispatch)).toBe(
        true,
      );
      expect(view.state.doc).toEqualDocument(
        doc(p('this is a ', a({ href: googleUrl })('selection'))),
      );
    });
    it('should not set the link href when it contains XSS code', () => {
      const { editorView: view, sel } = editor(doc(p('{<>}')));
      expect(
        setLinkHref('javascript:alert(1)', sel)(view.state, view.dispatch),
      ).toBe(false);
    });
  });
  describe('#setLinkText', () => {
    it('should not set the link text when pos is not at a link node', () => {
      const { editorView: view, sel } = editor(doc(p('{<>}')));
      expect(setLinkText('google', sel)(view.state, view.dispatch)).toBe(false);
    });
    it('should not set the link text when text is an empty string', () => {
      const { editorView: view, sel } = editor(
        doc(p(a({ href: googleUrl })('{<>}text'))),
      );
      expect(setLinkText('', sel)(view.state, view.dispatch)).toBe(false);
    });
    it('should not set the link text when text is equal to the node.text', () => {
      const { editorView: view, sel } = editor(
        doc(p(a({ href: googleUrl })('{<>}google.com'))),
      );
      expect(setLinkText('google.com', sel)(view.state, view.dispatch)).toBe(
        false,
      );
    });
    it('should set the link text when the text is non-empty', () => {
      const { editorView: view, sel } = editor(
        doc(p(a({ href: googleUrl })('{<>}text'))),
      );
      expect(setLinkText('hi!', sel)(view.state, view.dispatch)).toBe(true);
      expect(view.state.doc).toEqualDocument(
        doc(p(a({ href: googleUrl })('hi!'))),
      );
    });
    it('should set the link text on selection only', () => {
      const { editorView: view } = editor(
        doc(p('this is a ', a({ href: googleUrl })('{<}link{>}'))),
      );
      const { from, to } = view.state.selection;
      expect(
        setLinkText('selection', from, to)(view.state, view.dispatch),
      ).toBe(true);
      expect(view.state.doc).toEqualDocument(
        doc(p('this is a ', a({ href: googleUrl })('{<}selection{>}'))),
      );
    });
  });
  describe('#canLinkBeCreatedInRange', () => {
    it('should not allow creating link when selection is inside an incompatible node', () => {
      const { editorView: view, sel } = editor(doc(code_block()('{<>}')));
      expect(canLinkBeCreatedInRange(sel, sel)(view.state)).toBe(false);
    });
    it('should not allow creating link when selection is across incompatible nodes', () => {
      const {
        editorView: view,
        refs: { '<': from, '>': to },
      } = editor(doc(p('{<}hello'), p('world{>}')));
      expect(canLinkBeCreatedInRange(from, to)(view.state)).toBe(false);
    });
    it('should not allow creating link when selection is across incompatible marks', () => {
      const {
        editorView: view,
        refs: { '<': from, '>': to },
      } = editor(doc(p(code('{<}hello'), 'world{>}')));
      expect(canLinkBeCreatedInRange(from, to)(view.state)).toBe(false);
    });
    it('should not allow creating link when selection includes an existing link', () => {
      const {
        editorView: view,
        refs: { '<': from, '>': to },
      } = editor(doc(p('{<}hello ', a({ href: '' })('there'), ' world{>}')));
      expect(canLinkBeCreatedInRange(from, to)(view.state)).toBe(false);
    });
  });
  describe('#insertLink', () => {
    it('should not insert link when href is an empty string', () => {
      const { editorView: view, sel } = editor(doc(p('{<>}')));
      expect(insertLink(sel, sel, '')(view.state, view.dispatch)).toBe(false);
    });
    it('should insert normalized link when selection is a cursor and href is a non-empty string', () => {
      const { editorView: view, sel } = editor(doc(p('{<>}')));
      expect(insertLink(sel, sel, googleUrl)(view.state, view.dispatch)).toBe(
        true,
      );
      expect(view.state.doc).toEqualDocument(
        doc(p(a({ href: googleUrl })(googleUrl))),
      );
    });
    it('should insert normalized link when selection is a range and href is a non-empty string', () => {
      const {
        editorView: view,
        refs: { '<': from, '>': to },
      } = editor(doc(p('{<}example_link{>}')));
      expect(
        insertLink(
          from,
          to,
          googleUrl,
          'example_link',
        )(view.state, view.dispatch),
      ).toBe(true);
      expect(view.state.doc).toEqualDocument(
        doc(p(a({ href: googleUrl })('example_link'))),
      );
    });
    it('should set mailto: prefix when the href is email-like', () => {
      const { editorView: view, sel } = editor(doc(p('{<>}')));
      expect(
        insertLink(sel, sel, 'scott@google.com')(view.state, view.dispatch),
      ).toBe(true);
      expect(view.state.doc).toEqualDocument(
        doc(p(a({ href: 'mailto:scott@google.com' })('scott@google.com'))),
      );
    });
    it('should attempt to queue the url with the card plugin', () => {
      const { editorView: view, sel } = editor(doc(p('{<>}')));

      expect(
        insertLink(
          sel,
          sel,
          'http://www.atlassian.com/',
          undefined,
          INPUT_METHOD.TYPEAHEAD,
        )(view.state, view.dispatch),
      ).toBe(true);
      expect(cardPluginKey.getState(view.state)).toEqual({
        cards: [],
        requests: [
          {
            url: 'http://www.atlassian.com/',
            pos: 1,
            appearance: 'inline',
            compareLinkText: false,
            source: 'typeAhead',
          },
        ],
        provider: null, // cardProvider would have been set yet
        showLinkingToolbar: false,
      });
    });
    it('should not insert a href which contains XSS', () => {
      const { editorView: view, sel } = editor(doc(p('{<>}')));

      expect(
        insertLink(sel, sel, 'javascript:alert(1)')(view.state, view.dispatch),
      ).toBe(true);

      expect(view.state.doc).toEqualDocument(
        doc(p(a({ href: '' })('javascript:alert(1)'))),
      );
    });
  });
  describe('#updateLink', () => {
    it('should update link with new url', () => {
      const { editorView: view, sel } = editor(
        doc(p(a({ href: googleUrl })('{<>}foo'))),
      );
      updateLink(yahooUrl, 'foo', sel)(view.state, view.dispatch);
      expect(view.state.doc).toEqualDocument(
        doc(p(a({ href: yahooUrl })('foo'))),
      );
    });

    it('should update text', () => {
      const { editorView: view, sel } = editor(
        doc(p(a({ href: googleUrl })('{<>}foo'))),
      );
      updateLink(googleUrl, 'bar', sel)(view.state, view.dispatch);
      expect(view.state.doc).toEqualDocument(
        doc(p(a({ href: googleUrl })('bar'))),
      );
    });
  });
  describe('#insertLinkWithAnalytics', () => {
    it('should fire analytics event', () => {
      const { editorView: view, sel } = editor(doc(p('{<>}')));
      insertLinkWithAnalytics(
        INPUT_METHOD.TYPEAHEAD,
        sel,
        sel,
        googleUrl,
        'Google',
      )(view.state, view.dispatch);
      expect(createAnalyticsEvent).toBeCalledWith({
        action: 'inserted',
        actionSubject: 'document',
        actionSubjectId: 'link',
        eventType: 'track',
        attributes: expect.objectContaining({ inputMethod: 'typeAhead' }),
        nonPrivacySafeAttributes: { linkDomain: 'google.com' },
      });
    });
  });
  describe('#removeLink', () => {
    it('should remove the link mark when the href is an empty string', () => {
      const { editorView: view, sel } = editor(
        doc(p(a({ href: googleUrl })('{<>}text'))),
      );
      expect(removeLink(sel)(view.state, view.dispatch)).toBe(true);
      expect(view.state.doc).toEqualDocument(doc(p('text')));
    });
    it('should not set remove the link href when pos is not inside a link node', () => {
      const { editorView: view, sel } = editor(doc(p('{<>}')));
      expect(removeLink(sel)(view.state, view.dispatch)).toBe(false);
    });
  });
  describe('#showLinkToolbar', () => {
    it('should trigger the SHOW_INSERT_TOOLBAR for the hyperlink plugin', () => {
      const { editorView: view } = editor(doc(p('{<>}')));
      const dispatchMock = jest.spyOn(view, 'dispatch');
      expect(showLinkToolbar()(view.state, view.dispatch)).toBe(true);
      expect(
        dispatchMock.mock.calls[0][0].getMeta(hyperlinkStateKey).type,
      ).toBe(LinkAction.SHOW_INSERT_TOOLBAR);
    });
  });

  describe('#hideLinkToolbar', () => {
    it('should trigger the HIDE_TOOLBAR for the hyperlink plugin', () => {
      const { editorView: view } = editor(doc(p('{<>}')));
      const dispatchMock = jest.spyOn(view, 'dispatch');
      expect(hideLinkToolbar()(view.state, view.dispatch)).toBe(true);
      expect(
        dispatchMock.mock.calls[0][0].getMeta(hyperlinkStateKey).type,
      ).toBe(LinkAction.HIDE_TOOLBAR);
    });
  });
});
