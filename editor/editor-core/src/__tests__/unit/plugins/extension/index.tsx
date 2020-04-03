import React from 'react';
import { NodeSelection } from 'prosemirror-state';
import { findParentNodeOfType } from 'prosemirror-utils';

import { ExtensionHandlers, ProviderFactory } from '@atlaskit/editor-common';
import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
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
} from '@atlaskit/editor-test-helpers/schema-builder';

import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import sleep from '@atlaskit/editor-test-helpers/sleep';
import { createFakeExtensionProvider } from '@atlaskit/editor-test-helpers/extensions';
import { combineExtensionProviders } from '@atlaskit/editor-common';

import { editExtension } from '../../../../plugins/extension/actions';
import {
  removeExtension,
  updateExtensionLayout,
} from '../../../../plugins/extension/commands';
import { getPluginState } from '../../../../plugins/extension/plugin';
import { setNodeSelection } from '../../../../utils';
import { waitForProvider, flushPromises } from '../../../__helpers/utils';

const macroProviderPromise = Promise.resolve(macroProvider);

const testCollectionName = `media-plugin-mock-collection-${randomId()}`;
const temporaryFileId = `temporary:${randomId()}`;

describe('extension', () => {
  const createEditor = createEditorFactory();
  const providerFactory = ProviderFactory.create({
    macroProvider: macroProviderPromise,
  });
  const ExtensionHandlerComponent = () => <div>Awesome Extension</div>;

  const editor = (
    doc: any,
    extensionHandlers?: ExtensionHandlers,
    useExtensionProvider: boolean = false,
  ) => {
    const extensionUpdater = () => Promise.resolve();

    const extensionProvider = createFakeExtensionProvider(
      'fake.confluence',
      'extension',
      ExtensionHandlerComponent,
      extensionUpdater,
    );

    if (useExtensionProvider) {
      providerFactory.setProvider(
        'extensionProvider',
        Promise.resolve(combineExtensionProviders([extensionProvider])),
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

  const extensionAttrs = bodiedExtensionData[1].attrs;

  describe('initial load', () => {
    it('should set the updateExtension properly when used with extensionProvider', async () => {
      const updateFn = jest.fn();
      const { editorView } = editor(
        doc(extension({ extensionKey: 'key-1', extensionType: 'type-1' })()),
        {
          'type-1': {
            render: ExtensionHandlerComponent,
            update: updateFn,
          },
        },
        true,
      );

      await waitForProvider(providerFactory)('extensionProvider');
      // Need to wait for promises to get the updated state from getExtensionModuleNode
      await flushPromises();

      const extensionState = getPluginState(editorView.state);

      expect(extensionState.updateExtension).toBe(updateFn);
    });
  });

  describe('when extension is selected', () => {
    it('should delete the bodied extension', () => {
      const { editorView } = editor(
        doc(bodiedExtension(extensionAttrs)(paragraph('a{<>}'))),
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
          bodiedExtension(extensionAttrs)(
            paragraph('paragraph 1'),
            paragraph('{<>}'),
            paragraph('paragraph 2'),
          ),
        ),
      );

      sendKeyToPm(editorView, 'Enter');

      expect(editorView.state.doc).toEqualDocument(
        doc(
          bodiedExtension(extensionAttrs)(
            paragraph('paragraph 1'),
            paragraph(''),
            paragraph('{<>}'),
            paragraph('paragraph 2'),
          ),
        ),
      );
    });
  });

  describe('actions', () => {
    describe('editExtension', () => {
      it('should return false if both extensionHandlers and macroProvider are not available', () => {
        const { editorView } = editor(
          doc(bodiedExtension(extensionAttrs)(paragraph('te{<>}xt'))),
        );
        expect(editExtension(null)(editorView.state, editorView.dispatch)).toBe(
          false,
        );
      });

      describe('macroProvider', () => {
        const macroExtensionHandlers = {
          'com.atlassian.confluence.macro.core': () => (
            <ExtensionHandlerComponent />
          ),
        };
        it('should return true if macroProvider is available and cursor is inside extension node', async () => {
          const { editorView } = editor(
            doc(bodiedExtension(extensionAttrs)(paragraph('te{<>}xt'))),
          );
          const provider = await macroProviderPromise;
          expect(
            editExtension(provider)(editorView.state, editorView.dispatch),
          ).toBe(true);
        });

        it('should return false if extension node is not selected or cursor is not inside extension body', async () => {
          const { editorView } = editor(doc(paragraph('te{<>}xt')));
          const provider = await macroProviderPromise;
          expect(
            editExtension(provider)(editorView.state, editorView.dispatch),
          ).toBe(false);
        });

        it('should replace selected bodiedExtension node with a new bodiedExtension node', async () => {
          const { editorView } = editor(
            doc(bodiedExtension(extensionAttrs)(paragraph('{<>}'))),
          );
          const provider = await macroProviderPromise;
          editExtension(provider)(editorView.state, editorView.dispatch);
          await sleep(0);
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
          editExtension(provider)(editorView.state, editorView.dispatch);
          await sleep(0);
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
                bodiedExtension(extensionAttrs)(
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
            editExtension(provider)(editorView.state, editorView.dispatch);
            await sleep(0);
            expect(editorView.state.doc).toEqualDocument(
              doc(
                bodiedExtension(extensionAttrs)(
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
              bodiedExtension({ ...extensionAttrs, layout: 'full-width' })(
                paragraph('te{<>}xt'),
              ),
            ),
          );
          const pluginState = getPluginState(editorView.state);
          const provider = await macroProviderPromise;
          expect(
            editExtension(provider)(editorView.state, editorView.dispatch),
          ).toBe(true);
          expect(pluginState.nodeWithPos).toBeDefined();
          expect(pluginState.nodeWithPos!.node.attrs.layout).toEqual(
            'full-width',
          );
        });
      });

      describe('extensionHandler', () => {
        it('should return true if valid extensionHandler is provided and cursor is inside extension node', async () => {
          const initialValue = { content: 'hello 123' };
          const newContent = 'goodbye 456';
          const extensionKey = 'test-key-123';
          const extensionType = 'test-ext';
          const updateFn = jest.fn();
          const updateHandler = async (params: object) => {
            updateFn(params);
            return { content: newContent };
          };
          const extensionHandlers: ExtensionHandlers = {
            [extensionType]: {
              render: ({ parameters: { content } }) => <div>{content}</div>,
              update: updateHandler,
            },
          };

          const { editorView } = editor(
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

          const tr = editorView.state.tr.setSelection(
            NodeSelection.create(editorView.state.doc, 0),
          );
          editorView.dispatch(tr);

          expect(
            editExtension(
              null,
              false,
              updateHandler,
            )(editorView.state, editorView.dispatch),
          ).toBe(true);

          expect(updateFn).toBeCalledWith(initialValue);
          await sleep(0);
          expect(
            editorView.state.doc.firstChild!.attrs.parameters.content,
          ).toBe(newContent);
        });
      });

      describe('allowNewConfigPanel', () => {
        it('should set showContextPanel to true when allowNewConfigPanel is true', () => {
          const updateFn = jest.fn();
          const { editorView } = editor(
            doc(
              extension({ extensionKey: 'key-1', extensionType: 'type-1' })(),
            ),
            {
              'type-1': {
                render: ExtensionHandlerComponent,
                update: updateFn,
              },
            },
          );

          expect(
            editExtension(
              null,
              true,
              updateFn,
            )(editorView.state, editorView.dispatch),
          ).toBe(true);

          const extensionState = getPluginState(editorView.state);

          expect(extensionState.showContextPanel).toBe(true);
        });
      });
    });

    describe('removeExtension', () => {
      it('should set "element" prop in plugin state to undefined and remove the node, if it is an bodied extension', () => {
        const { editorView } = editor(
          doc(bodiedExtension(extensionAttrs)(paragraph('te{<>}xt'))),
        );

        expect(removeExtension()(editorView.state, editorView.dispatch)).toBe(
          true,
        );

        const pluginState = getPluginState(editorView.state);
        expect(pluginState.element).not.toBeDefined();
        expect(editorView.state.doc).toEqualDocument(doc(paragraph('')));
      });

      it('should set "element" prop in plugin state to undefined and remove the node, if it is an extension', () => {
        const { editorView } = editor(doc(extension(extensionAttrs)()));

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
          bodiedExtension(extensionAttrs)(
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

  describe('show extention options', () => {
    it('should show options when the cursor is inside the extension', () => {
      const { editorView } = editor(
        doc(bodiedExtension(extensionAttrs)(paragraph('te{<>}xt'))),
      );
      const pluginState = getPluginState(editorView.state);
      expect(pluginState.element).not.toEqual(null);
    });
  });

  describe('extension layouts', () => {
    it('should update the extension node layout attribute', () => {
      const { editorView } = editor(
        doc(bodiedExtension(extensionAttrs)(paragraph('te{<>}xt'))),
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
          bodiedExtension({ ...extensionAttrs, layout: 'full-width' })(
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
        doc(bodiedExtension(extensionAttrs)(paragraph('te{<>}xt'))),
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
          bodiedExtension(extensionAttrs)(paragraph('text')),
          paragraph('hello'),
          bodiedExtension(extensionAttrs)(paragraph('te{<>}xt')),
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
});
