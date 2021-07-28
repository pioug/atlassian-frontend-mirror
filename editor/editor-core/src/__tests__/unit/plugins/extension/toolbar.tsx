import React from 'react';
import { IntlProvider } from 'react-intl';
import { NodeSelection } from 'prosemirror-state';
import { activityProviderFactory } from '@atlaskit/editor-test-helpers/mock-activity-provider';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  extension,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { createFakeExtensionProvider } from '@atlaskit/editor-test-helpers/extensions';
import { combineExtensionProviders } from '@atlaskit/editor-common/extensions';
import {
  ProviderFactory,
  MacroProvider,
} from '@atlaskit/editor-common/provider-factory';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import EditIcon from '@atlaskit/icon/glyph/editor/edit';

import {
  pluginKey,
  getPluginState,
} from '../../../../plugins/extension/pm-plugins/main';
import { getToolbarConfig } from '../../../../plugins/extension/toolbar';
import commonMessages from '../../../../messages';
import { EditorProps } from '../../../../types';
import { waitForProvider, flushPromises } from '../../../__helpers/utils';
import { getToolbarItems } from '../../../../plugins/floating-toolbar/__tests__/_helpers';

describe('extension toolbar', () => {
  const createEditor = createEditorFactory();
  const providerFactory = ProviderFactory.create({
    activityProvider: activityProviderFactory([]),
  });

  const editor = (
    doc: DocBuilder,
    props: Partial<EditorProps> = {},
    providerFactory?: ProviderFactory,
  ) => {
    return createEditor({
      doc,
      editorProps: {
        appearance: 'full-page',
        allowBreakout: true,
        allowExtension: {
          allowBreakout: true,
        },
        ...props,
      },
      pluginKey,
      providerFactory,
    });
  };

  describe('toolbar', () => {
    const intlProvider = new IntlProvider({ locale: 'en' });
    const { intl } = intlProvider.getChildContext();

    const defaultBreakoutTitle = intl.formatMessage(
      commonMessages.layoutFixedWidth,
    );
    const wideBreakoutTitle = intl.formatMessage(commonMessages.layoutWide);
    const fullWidthBreakoutTitle = intl.formatMessage(
      commonMessages.layoutFullWidth,
    );
    const removeTitle = intl.formatMessage(commonMessages.remove);

    it('has a remove button', () => {
      const { editorView } = editor(
        doc(
          '{<node>}',
          extension({ extensionKey: 'key', extensionType: 'type' })(),
        ),
      );

      const toolbar = getToolbarConfig()(
        editorView.state,
        intl,
        providerFactory,
      );
      expect(toolbar).toBeDefined();
      const removeButton = getToolbarItems(toolbar!, editorView).find(
        (item) => item.type === 'button' && item.title === removeTitle,
      );

      expect(removeButton).toBeDefined();
      expect(removeButton).toMatchObject({
        appearance: 'danger',
        icon: RemoveIcon,
      });
    });

    it('has an edit button', () => {
      const { editorView } = editor(
        doc(
          '{<node>}',
          extension({ extensionKey: 'key', extensionType: 'type' })(),
        ),
      );

      const toolbar = getToolbarConfig()(
        editorView.state,
        intl,
        providerFactory,
      );
      expect(toolbar).toBeDefined();
      const editButton = getToolbarItems(toolbar!, editorView).find(
        (item) => item.type === 'button' && item.title === 'Edit',
      );

      expect(editButton).toBeDefined();
      expect(editButton).toMatchObject({
        icon: EditIcon,
      });
    });

    it('has breakout buttons', () => {
      const { editorView } = editor(
        doc(
          '{<node>}',
          extension({ extensionKey: 'key', extensionType: 'type' })(),
        ),
      );

      const toolbar = getToolbarConfig(true)(
        editorView.state,
        intl,
        providerFactory,
      );
      expect(toolbar).toBeDefined();
      const breakoutButtons = getToolbarItems(toolbar!, editorView).filter(
        (item) =>
          item.type === 'button' &&
          [
            defaultBreakoutTitle,
            wideBreakoutTitle,
            fullWidthBreakoutTitle,
          ].indexOf(item.title) > -1,
      );

      expect(breakoutButtons).toBeDefined();
      expect(breakoutButtons).toHaveLength(3);
    });

    it('has no breakout buttons when breakout is disabled', () => {
      const { editorView } = editor(
        doc(
          '{<node>}',
          extension({ extensionKey: 'key', extensionType: 'type' })(),
        ),
      );

      const toolbar = getToolbarConfig(false)(
        editorView.state,
        intl,
        providerFactory,
      );
      expect(toolbar).toBeDefined();
      const breakoutButtons = getToolbarItems(toolbar!, editorView).filter(
        (item) =>
          item.type === 'button' &&
          [
            defaultBreakoutTitle,
            wideBreakoutTitle,
            fullWidthBreakoutTitle,
          ].indexOf(item.title) > -1,
      );

      expect(breakoutButtons).toBeDefined();
      expect(breakoutButtons).toHaveLength(0);
    });

    describe('Extension Provider', () => {
      const ExtensionHandlerComponent = () => <div>Awesome Extension</div>;
      const extensionUpdater = () => Promise.resolve({});

      it('should show the edit button when update method is provided', async () => {
        const extensionProvider = createFakeExtensionProvider(
          'fake.confluence',
          'expand',
          ExtensionHandlerComponent,
          extensionUpdater,
        );

        const providerFactory = ProviderFactory.create({
          extensionProvider: Promise.resolve(
            combineExtensionProviders([extensionProvider]),
          ),
        });

        const { editorView } = editor(
          doc(
            '{<node>}',
            extension({
              extensionType: 'fake.confluence',
              extensionKey: 'expand',
            })(),
          ),
          {},
          providerFactory,
        );

        expect(providerFactory.hasProvider('extensionProvider')).toBeTruthy();
        await waitForProvider(providerFactory)('extensionProvider');
        // Need to wait for promises to get the updated state from getExtensionModuleNode
        await flushPromises();

        // Getting `pluginState` from `editor` will give an old state
        const pluginState = getPluginState(editorView.state);

        expect(pluginState.extensionProvider).toBeDefined();
        expect(pluginState.showEditButton).toBeTruthy();
      });

      it('should not show the edit button if extension is coming from a manifest and update method is not provided', async () => {
        const extensionProvider = createFakeExtensionProvider(
          'macro.from.manifest',
          'expand',
          ExtensionHandlerComponent,
        );

        const openMacroBrowserFn = jest.fn();

        const macroProvider = Promise.resolve({
          config: {},
          autoConvert: () => null,
          openMacroBrowser: openMacroBrowserFn,
        }) as Promise<MacroProvider>;

        const providerFactory = ProviderFactory.create({
          extensionProvider: Promise.resolve(
            combineExtensionProviders([extensionProvider]),
          ),
          macroProvider,
        });

        const { editorView } = editor(
          doc(
            '{<node>}',
            extension({
              extensionType: 'macro.from.manifest',
              extensionKey: 'expand',
            })(),
          ),
          {},
          providerFactory,
        );

        expect(providerFactory.hasProvider('extensionProvider')).toBeTruthy();
        await waitForProvider(providerFactory)('extensionProvider');
        // Need to wait for promises to get the updated state from getExtensionModuleNode
        await flushPromises();

        // Getting `pluginState` from `editor` will give an old state
        const pluginState = getPluginState(editorView.state);

        expect(pluginState.extensionProvider).toBeDefined();
        expect(pluginState.showEditButton).toBeFalsy();
      });

      it('should show the edit button if extension is NOT coming from a manifest and uses the extension handler as function', async () => {
        const extensionProvider = createFakeExtensionProvider(
          'macro.from.manifest',
          'expand',
          ExtensionHandlerComponent,
        );

        const openMacroBrowserFn = jest.fn();

        const macroProvider = Promise.resolve({
          config: {},
          autoConvert: () => null,
          openMacroBrowser: openMacroBrowserFn,
        }) as Promise<MacroProvider>;

        const providerFactory = ProviderFactory.create({
          extensionProvider: Promise.resolve(
            combineExtensionProviders([extensionProvider]),
          ),
          macroProvider,
        });

        const { editorView } = editor(
          doc(
            '{<node>}',
            extension({
              extensionType: 'macro.from.macro-provider',
              extensionKey: 'expand',
            })(),
          ),
          {
            extensionHandlers: {
              'macro.from.macro-provider': () => <div />,
            },
          },
          providerFactory,
        );

        expect(providerFactory.hasProvider('extensionProvider')).toBeTruthy();
        await waitForProvider(providerFactory)('extensionProvider');
        // Need to wait for promises to get the updated state from getExtensionModuleNode
        await flushPromises();

        // Getting `pluginState` from `editor` will give an old state
        const pluginState = getPluginState(editorView.state);

        expect(pluginState.extensionProvider).toBeDefined();
        expect(pluginState.showEditButton).toBeTruthy();
      });

      it('should not show the edit button if extension uses the extension handler as object without an update method', async () => {
        const extensionProvider = createFakeExtensionProvider(
          'macro.from.manifest',
          'expand',
          ExtensionHandlerComponent,
        );

        const openMacroBrowserFn = jest.fn();

        const macroProvider = Promise.resolve({
          config: {},
          autoConvert: () => null,
          openMacroBrowser: openMacroBrowserFn,
        }) as Promise<MacroProvider>;

        const providerFactory = ProviderFactory.create({
          extensionProvider: Promise.resolve(
            combineExtensionProviders([extensionProvider]),
          ),
          macroProvider,
        });

        const { editorView } = editor(
          doc(
            '{<node>}',
            extension({
              extensionType: 'macro.from.macro-provider',
              extensionKey: 'expand',
            })(),
          ),
          {
            extensionHandlers: {
              'macro.from.macro-provider': {
                render: () => <div />,
              },
            },
          },
          providerFactory,
        );

        expect(providerFactory.hasProvider('extensionProvider')).toBeTruthy();
        await waitForProvider(providerFactory)('extensionProvider');
        // Need to wait for promises to get the updated state from getExtensionModuleNode
        await flushPromises();

        // Getting `pluginState` from `editor` will give an old state
        const pluginState = getPluginState(editorView.state);

        expect(pluginState.extensionProvider).toBeDefined();
        expect(pluginState.showEditButton).toBeFalsy();
      });

      it('should show the edit button if extension uses the extension handler as object including an update method', async () => {
        const extensionProvider = createFakeExtensionProvider(
          'macro.from.manifest',
          'expand',
          ExtensionHandlerComponent,
        );

        const openMacroBrowserFn = jest.fn();

        const macroProvider = Promise.resolve({
          config: {},
          autoConvert: () => null,
          openMacroBrowser: openMacroBrowserFn,
        }) as Promise<MacroProvider>;

        const providerFactory = ProviderFactory.create({
          extensionProvider: Promise.resolve(
            combineExtensionProviders([extensionProvider]),
          ),
          macroProvider,
        });

        const { editorView } = editor(
          doc(
            '{<node>}',
            extension({
              extensionType: 'macro.from.macro-provider',
              extensionKey: 'expand',
            })(),
          ),
          {
            extensionHandlers: {
              'macro.from.macro-provider': {
                render: () => <div />,
              },
            },
          },
          providerFactory,
        );

        expect(providerFactory.hasProvider('extensionProvider')).toBeTruthy();
        await waitForProvider(providerFactory)('extensionProvider');
        // Need to wait for promises to get the updated state from getExtensionModuleNode
        await flushPromises();

        // Getting `pluginState` from `editor` will give an old state
        const pluginState = getPluginState(editorView.state);

        expect(pluginState.extensionProvider).toBeDefined();
        expect(pluginState.showEditButton).toBeFalsy();
      });

      it('should call the correct update function when switching between different type of extensions', async () => {
        const openMacroBrowserFn = jest.fn();
        const extensionProviderUpdate = jest.fn();

        const extensionProvider = createFakeExtensionProvider(
          'fake.confluence',
          'extension',
          ExtensionHandlerComponent,
          extensionProviderUpdate,
        );

        const macroProvider = Promise.resolve({
          config: {},
          autoConvert: () => null,
          openMacroBrowser: openMacroBrowserFn,
        }) as Promise<MacroProvider>;

        const providerFactory = ProviderFactory.create({
          extensionProvider: Promise.resolve(
            combineExtensionProviders([extensionProvider]),
          ),
          macroProvider,
        });

        const { editorView, refs } = editor(
          doc(
            '{macro}',
            extension({
              extensionType: 'fake.confluence.macro',
              extensionKey: 'someMacro',
            })(),
            '{extension}',
            extension({
              extensionType: 'fake.confluence',
              extensionKey: 'extension',
            })(),
          ),
          {
            // Passing `macroProvider` here to enable the plugin
            macroProvider,
            extensionHandlers: {
              'fake.confluence.macro': ExtensionHandlerComponent,
            },
          },
          providerFactory,
        );

        // Select Extension
        editorView.dispatch(
          editorView.state.tr.setSelection(
            new NodeSelection(editorView.state.doc.resolve(refs.extension)),
          ),
        );
        expect(providerFactory.hasProvider('extensionProvider')).toBeTruthy();
        await waitForProvider(providerFactory)('extensionProvider');

        const toolbar = getToolbarConfig()(
          editorView.state,
          intl,
          providerFactory,
        );
        expect(toolbar).toBeDefined();

        await flushPromises();

        const editButton = getToolbarItems(toolbar!, editorView).find(
          (item) => item.type === 'button' && item.title === 'Edit',
        );
        expect(editButton).toBeDefined();

        // Click edit pencil button
        editButton &&
          editButton.type === 'button' &&
          editButton.onClick(editorView.state, editorView.dispatch, editorView);

        await flushPromises();

        expect(openMacroBrowserFn).not.toHaveBeenCalled();
        expect(extensionProviderUpdate).toHaveBeenCalledTimes(1);
      });
    });
  });
});
