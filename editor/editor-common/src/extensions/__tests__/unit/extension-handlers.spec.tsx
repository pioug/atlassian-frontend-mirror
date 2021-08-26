import React from 'react';

import { shallow } from 'enzyme';
import Loadable from 'react-loadable';

import { createFakeExtensionManifest } from '@atlaskit/editor-test-helpers/extensions';

import combineExtensionProviders from '../../combine-extension-providers';
import DefaultExtensionProvider from '../../default-extension-provider';
import {
  getExtensionModuleNode,
  getNodeRenderer,
} from '../../extension-handlers';
import { ExtensionProvider } from '../../types';

describe('extension-handlers', () => {
  let extensionProvider: ExtensionProvider;

  const confluenceExpandMacro = createFakeExtensionManifest({
    title: 'Expand macro',
    type: 'confluence.macro',
    extensionKey: 'expand',
  });

  const confluenceTOCMacro = createFakeExtensionManifest({
    title: 'Table of contents macro',
    type: 'confluence.macro',
    extensionKey: 'toc',
    nodes: [{ key: 'default' }, { key: 'zone' }],
  });

  const forgeAmazingExtension = createFakeExtensionManifest({
    title: 'Answer to life',
    type: 'atlassian.forge',
    extensionKey: 'answer-to-life',
    nodes: [{ key: 'fourtyTwo' }],
  });

  beforeEach(async () => {
    extensionProvider = combineExtensionProviders([
      new DefaultExtensionProvider([confluenceExpandMacro, confluenceTOCMacro]),
      new DefaultExtensionProvider([forgeAmazingExtension]),
    ]);
  });

  describe('getNodeRenderer', () => {
    test('should return a react component synchronously, passing down the extension node, which will eventually reolve to the extension handler', async () => {
      const NodeRenderer = getNodeRenderer(
        extensionProvider,
        'confluence.macro',
        'expand',
      );

      const node = {
        extensionKey: 'expand',
        extensionType: 'confluence.macro',
        parameters: {
          text: 'inside out',
        },
        localId: 'c145e554-f571-4208-a0f1-2170e1987722',
      };

      const wrapper = shallow(<NodeRenderer node={node} />);

      expect(NodeRenderer.name).toBe('LoadableComponent');
      // LoadableComponent renders a component with isLoading = true
      expect(wrapper.props().isLoading).toBe(true);

      await Loadable.preloadAll();

      wrapper.update();

      // After the update, LoadableComponent is removed and our extension is rendered
      expect(wrapper.props().isLoading).not.toBeDefined();
      expect(wrapper.props().node).toEqual(node);
    });

    describe('once the node resolves to a component', () => {
      test('should render error message if extension key is not found', async () => {
        const NodeRenderer = getNodeRenderer(
          extensionProvider,
          'confluence.macro',
          'unknown',
        );

        const node = {
          extensionKey: 'unknown',
          extensionType: 'confluence.macro',
          parameters: {
            text: 'inside out',
          },
          localId: 'c145e554-f571-4208-a0f1-2170e1987722',
        };

        const wrapper = shallow(<NodeRenderer node={node} />);

        await expect(Loadable.preloadAll()).rejects.toEqual(
          new Error(
            `Extension with type "confluence.macro" and key "unknown" not found!`,
          ),
        );

        wrapper.update();

        expect(wrapper.dive().text()).toEqual('Error loading the extension!');
      });
    });
  });

  describe('getExtensionModuleNode', () => {
    test('should return the manifest node when found', async () => {
      expect(
        await getExtensionModuleNode(
          extensionProvider,
          'confluence.macro',
          'expand',
        ),
      ).toEqual(confluenceExpandMacro.modules.nodes!['default']);

      expect(
        await getExtensionModuleNode(
          extensionProvider,
          'confluence.macro',
          'toc',
        ),
      ).toEqual(confluenceTOCMacro.modules.nodes!['default']);

      expect(
        await getExtensionModuleNode(
          extensionProvider,
          'confluence.macro',
          'toc:zone',
        ),
      ).toEqual(confluenceTOCMacro.modules.nodes!['zone']);

      expect(
        await getExtensionModuleNode(
          extensionProvider,
          'atlassian.forge',
          'answer-to-life:fourtyTwo',
        ),
      ).toEqual(forgeAmazingExtension.modules.nodes!['fourtyTwo']);
    });

    test('should throw if extension type is not found', () => {
      return expect(
        getExtensionModuleNode(extensionProvider, 'fake.type', 'expand'),
      ).rejects.toEqual(
        new Error(
          `Extension with type "fake.type" and key "expand" not found!`,
        ),
      );
    });

    test('should throw if extension key is not found', () => {
      return expect(
        getExtensionModuleNode(
          extensionProvider,
          'confluence.macro',
          'unknown',
        ),
      ).rejects.toEqual(
        new Error(
          `Extension with type "confluence.macro" and key "unknown" not found!`,
        ),
      );
    });
  });
});
