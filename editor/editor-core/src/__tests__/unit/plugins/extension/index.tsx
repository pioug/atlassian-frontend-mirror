import React from 'react';
import { NodeSelection } from 'prosemirror-state';
import { findParentNodeOfType } from 'prosemirror-utils';
import { EditorView } from 'prosemirror-view';

import {
  ExtensionHandlers,
  ExtensionProvider,
  UpdateExtension,
  combineExtensionProviders,
  TransformBefore,
  TransformAfter,
} from '@atlaskit/editor-common/extensions';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  inlineExtensionData,
  bodiedExtensionData,
} from '@atlaskit/editor-test-helpers/mock-extension-data';
import {
  macroProvider,
  MockMacroProvider,
} from '@atlaskit/editor-test-helpers/mock-macro-provider';
import randomId from '@atlaskit/editor-test-helpers/random-id';

import {
  doc,
  p as paragraph,
  bodiedExtension,
  extension,
  inlineExtension,
  h5,
  media,
  mediaSingle,
  underline,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';

import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import { createFakeExtensionProvider } from '@atlaskit/editor-test-helpers/extensions';

import { editExtension } from '../../../../plugins/extension/actions';
import {
  removeExtension,
  updateExtensionLayout,
} from '../../../../plugins/extension/commands';
import { getPluginState } from '../../../../plugins/extension/pm-plugins/main';
import { getSelectedExtension } from '../../../../plugins/extension/utils';
import { setNodeSelection } from '../../../../utils';
import { waitForProvider, flushPromises } from '../../../__helpers/utils';

const macroProviderPromise = Promise.resolve(macroProvider);

const testCollectionName = `media-plugin-mock-collection-${randomId()}`;
const temporaryFileId = `temporary:${randomId()}`;

const bodiedExtensionAttrs = bodiedExtensionData[1].attrs;
const extensionAttrs = {
  extensionType: 'com.atlassian.confluence.macro.core',
  extensionKey: 'dummy',
  parameters: {
    macroParams: {
      a: 2,
    },
  },
  localId: 'testId',
};

describe('extension', () => {
  const createEditor = createEditorFactory();
  const providerFactory = ProviderFactory.create({
    macroProvider: macroProviderPromise,
  });
  const ExtensionHandlerComponent = () => <div>Awesome Extension</div>;

  const editor = (
    doc: DocBuilder,
    extensionHandlers?: ExtensionHandlers,
    extensionProviders?: ExtensionProvider[],
  ) => {
    if (extensionProviders) {
      providerFactory.setProvider(
        'extensionProvider',
        Promise.resolve(combineExtensionProviders(extensionProviders)),
      );
    }

    return createEditor({
      doc,
      editorProps: {
        allowExtension: {
          allowBreakout: true,
        },
        media: { allowMediaSingle: true },
        extensionHandlers,
      },
      providerFactory,
    });
  };

  afterEach(async () => {
    await flushPromises();
  });

  describe('initial load', () => {
    it('should set the updateExtension properly when used with extensionProvider', async () => {
      const extensionUpdater = () => Promise.resolve({});

      const extensionProvider = createFakeExtensionProvider(
        'fake.confluence',
        'extension',
        ExtensionHandlerComponent,
        extensionUpdater,
      );

      const updateFn = jest.fn();
      const { editorView } = editor(
        doc(extension({ extensionKey: 'key-1', extensionType: 'type-1' })()),
        {
          'type-1': {
            render: ExtensionHandlerComponent,
            update: updateFn,
          },
        },
        [extensionProvider],
      );

      await waitForProvider(providerFactory)('extensionProvider');
      // Need to wait for promises to get the updated state from getExtensionModuleNode
      await flushPromises();

      const extensionState = getPluginState(editorView.state);

      expect(extensionState.updateExtension).resolves.toBe(updateFn);
    });
  });

  describe('localId', () => {
    it('should generate an unique localId', () => {
      const { editorView } = editor(
        doc(
          bodiedExtension({ ...bodiedExtensionAttrs, localId: '' })(
            paragraph('a{<>}'),
          ),
          bodiedExtension({ ...bodiedExtensionAttrs, localId: '' })(
            paragraph('a{<>}'),
          ),
        ),
      );

      expect(
        editorView.state.doc.firstChild?.attrs.localId.length,
      ).toBeGreaterThan(1);
      expect(editorView.state.doc.firstChild?.attrs.localId).not.toEqual(
        editorView.state.doc.lastChild?.attrs.localId,
      );
    });
  });

  describe('when extension is selected', () => {
    it('should delete the bodied extension', () => {
      const { editorView } = editor(
        doc(bodiedExtension(bodiedExtensionAttrs)(paragraph('a{<>}'))),
      );

      const nodeSelection = new NodeSelection(editorView.state.doc.resolve(0));

      editorView.dispatch(editorView.state.tr.setSelection(nodeSelection));

      removeExtension()(editorView.state, editorView.dispatch);

      expect(editorView.state.doc).toEqualDocument(doc(paragraph('')));
    });
  });

  describe('when cursor is in between two paragraphs in an extension', () => {
    it("shouldn't create a new extension node on Enter", () => {
      const { editorView } = editor(
        doc(
          bodiedExtension(bodiedExtensionAttrs)(
            paragraph('paragraph 1'),
            paragraph('{<>}'),
            paragraph('paragraph 2'),
          ),
        ),
      );

      sendKeyToPm(editorView, 'Enter');

      expect(editorView.state.doc).toEqualDocument(
        doc(
          bodiedExtension(bodiedExtensionAttrs)(
            paragraph('paragraph 1'),
            paragraph(''),
            paragraph('{<>}'),
            paragraph('paragraph 2'),
          ),
        ),
      );
    });
  });

  describe('when going from gap cursor selection to extension node selection', () => {
    const gapCursorTest = (document: any) => {
      const { editorView } = editor(document);
      const nodeViewSpy = jest.spyOn(
        (editorView as any).nodeViews,
        'bodiedExtension',
      );

      editorView.dispatch(
        editorView.state.tr.setSelection(
          NodeSelection.create(editorView.state.doc, 1),
        ),
      );

      expect(nodeViewSpy).not.toHaveBeenCalled();
    };

    it("doesn't re-create extension nodeview when coming from left gap cursor", () => {
      gapCursorTest(
        doc(
          '{<gap|>}',
          bodiedExtension(bodiedExtensionAttrs)(paragraph('hello')),
        ),
      );
    });

    it("doesn't re-create extension nodeview when coming from right gap cursor", () => {
      gapCursorTest(
        doc(
          bodiedExtension(bodiedExtensionAttrs)(paragraph('hello')),
          '{<|gap>}',
        ),
      );
    });
  });

  describe('actions', () => {
    describe('editExtension', () => {
      it('should return false if both extensionHandlers and macroProvider are not available', () => {
        const { editorView } = editor(
          doc(bodiedExtension(bodiedExtensionAttrs)(paragraph('te{<>}xt'))),
        );
        expect(
          editExtension(null)(
            editorView.state,
            editorView.dispatch,
            editorView,
          ),
        ).toBe(false);
      });

      describe('macroProvider', () => {
        const macroExtensionHandlers = {
          'com.atlassian.confluence.macro.core': () => (
            <ExtensionHandlerComponent />
          ),
        };
        it('should return true if macroProvider is available and cursor is inside extension node', async () => {
          const { editorView } = editor(
            doc(bodiedExtension(bodiedExtensionAttrs)(paragraph('te{<>}xt'))),
          );
          const provider = await macroProviderPromise;
          expect(
            editExtension(provider)(
              editorView.state,
              editorView.dispatch,
              editorView,
            ),
          ).toBe(true);
        });

        it('should return false if extension node is not selected or cursor is not inside extension body', async () => {
          const { editorView } = editor(doc(paragraph('te{<>}xt')));
          const provider = await macroProviderPromise;
          expect(
            editExtension(provider)(
              editorView.state,
              editorView.dispatch,
              editorView,
            ),
          ).toBe(false);
        });

        it('should replace selected bodiedExtension node with a new bodiedExtension node', async () => {
          const { editorView } = editor(
            doc(bodiedExtension(bodiedExtensionAttrs)(paragraph('{<>}'))),
          );
          const provider = await macroProviderPromise;
          editExtension(provider)(
            editorView.state,
            editorView.dispatch,
            editorView,
          );
          await flushPromises();
          expect(editorView.state.doc).toEqualDocument(
            doc(
              bodiedExtension(bodiedExtensionData[0].attrs)(
                h5('Heading'),
                paragraph(underline('Foo')),
              ),
            ),
          );
        });

        it('should replace selected inlineExtension node with a new inlineExtension node', async () => {
          const { editorView } = editor(
            doc(
              paragraph(
                'one',
                inlineExtension(inlineExtensionData[0].attrs)(),
                'two',
              ),
            ),
            macroExtensionHandlers,
          );
          editorView.dispatch(
            editorView.state.tr.setSelection(
              NodeSelection.create(editorView.state.doc, 4),
            ),
          );
          const macroProviderPromise = Promise.resolve(
            new MockMacroProvider(inlineExtensionData[1]),
          );
          const provider = await macroProviderPromise;
          editExtension(provider)(
            editorView.state,
            editorView.dispatch,
            editorView,
          );
          await flushPromises();
          expect(editorView.state.doc).toEqualDocument(
            doc(
              paragraph(
                'one',
                inlineExtension(inlineExtensionData[1].attrs)(),
                'two',
              ),
            ),
          );
        });

        describe('when nested in bodiedExtension', () => {
          it('should replace selected inlineExtension node with a new inlineExtension node', async () => {
            const { editorView } = editor(
              doc(
                bodiedExtension(bodiedExtensionAttrs)(
                  paragraph(
                    inlineExtension(inlineExtensionData[0].attrs)(),
                    'two',
                  ),
                ),
              ),
              macroExtensionHandlers,
            );
            editorView.dispatch(
              editorView.state.tr.setSelection(
                NodeSelection.create(editorView.state.doc, 2),
              ),
            );
            const macroProviderPromise = Promise.resolve(
              new MockMacroProvider(inlineExtensionData[1]),
            );
            const provider = await macroProviderPromise;
            editExtension(provider)(
              editorView.state,
              editorView.dispatch,
              editorView,
            );
            await flushPromises();
            expect(editorView.state.doc).toEqualDocument(
              doc(
                bodiedExtension(bodiedExtensionAttrs)(
                  paragraph(
                    inlineExtension(inlineExtensionData[1].attrs)(),
                    'two',
                  ),
                ),
              ),
            );
          });
        });

        it('should preserve the extension breakout mode on edit', async () => {
          const { editorView } = editor(
            doc(
              bodiedExtension({
                ...bodiedExtensionAttrs,
                layout: 'full-width',
              })(paragraph('te{<>}xt')),
            ),
          );

          const nodeWithPos = getSelectedExtension(editorView.state, true);

          const provider = await macroProviderPromise;
          expect(
            editExtension(provider)(
              editorView.state,
              editorView.dispatch,
              editorView,
            ),
          ).toBe(true);

          expect(nodeWithPos).toBeDefined();
          expect(nodeWithPos!.node.attrs.layout).toEqual('full-width');
        });
      });

      describe('extensionHandler', () => {
        const initialValue = { content: 'hello 123' };
        const newContent = 'goodbye 456';
        const extensionKey = 'test-key-123';
        const extensionType = 'test-ext';
        const updateFn = jest.fn();
        const updateHandler = async (params: object) => {
          updateFn(params);
          return { content: newContent };
        };
        const updateHandlerPromise = Promise.resolve(updateHandler);

        const extensionHandlers: ExtensionHandlers = {
          [extensionType]: {
            render: ({ parameters }) => (
              <div>{parameters ? parameters.content : null}</div>
            ),
            update: updateHandler,
          },
        };

        let editorView: EditorView;

        beforeEach(() => {
          const mountedEditor = editor(
            doc(
              extension({
                extensionKey,
                extensionType,
                parameters: initialValue,
              })(),
              paragraph(),
            ),
            extensionHandlers,
          );

          editorView = mountedEditor.editorView;

          // select the current node to enable editing logic
          const tr = editorView.state.tr.setSelection(
            NodeSelection.create(editorView.state.doc, 0),
          );

          editorView.dispatch(tr);
        });

        it('should return true if valid extensionHandler is provided and cursor is inside extension node', async () => {
          expect(
            editExtension(null, updateHandlerPromise)(
              editorView.state,
              editorView.dispatch,
              editorView,
            ),
          ).toBe(true);
          await flushPromises();

          expect(updateFn).toBeCalledWith(initialValue);

          expect(
            editorView.state.doc.firstChild!.attrs.parameters.content,
          ).toBe(newContent);
        });

        it('should scroll into view', async () => {
          // using a mock to be able to capture the passed TR at the end
          const dispatchSpy = jest.spyOn(editorView, 'dispatch');

          expect(
            editExtension(null, updateHandlerPromise)(
              editorView.state,
              editorView.dispatch,
              editorView,
            ),
          ).toBe(true);
          await flushPromises();

          expect(updateFn).toBeCalledWith(initialValue);

          expect(
            editorView.state.doc.firstChild!.attrs.parameters.content,
          ).toBe(newContent);

          const dispatchedTR = dispatchSpy.mock.calls[0][0];
          expect((dispatchedTR as any).scrolledIntoView).toBeTruthy();
        });
      });

      describe('defining how to update an extension', () => {
        const newMacroParams = { macroParams: { a: 1 } };

        const updatedExtension = {
          ...extensionAttrs,
          parameters: newMacroParams,
          localId: 'testId',
        };

        const setup = () => {
          const extensionProvider = createFakeExtensionProvider(
            'com.atlassian.confluence.macro.core',
            'dummy',
            ExtensionHandlerComponent,
          );

          const { editorView } = editor(
            doc(extension(extensionAttrs)()),
            undefined,
            [extensionProvider],
          );
          setNodeSelection(editorView, 0);

          return editorView;
        };

        it('should first try to use the update method provided by the extension provider/extension handler', async () => {
          const editorView = setup();

          const provider = await macroProviderPromise;
          const updateMethodResolvingMacroParams = Promise.resolve(() =>
            Promise.resolve(newMacroParams),
          );

          editExtension(provider, updateMethodResolvingMacroParams)(
            editorView.state,
            editorView.dispatch,
            editorView,
          );

          await flushPromises();

          expect(editorView.state.doc).toEqualDocument(
            doc(extension(updatedExtension)()),
          );
        });

        it('should resolve from the macro provider if the update method does not return anything', async () => {
          const editorView = setup();

          const provider = new MockMacroProvider({
            type: 'extension',
            attrs: updatedExtension,
          });

          const updateMethodResolvingUndefined = Promise.resolve(undefined);

          editExtension(provider, updateMethodResolvingUndefined)(
            editorView.state,
            editorView.dispatch,
            editorView,
          );

          await flushPromises();

          expect(editorView.state.doc).toEqualDocument(
            doc(extension(updatedExtension)()),
          );
        });

        it('should resolve from the macro provider if there is no update method provided', async () => {
          const editorView = setup();

          const provider = new MockMacroProvider({
            type: 'extension',
            attrs: updatedExtension,
          });

          const updateMethodMissing = undefined;

          editExtension(provider, updateMethodMissing)(
            editorView.state,
            editorView.dispatch,
            editorView,
          );

          await flushPromises();

          expect(editorView.state.doc).toEqualDocument(
            doc(extension(updatedExtension)()),
          );
        });
      });
    });

    describe('removeExtension', () => {
      it('should set "element" prop in plugin state to undefined and remove the node, if it is an bodied extension', () => {
        const { editorView } = editor(
          doc(bodiedExtension(bodiedExtensionAttrs)(paragraph('te{<>}xt'))),
        );

        expect(removeExtension()(editorView.state, editorView.dispatch)).toBe(
          true,
        );

        const pluginState = getPluginState(editorView.state);
        expect(pluginState.element).not.toBeDefined();
        expect(editorView.state.doc).toEqualDocument(doc(paragraph('')));
      });

      it('should set "element" prop in plugin state to undefined and remove the node, if it is an extension', () => {
        const extensionProvider = createFakeExtensionProvider(
          extensionAttrs.extensionType,
          extensionAttrs.extensionKey,
          ExtensionHandlerComponent,
        );

        const { editorView } = editor(
          doc(extension(extensionAttrs)()),
          undefined,
          [extensionProvider],
        );

        expect(removeExtension()(editorView.state, editorView.dispatch)).toBe(
          true,
        );

        const pluginState = getPluginState(editorView.state);
        expect(pluginState.element).not.toBeDefined();
        expect(editorView.state.doc).toEqualDocument(doc(paragraph('')));
      });
    });

    it('should remove the extension node even if other nodes like media is selected', () => {
      const { editorView } = editor(
        doc(
          bodiedExtension(bodiedExtensionAttrs)(
            mediaSingle({ layout: 'center' })(
              media({
                id: temporaryFileId,
                type: 'file',
                collection: testCollectionName,
                __fileMimeType: 'image/png',
              })(),
            ),
          ),
        ),
      );

      setNodeSelection(editorView, 2);

      expect(removeExtension()(editorView.state, editorView.dispatch)).toBe(
        true,
      );

      const pluginState = getPluginState(editorView.state);
      expect(pluginState.element).not.toBeDefined();
      expect(editorView.state.doc).toEqualDocument(doc(paragraph('')));
    });
  });

  describe('show extension options', () => {
    it('should show options when the cursor is inside the extension', () => {
      const { editorView } = editor(
        doc(bodiedExtension(bodiedExtensionAttrs)(paragraph('te{<>}xt'))),
      );
      const pluginState = getPluginState(editorView.state);
      expect(pluginState.element).not.toEqual(null);
    });
  });

  describe('extension layouts', () => {
    it('should update the extension node layout attribute', () => {
      const { editorView } = editor(
        doc(bodiedExtension(bodiedExtensionAttrs)(paragraph('te{<>}xt'))),
      );
      const {
        state: { schema, selection },
      } = editorView;
      const nodeInitial = findParentNodeOfType(schema.nodes.bodiedExtension)(
        selection,
      )!.node;
      expect(nodeInitial!.attrs.layout).toBe('default');
      updateExtensionLayout('full-width')(
        editorView.state,
        editorView.dispatch,
      );

      const { node } = findParentNodeOfType(schema.nodes.bodiedExtension)(
        editorView.state.selection,
      )!;
      expect(node).toBeDefined();
      expect(node!.attrs.layout).toBe('full-width');
    });

    it('respects the layout attribute', () => {
      const { editorView } = editor(
        doc(
          bodiedExtension({ ...bodiedExtensionAttrs, layout: 'full-width' })(
            paragraph('te{<>}xt'),
          ),
        ),
      );

      const getExtension = editorView.dom.getElementsByClassName(
        'extension-container',
      );
      expect(getExtension.length).toBe(1);
      const getExtensionElement = getExtension[0];

      expect(getExtensionElement.getAttribute('data-layout')).toBe(
        'full-width',
      );
    });

    it('sets the data-layout attribute on the extension DOM element', () => {
      const { editorView } = editor(
        doc(bodiedExtension(bodiedExtensionAttrs)(paragraph('te{<>}xt'))),
      );

      const getExtension = editorView.dom.getElementsByClassName(
        'extension-container',
      );
      expect(getExtension.length).toBe(1);
      const getExtensionElement = getExtension[0];

      expect(getExtensionElement.getAttribute('data-layout')).toBe('default');

      updateExtensionLayout('full-width')(
        editorView.state,
        editorView.dispatch,
      );
      expect(getExtensionElement.getAttribute('data-layout')).toBe(
        'full-width',
      );
    });

    it('sets layout attributes uniquely on extension elements', () => {
      const { editorView } = editor(
        doc(
          bodiedExtension(bodiedExtensionAttrs)(paragraph('text')),
          paragraph('hello'),
          bodiedExtension(bodiedExtensionAttrs)(paragraph('te{<>}xt')),
        ),
      );

      const {
        state: { schema },
      } = editorView;

      const getExtension = editorView.dom.getElementsByClassName(
        'extension-container',
      );
      expect(getExtension.length).toBe(2);
      updateExtensionLayout('full-width')(
        editorView.state,
        editorView.dispatch,
      );
      const { node } = findParentNodeOfType(schema.nodes.bodiedExtension)(
        editorView.state.selection,
      )!;
      expect(node).toBeDefined();
      expect(node!.attrs.layout).toBe('full-width');

      const getFirstExtensionElement = getExtension[0];
      const getSecondExtensionElement = getExtension[1];
      expect(getFirstExtensionElement.getAttribute('data-layout')).toBe(
        'default',
      );
      expect(getSecondExtensionElement.getAttribute('data-layout')).toBe(
        'full-width',
      );
    });
  });

  describe('Config Panel', () => {
    const transformBefore: TransformBefore = (parameters) =>
      parameters.macroParams;
    const transformAfter: TransformAfter = (parameters) =>
      Promise.resolve({
        macroParams: parameters,
      });

    const extensionUpdater: UpdateExtension = (data, actions) =>
      new Promise(() => {
        actions!.editInContextPanel(transformBefore, transformAfter);
      });

    const setup = async () => {
      const { editorView, refs } = editor(
        doc(
          '{firstExtension}',
          bodiedExtension({ ...bodiedExtensionAttrs, localId: 'testId1' })(
            paragraph('{<>}text'),
          ),
          paragraph('hello'),
          '{secondExtension}',
          bodiedExtension({ ...bodiedExtensionAttrs, localId: 'testId2' })(
            paragraph('text'),
          ),
        ),
      );

      editExtension(null, Promise.resolve(extensionUpdater))(
        editorView.state,
        editorView.dispatch,
        editorView,
      );

      await flushPromises();

      return { editorView, refs };
    };

    it('when editing extensions on config panel, state should contain showContextPanel=true and the pre and post transformers', async () => {
      const { editorView } = await setup();

      const pluginState = getPluginState(editorView.state);
      expect(pluginState.showContextPanel).toEqual(true);
      expect(pluginState.processParametersBefore).toEqual(transformBefore);
      expect(pluginState.processParametersAfter).toEqual(transformAfter);
    });

    it('when changing selection inside the same bodied extension, should keep context panel open', async () => {
      const { editorView } = await setup();

      setNodeSelection(editorView, 3);

      const pluginState = getPluginState(editorView.state);
      expect(pluginState.showContextPanel).toEqual(true);
      expect(pluginState.processParametersBefore).toEqual(transformBefore);
      expect(pluginState.processParametersAfter).toEqual(transformAfter);
    });

    it('when selecting another extension, should close the context panel', async () => {
      const { editorView, refs } = await setup();

      setNodeSelection(editorView, refs.secondExtension);

      const pluginState = getPluginState(editorView.state);
      expect(pluginState.showContextPanel).toEqual(false);
      expect(pluginState.processParametersBefore).toEqual(undefined);
      expect(pluginState.processParametersAfter).toEqual(undefined);
    });
  });
});
