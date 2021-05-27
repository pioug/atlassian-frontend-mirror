import {
  doc,
  p,
  a,
  code_block,
  code,
  strong,
  emoji,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { getTestEmojiResource } from '@atlaskit/util-data-test/get-test-emoji-resource';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { EditorTestCardProvider } from '@atlaskit/editor-test-helpers/card-provider';
import { CardOptions } from '@atlaskit/editor-common';
import {
  createProsemirrorEditorFactory,
  Preset,
  LightEditorPlugin,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  showLinkToolbar,
  insertLink,
  hideLinkToolbar,
  removeLink,
  insertLinkWithAnalytics,
  updateLink,
  insertLinkWithAnalyticsMobileNative,
  setLinkHref,
} from '../../commands';
import {
  stateKey as hyperlinkStateKey,
  LinkAction,
  canLinkBeCreatedInRange,
} from '../../pm-plugins/main';
import { pluginKey as cardPluginKey } from '../../../card/pm-plugins/main';
import analyticsPlugin, { INPUT_METHOD } from '../../../analytics';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import cardPlugin from '../../../card';
import emojiPlugin from '../../../emoji';
import hyperlinkPlugin from '../../index';
import textFormattingPlugin from '../../../text-formatting';
import codeBlockPlugin from '../../../code-block';

const googleUrl = 'https://google.com';
const confluenceUrl =
  'https://hello.atlassian.com/wiki/spaces/YEET/pages/11111111/spaghetti';
const yahooUrl = 'https://yahoo.com';

const emojiProvider = getTestEmojiResource();
const providerFactory = ProviderFactory.create({ emojiProvider });

describe('hyperlink commands', () => {
  const createEditor = createProsemirrorEditorFactory();
  const cardProvider = new EditorTestCardProvider();
  const cardOptions: CardOptions = {
    provider: Promise.resolve(new EditorTestCardProvider()),
  };
  let createAnalyticsEvent: CreateUIAnalyticsEvent;
  const editor = (doc: DocBuilder) => {
    createAnalyticsEvent = jest.fn(
      () => ({ fire: () => {} } as UIAnalyticsEvent),
    );
    return createEditor({
      doc,
      providerFactory,
      preset: new Preset<LightEditorPlugin>()
        .add([analyticsPlugin, { createAnalyticsEvent }])
        .add(hyperlinkPlugin)
        .add(textFormattingPlugin)
        .add(emojiPlugin)
        .add(codeBlockPlugin)
        .add([
          cardPlugin,
          { provider: Promise.resolve(cardProvider), platform: 'web' },
        ]),
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

    it('should not remove marks if text has not changed', () => {
      const {
        editorView: view,
        refs: { '<': from, '>': to },
      } = editor(doc(p('He{<}llo', strong('wor{>}ld'))));

      insertLink(
        from,
        to,
        googleUrl,
        undefined,
        'llowor',
      )(view.state, view.dispatch);
      expect(view.state.doc).toEqualDocument(
        doc(
          p('He', a({ href: googleUrl })('llo', strong('wor')), strong('ld')),
        ),
      );
    });

    it('should not remove inline nodes if text has not changed', () => {
      const {
        editorView: view,
        refs: { '<': from, '>': to },
      } = editor(
        doc(p('He{<}llo', emoji({ shortName: ':smiley:' })(), ' world{>}')),
      );

      insertLink(
        from,
        to,
        googleUrl,
        undefined,
        'llo world',
      )(view.state, view.dispatch);
      expect(view.state.doc).toEqualDocument(
        doc(
          p(
            'He',
            a({ href: googleUrl })(
              'llo',
              emoji({ shortName: ':smiley:' })(),
              ' world',
            ),
          ),
        ),
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
    it('should attempt to queue the url if it is a smart link', () => {
      const { editorView: view, sel } = editor(doc(p('{<>}')));
      expect(
        insertLink(
          sel,
          sel,
          'http://www.atlassian.com/',
          undefined,
          undefined,
          INPUT_METHOD.MANUAL,
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
            source: 'manual',
          },
        ],
        provider: null, // cardProvider would have been set yet
        showLinkingToolbar: false,
      });
    });
    it('should attempt to queue the url with the card plugin if source is MANUAL and text is non-empty but equal to href, and it is a smart link', () => {
      const { editorView: view, sel } = editor(doc(p('{<>}')));
      expect(
        insertLink(
          sel,
          sel,
          'http://www.atlassian.com/',
          undefined,
          'http://www.atlassian.com/',
          INPUT_METHOD.MANUAL,
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
            source: 'manual',
          },
        ],
        provider: null, // cardProvider would have been set yet
        showLinkingToolbar: false,
      });
      expect(view.state.doc).toEqualDocument(
        doc(
          p(
            a({ href: 'http://www.atlassian.com/' })(
              'http://www.atlassian.com/',
            ),
          ),
        ),
      );
    });
    it('should not attempt to queue the url with the card plugin if url is not a smart link', () => {
      const { editorView: view, sel } = editor(doc(p('{<>}')));
      expect(
        insertLink(
          sel,
          sel,
          'http://www.atlassian.com/',
          undefined,
          'atlassian',
          INPUT_METHOD.MANUAL,
        )(view.state, view.dispatch),
      ).toBe(true);
      expect(cardPluginKey.getState(view.state)).toEqual({
        cards: [],
        requests: [],
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
    it('should fire analytics event when it is a normal link and smart links are not available', async () => {
      const { editorView: view, sel } = editor(doc(p('{<>}')));
      (
        await insertLinkWithAnalytics(
          INPUT_METHOD.MANUAL,
          sel,
          sel,
          googleUrl,
          undefined,
          undefined,
          false,
        )
      )(view.state, view.dispatch);
      expect(createAnalyticsEvent).toBeCalledWith({
        action: 'inserted',
        actionSubject: 'document',
        actionSubjectId: 'link',
        eventType: 'track',
        attributes: expect.objectContaining({
          inputMethod: 'manual',
          fromCurrentDomain: false,
        }),
        nonPrivacySafeAttributes: { linkDomain: 'google.com' },
      });
    });
  });
  describe('#insertLinkWithAnalyticsMobileNative', () => {
    it('should fire analytics event', async () => {
      const { editorView: view, sel } = editor(doc(p('{<>}')));
      (
        await insertLinkWithAnalyticsMobileNative(
          INPUT_METHOD.MANUAL,
          sel,
          sel,
          googleUrl,
          undefined,
          'Google',
        )
      )(view.state, view.dispatch);
      expect(createAnalyticsEvent).toBeCalledWith({
        action: 'inserted',
        actionSubject: 'document',
        actionSubjectId: 'link',
        eventType: 'track',
        attributes: expect.objectContaining({
          inputMethod: 'manual',
          fromCurrentDomain: false,
        }),
        nonPrivacySafeAttributes: { linkDomain: 'google.com' },
      });
    });
  });
  describe('#insertLinkWithAnalytics', () => {
    it('should fire analytics event if smart links are available and it is not a smart link', async () => {
      const { editorView: view, sel } = editor(doc(p('{<>}')));
      (
        await insertLinkWithAnalytics(
          INPUT_METHOD.MANUAL,
          sel,
          sel,
          googleUrl,
          undefined,
          'hey',
          !!(cardOptions && cardOptions.provider),
        )
      )(view.state, view.dispatch);
      expect(createAnalyticsEvent).toBeCalledWith({
        action: 'inserted',
        actionSubject: 'document',
        actionSubjectId: 'link',
        eventType: 'track',
        attributes: expect.objectContaining({
          inputMethod: 'manual',
          fromCurrentDomain: false,
        }),
        nonPrivacySafeAttributes: { linkDomain: 'google.com' },
      });
    });
  });
  describe('#insertLinkWithAnalytics', () => {
    it('should fire analytics event when it is not a smart link and smart links are available', async () => {
      const { editorView: view, sel } = editor(doc(p('{<>}')));
      (
        await insertLinkWithAnalytics(
          INPUT_METHOD.TYPEAHEAD,
          sel,
          sel,
          googleUrl,
          undefined,
          'hello this is the link text',
          !!(cardOptions && cardOptions.provider),
        )
      )(view.state, view.dispatch);
      expect(createAnalyticsEvent).toBeCalledWith({
        action: 'inserted',
        actionSubject: 'document',
        actionSubjectId: 'link',
        eventType: 'track',
        attributes: expect.objectContaining({
          inputMethod: 'typeAhead',
          fromCurrentDomain: false,
        }),
        nonPrivacySafeAttributes: { linkDomain: 'google.com' },
      });
    });
  });
  describe('#insertLinkWithAnalytics', () => {
    it('should not fire analytics event when it is a smart link', async () => {
      const { editorView: view, sel } = editor(doc(p('{<>}')));
      (
        await insertLinkWithAnalytics(
          INPUT_METHOD.MANUAL,
          sel,
          sel,
          confluenceUrl,
          undefined,
          undefined,
          !!(cardOptions && cardOptions.provider),
        )
      )(view.state, view.dispatch);
      expect(createAnalyticsEvent).not.toBeCalled();
    });
  });
  describe('#removeLink', () => {
    it('should remove the link mark when the href is an empty string', () => {
      const { editorView: view, sel } = editor(
        doc(p(a({ href: confluenceUrl })('{<>}text'))),
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
