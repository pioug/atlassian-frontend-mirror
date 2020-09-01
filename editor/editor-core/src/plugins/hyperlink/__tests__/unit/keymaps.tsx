import {
  createProsemirrorEditorFactory,
  Preset,
  LightEditorPlugin,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  doc,
  p,
  a as link,
  em,
  code,
  hardBreak,
  a,
} from '@atlaskit/editor-test-helpers/schema-builder';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import { HyperlinkState, InsertStatus, stateKey } from '../../pm-plugins/main';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import analyticsPlugin from '../../../analytics';
import hyperlinkPlugin from '../../index';
import textFormattingPlugin from '../../../text-formatting';
import blockTypePlugin from '../../../block-type';

describe('hyperlink - keymap', () => {
  const createEditor = createProsemirrorEditorFactory();
  let createAnalyticsEvent: CreateUIAnalyticsEvent;

  const editor = (
    doc: any,
    preset: Preset<LightEditorPlugin> = new Preset<LightEditorPlugin>(),
  ) => {
    createAnalyticsEvent = jest.fn().mockReturnValue({ fire() {} });
    return createEditor({
      doc,
      preset: preset
        .add([analyticsPlugin, { createAnalyticsEvent }])
        .add(hyperlinkPlugin)
        .add(blockTypePlugin)
        .add(textFormattingPlugin),
    });
  };

  describe('Enter keypress', () => {
    describe('when possible link text is at the end', () => {
      describe('when it does not contain a link', () => {
        it('converts possible link text to hyperlink', () => {
          const { editorView } = editor(doc(p('hello www.atlassian.com{<>}')));

          sendKeyToPm(editorView, 'Enter');

          const a = link({ href: 'http://www.atlassian.com' })(
            'www.atlassian.com',
          );
          expect(editorView.state.doc).toEqualDocument(
            doc(p('hello ', a), p()),
          );
        });

        it('converts possible mailto link text to hyperlink', () => {
          const { editorView } = editor(doc(p('hello test@atlassian.com{<>}')));

          sendKeyToPm(editorView, 'Enter');

          const a = link({ href: 'mailto:test@atlassian.com' })(
            'test@atlassian.com',
          );
          expect(editorView.state.doc).toEqualDocument(
            doc(p('hello ', a), p()),
          );
        });

        it('preserves other mark', () => {
          const { editorView } = editor(
            doc(p(em('hello www.atlassian.com{<>}'))),
          );

          sendKeyToPm(editorView, 'Enter');

          const a = link({ href: 'http://www.atlassian.com' })(
            'www.atlassian.com',
          );
          expect(editorView.state.doc).toEqualDocument(
            doc(p(em('hello ', a)), p(em())),
          );
        });
      });

      describe('when it already contains a link', () => {
        it('does not convert to hyperlink', () => {
          const a = link({ href: 'http://www.google.com' })(
            'www.atlassian.com{<>}',
          );
          const { editorView } = editor(doc(p('hello ', a)));

          sendKeyToPm(editorView, 'Enter');

          expect(editorView.state.doc).toEqualDocument(
            doc(p('hello ', a), p()),
          );
        });
      });
    });

    describe('when there is no possible link text at the end', () => {
      it('does not create new link', () => {
        const { editorView } = editor(doc(p('hello world{<>}')));

        sendKeyToPm(editorView, 'Enter');

        expect(editorView.state.doc).toEqualDocument(
          doc(p('hello world{<>}'), p()),
        );
      });
    });
  });

  describe('Shift-Enter keypress', () => {
    it('converts possible link text to hyperlink', () => {
      const { editorView } = editor(doc(p('hello www.atlassian.com{<>}')));

      sendKeyToPm(editorView, 'Shift-Enter');

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            'hello ',
            link({ href: 'http://www.atlassian.com' })('www.atlassian.com'),
            hardBreak(),
          ),
        ),
      );
    });
  });

  describe('Escape keypress', () => {
    it('should hide the edit link toolbar', () => {
      const { editorView } = editor(
        doc(p(a({ href: 'google.com' })('li{<>}nk'))),
      );

      sendKeyToPm(editorView, 'Escape');
      expect(stateKey.getState(editorView.state)).toEqual(
        expect.objectContaining({
          activeLinkMark: undefined,
        }) as HyperlinkState,
      );
    });
  });

  describe('Cmd-k keypress', () => {
    it('should open floating toolbar for editor', () => {
      const { editorView } = editor(doc(p('{<}text{>}')));
      sendKeyToPm(editorView, 'Mod-k');
      expect(stateKey.getState(editorView.state)).toEqual(
        expect.objectContaining({
          activeLinkMark: {
            type: InsertStatus.INSERT_LINK_TOOLBAR,
            from: 1,
            to: 5,
          },
        }) as HyperlinkState,
      );
    });

    it('should not open floating toolbar if incompatible mark is selected', () => {
      const { editorView } = editor(doc(p(code('te{<>}xt'))));
      sendKeyToPm(editorView, 'Mod-k');
      expect(stateKey.getState(editorView.state)).toEqual(
        expect.objectContaining({
          activeLinkMark: undefined,
        }) as HyperlinkState,
      );
    });

    it('should trigger link typeahead invoked analytics event', () => {
      const { editorView } = editor(doc(p('{<>}')));
      sendKeyToPm(editorView, 'Mod-k');
      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: 'invoked',
        actionSubject: 'typeAhead',
        actionSubjectId: 'linkTypeAhead',
        attributes: expect.objectContaining({ inputMethod: 'shortcut' }),
        eventType: 'ui',
      });
    });
  });
});
