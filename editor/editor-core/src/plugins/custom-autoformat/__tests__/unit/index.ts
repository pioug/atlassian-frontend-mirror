import { ADFEntity } from '@atlaskit/adf-utils';
import {
  ProviderFactory,
  AutoformattingProvider,
} from '@atlaskit/editor-common/provider-factory';
import {
  doc,
  p,
  ul,
  li,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import {
  LightEditorPlugin,
  Preset,
  createProsemirrorEditorFactory,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';

import { pluginKey } from '../../utils';
// Editor plugins
import customAutoformatPlugin from '../../index';
import basePlugin from '../../../base';
import listPlugin from '../../../list';

describe('custom-autoformat', () => {
  const createEditor = createProsemirrorEditorFactory();

  const niceProvider: AutoformattingProvider = {
    getRules() {
      return Promise.resolve({
        za: () => {
          const replacement = Promise.resolve({
            type: 'text',
            text: 'nice',
          });
          promises.push(replacement);
          return replacement;
        },
      });
    },
  };

  let autoformattingProvider: Promise<AutoformattingProvider>;
  const promises: Array<Promise<ADFEntity>> = [];
  const providerFactory = new ProviderFactory();

  const editor = (doc: DocBuilder) => {
    return createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add(customAutoformatPlugin)
        .add(basePlugin)
        .add(listPlugin),
      providerFactory,
      pluginKey,
    });
  };

  afterEach(async () => {
    await Promise.all(promises);
    promises.splice(0, promises.length);
  });

  describe('autoformatting', () => {
    beforeEach(() => {
      autoformattingProvider = Promise.resolve(niceProvider);
      providerFactory.setProvider(
        'autoformattingProvider',
        autoformattingProvider,
      );
    });

    it('autoformats after pressing space', async () => {
      const { editorView } = editor(doc(p('hello {<>}')));

      // await the provider to resolve
      await autoformattingProvider;
      await niceProvider.getRules();

      // should queue the format
      insertText(editorView, 'za ');

      // resolve the autoformatting
      await Promise.all(promises);

      insertText(editorView, 'after');

      expect(editorView.state.doc).toEqualDocument(doc(p('hello nice after')));
    });

    it('autoformats after pressing enter in paragraph', async () => {
      const { editorView } = editor(doc(p('hello {<>}')));

      // await the provider to resolve
      await autoformattingProvider;
      await niceProvider.getRules();

      // should queue the format
      insertText(editorView, 'za');
      sendKeyToPm(editorView, 'Enter');

      // resolve the autoformatting
      await Promise.all(promises);

      insertText(editorView, 'after');

      expect(editorView.state.doc).toEqualDocument(
        doc(p('hello nice'), p('after')),
      );
    });

    it('autoformats after pressing enter in list', async () => {
      const { editorView } = editor(doc(ul(li(p('hello {<>}')))));

      // await the provider to resolve
      await autoformattingProvider;
      await niceProvider.getRules();

      // should queue the format
      insertText(editorView, 'za');
      sendKeyToPm(editorView, 'Enter');

      // resolve the autoformatting
      await Promise.all(promises);

      insertText(editorView, 'after');

      expect(editorView.state.doc).toEqualDocument(
        doc(ul(li(p('hello nice')), li(p('after')))),
      );
    });

    it('autoformats after pressing comma', async () => {
      const { editorView } = editor(doc(p('hello {<>}')));

      // await the provider to resolve
      await autoformattingProvider;
      await niceProvider.getRules();

      // should queue the format
      insertText(editorView, 'za,');

      // resolve the autoformatting
      await Promise.all(promises);

      insertText(editorView, 'after');

      expect(editorView.state.doc).toEqualDocument(doc(p('hello nice,after')));
    });

    it('autoformats after pressing period', async () => {
      const { editorView } = editor(doc(p('hello {<>}')));

      // await the provider to resolve
      await autoformattingProvider;
      await niceProvider.getRules();

      // should queue the format
      insertText(editorView, 'za.');

      // resolve the autoformatting
      await Promise.all(promises);

      insertText(editorView, 'after');

      expect(editorView.state.doc).toEqualDocument(doc(p('hello nice.after')));
    });

    it('does not autoformat after pressing any other character', async () => {
      const { editorView } = editor(doc(p('hello {<>}')));

      // await the provider to resolve
      await autoformattingProvider;
      await niceProvider.getRules();

      // should queue the format
      insertText(editorView, 'za*');

      // resolve the autoformatting
      await Promise.all(promises);

      insertText(editorView, 'after');

      expect(editorView.state.doc).toEqualDocument(doc(p('hello za*after')));
    });

    it('does not autoformat if text changes', async () => {
      const { editorView } = editor(doc(p('hello {<>}')));

      // await the provider to resolve
      await autoformattingProvider;
      await niceProvider.getRules();

      // should queue the format
      insertText(editorView, 'za ');
      expect(promises.length).toBe(1);

      insertText(editorView, 'change', editorView.state.selection.from - 3);

      // resolve the autoformatting
      await Promise.all(promises);

      expect(editorView.state.doc).toEqualDocument(doc(p('hello changeza ')));
    });

    it('autoformats even if text before changes', async () => {
      const { editorView } = editor(doc(p('hello {<>}')));

      // await the provider to resolve
      await autoformattingProvider;
      await niceProvider.getRules();

      // should queue the format
      insertText(editorView, 'za ');

      // type before *while* the autoformat provider is still resolving
      insertText(editorView, 'before ', 1);

      // resolve the autoformatting
      await Promise.all(promises);

      expect(editorView.state.doc).toEqualDocument(
        doc(p('before hello nice ')),
      );
    });
  });

  describe('provider validation', () => {
    it('does nothing if provider rejects', async () => {
      const replacementRule = jest.fn(() => {
        return (Promise.reject('nope').catch(() => {}) as any) as Promise<
          ADFEntity
        >;
      });

      const rejectingProvider: AutoformattingProvider = {
        getRules() {
          return Promise.resolve({ za: replacementRule });
        },
      };

      // setup rejecting provider
      autoformattingProvider = Promise.resolve(rejectingProvider);
      providerFactory.setProvider(
        'autoformattingProvider',
        autoformattingProvider,
      );

      const { editorView } = editor(doc(p('hello {<>}')));
      await autoformattingProvider;
      await niceProvider.getRules();

      // trigger replacement
      insertText(editorView, 'za ');
      expect(replacementRule).toBeCalled();

      insertText(editorView, 'after');

      // text should not have changed
      expect(editorView.state.doc).toEqualDocument(doc(p('hello za after')));
    });
  });
});
