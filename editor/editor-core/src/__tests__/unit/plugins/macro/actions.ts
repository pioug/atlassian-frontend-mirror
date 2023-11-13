// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  p,
  bodiedExtension,
  extension,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { insertMacroFromMacroBrowser } from '../../../../plugins/extension/pm-plugins/macro/actions';
import type {
  MacroAttributes,
  MacroProvider,
} from '@atlaskit/editor-common/provider-factory';
import { uuid } from '@atlaskit/adf-schema';

jest.mock('@atlaskit/adf-schema', () => ({
  ...jest.requireActual<Object>('@atlaskit/adf-schema'),
  uuid: {
    generate: () => 'testId',
  },
}));

const macroProvider: MacroProvider = {
  config: {},
  openMacroBrowser: () => {
    const attrs: MacroAttributes = {
      type: 'extension',
      attrs: {
        extensionKey: 'com.fake',
        extensionType: 'com.fake',
        layout: 'full-width',
      },
    };

    return Promise.resolve(attrs);
  },
  autoConvert: () => null,
};

describe('macro plugin -> commands -> insert macro from provider', () => {
  const createEditor = createEditorFactory();

  it('should normalise a nodes layout if nested inside another node', async () => {
    const firstGen = 'mochiId-first-gen';
    const secondGen = 'mochiId-second-gen';
    jest
      .spyOn(uuid, 'generate')
      .mockReturnValueOnce(firstGen)
      .mockReturnValueOnce(secondGen);

    const { editorView } = createEditor({
      doc: doc(
        bodiedExtension({
          extensionKey: 'fake.extension',
          extensionType: 'atlassian.com.editor',
        })(p('{<>}')),
      ),
      editorProps: {
        allowExtension: true,
        macroProvider: Promise.resolve(macroProvider),
      },
    });

    const macroNode =
      editorView.state.schema.nodes.bodiedExtension.createChecked(
        {
          layout: 'full-width',
          extensionKey: 'com.fake',
          extensionType: 'com.fake',
        },
        editorView.state.schema.nodes.paragraph.createChecked(),
      );

    await insertMacroFromMacroBrowser(undefined)(macroProvider, macroNode)(
      editorView,
    );

    expect(editorView.state.doc).toEqualDocument(
      doc(
        bodiedExtension({
          extensionKey: 'fake.extension',
          extensionType: 'atlassian.com.editor',
          localId: firstGen,
        })(
          extension({
            extensionKey: 'com.fake',
            extensionType: 'com.fake',
            layout: 'default',
            localId: secondGen,
          })(),
        ),
      ),
    );
  });
});
