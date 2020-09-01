import createStub from 'raf-stub';
import {
  createProsemirrorEditorFactory,
  Preset,
  LightEditorPlugin,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { doc, a, p } from '@atlaskit/editor-test-helpers/schema-builder';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import * as Toolbar from '../../Toolbar';
import { FloatingToolbarConfig } from '../../../floating-toolbar/types';
import analyticsPlugin from '../../../analytics';
import tasksAndDecisionsPlugin from '../../../tasks-and-decisions';
import floatingToolbarPlugin from '../../../floating-toolbar';
import hyperlinkPlugin from '../../index';
import blockTypePlugin from '../../../block-type';
import typeAheadPlugin from '../../../type-ahead';
import quickInsertPlugin from '../../../quick-insert';

describe('hyperlink', () => {
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
        .add(floatingToolbarPlugin)
        .add(blockTypePlugin)
        .add(typeAheadPlugin)
        .add(quickInsertPlugin)
        .add(hyperlinkPlugin),
    });
  };

  describe('link mark behaviour', () => {
    it('should not change the link text when typing text before a link', () => {
      const { editorView, sel } = editor(
        doc(p(a({ href: 'google.com' })('{<>}google'))),
      );
      insertText(editorView, 'www.', sel);
      expect(editorView.state.doc).toEqualDocument(
        doc(p('www.', a({ href: 'google.com' })('google'))),
      );
    });

    it('should not change the link text when typing after after a link', () => {
      const { editorView, sel } = editor(
        doc(p(a({ href: 'google.com' })('google{<>}'))),
      );
      insertText(editorView, '.com', sel);
      expect(editorView.state.doc).toEqualDocument(
        doc(p(a({ href: 'google.com' })('google'), '.com')),
      );
    });

    it('should change the links text when typing inside a link', () => {
      const { editorView, sel } = editor(
        doc(p(a({ href: 'google.com' })('web{<>}site'))),
      );
      insertText(editorView, '-', sel);
      expect(editorView.state.doc).toEqualDocument(
        doc(p(a({ href: 'google.com' })('web-site'))),
      );
    });
  });

  describe('floating toolbar', () => {
    let waitForAnimationFrame: any;
    let getFloatingToolbarSpy: jest.SpyInstance<
      FloatingToolbarConfig | undefined
    >;

    beforeAll(() => {
      let stub = createStub();
      waitForAnimationFrame = stub.flush;
      jest.spyOn(window, 'requestAnimationFrame').mockImplementation(stub.add);
      getFloatingToolbarSpy = jest.spyOn(Toolbar, 'getToolbarConfig');
    });

    beforeEach(() => {
      getFloatingToolbarSpy.mockClear();
      ((window.requestAnimationFrame as any) as jest.SpyInstance<
        any
      >).mockClear();
    });

    afterAll(() => {
      ((window.requestAnimationFrame as any) as jest.SpyInstance<
        any
      >).mockRestore();
      getFloatingToolbarSpy.mockRestore();
    });

    it('should only add text, paragraph and heading, if no task/decision in schema', () => {
      editor(doc(p(a({ href: 'google.com' })('web{<>}site'))));

      waitForAnimationFrame();

      expect(getFloatingToolbarSpy).toHaveLastReturnedWith(
        expect.objectContaining({
          nodeType: [
            expect.objectContaining({ name: 'text' }),
            expect.objectContaining({ name: 'paragraph' }),
            expect.objectContaining({ name: 'heading' }),
          ],
        }),
      );
    });

    it('should include task and decision items from node type, if they exist in schema', () => {
      editor(
        doc(p(a({ href: 'google.com' })('web{<>}site'))),
        new Preset<LightEditorPlugin>().add(tasksAndDecisionsPlugin),
      );

      waitForAnimationFrame();

      expect(getFloatingToolbarSpy).toHaveLastReturnedWith(
        expect.objectContaining({
          nodeType: expect.arrayContaining([
            expect.objectContaining({ name: 'taskItem' }),
            expect.objectContaining({ name: 'decisionItem' }),
          ]),
        }),
      );
    });
  });

  describe('analytics', () => {
    it('should fire event when open link typeahead', async () => {
      const { editorView, sel } = editor(doc(p('{<>}')));
      insertText(editorView, '/Link', sel);
      sendKeyToPm(editorView, 'Enter');

      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: 'invoked',
        actionSubject: 'typeAhead',
        actionSubjectId: 'linkTypeAhead',
        attributes: expect.objectContaining({ inputMethod: 'quickInsert' }),
        eventType: 'ui',
      });
    });

    it('should fire event when a link is auto-detected when typing', async () => {
      const { editorView, sel } = editor(doc(p('{<>}')));
      insertText(editorView, 'https://www.atlassian.com ', sel);

      expect(createAnalyticsEvent).toBeCalledWith({
        action: 'inserted',
        actionSubject: 'document',
        actionSubjectId: 'link',
        attributes: expect.objectContaining({
          inputMethod: 'autoDetect',
          fromCurrentDomain: false,
        }),
        nonPrivacySafeAttributes: { linkDomain: 'atlassian.com' },
        eventType: 'track',
      });
    });

    it('should fire event when insert link via autoformatting', async () => {
      const { editorView, sel } = editor(doc(p('{<>}')));
      insertText(editorView, '[Atlassian](https://www.atlassian.com)', sel);

      expect(createAnalyticsEvent).toBeCalledWith({
        action: 'inserted',
        actionSubject: 'document',
        actionSubjectId: 'link',
        attributes: expect.objectContaining({
          inputMethod: 'autoformatting',
          fromCurrentDomain: false,
        }),
        nonPrivacySafeAttributes: { linkDomain: 'atlassian.com' },
        eventType: 'track',
      });
    });
  });
});
