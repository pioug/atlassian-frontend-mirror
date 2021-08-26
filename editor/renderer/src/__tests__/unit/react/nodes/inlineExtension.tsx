import React from 'react';
import { mount } from 'enzyme';
import InlineExtension from '../../../../react/nodes/inlineExtension';
import { RendererContext } from '../../../../react/types';
import { defaultSchema } from '@atlaskit/adf-schema';
import {
  ExtensionHandlers,
  ProviderFactory,
  combineExtensionProviders,
} from '@atlaskit/editor-common';
import { createFakeExtensionProvider } from '@atlaskit/editor-test-helpers/extensions';
import Loadable from 'react-loadable';

describe('Renderer - React/Nodes/InlineExtension', () => {
  const providerFactory = ProviderFactory.create({});
  const extensionHandlers: ExtensionHandlers = {
    'com.atlassian.fabric': (param: any) => {
      switch (param.extensionKey) {
        case 'react':
          return <span>This is a react element</span>;
        case 'error':
          throw new Error('Cursed by Tong');
        default:
          return null;
      }
    },
  };

  const rendererContext: RendererContext = {
    adDoc: {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Check out this extension',
            },
          ],
        },
        {
          type: 'inlineExtension',
          attrs: {
            extensionType: 'com.atlassian.stride',
            extensionKey: 'default',
            bodyType: 'none',
          },
          content: [
            {
              type: 'text',
              text: 'This is the default content of the extension',
            },
          ],
        },
      ],
    },
    schema: defaultSchema,
  };

  it('should be able to fall back to default content', () => {
    const extension = mount(
      <InlineExtension
        providers={providerFactory}
        extensionHandlers={extensionHandlers}
        rendererContext={rendererContext}
        extensionType="com.atlassian.fabric"
        extensionKey="default"
        text="This is the default text"
        localId="c145e554-f571-4208-a0f1-2170e1987722"
      />,
    );

    expect(extension.find('span').first().text()).toEqual(
      'This is the default text',
    );
    extension.unmount();
  });

  it('should be able to render React.Element from extensionHandler', () => {
    const extension = mount(
      <InlineExtension
        providers={providerFactory}
        extensionHandlers={extensionHandlers}
        rendererContext={rendererContext}
        extensionType="com.atlassian.fabric"
        extensionKey="react"
        localId="c145e554-f571-4208-a0f1-2170e1987722"
      />,
    );

    expect(extension.find('span').first().text()).toEqual(
      'This is a react element',
    );
    extension.unmount();
  });

  it('should render the default content if extensionHandler throws an exception', () => {
    const extension = mount(
      <InlineExtension
        providers={providerFactory}
        extensionHandlers={extensionHandlers}
        rendererContext={rendererContext}
        extensionType="com.atlassian.fabric"
        extensionKey="error"
        localId="c145e554-f571-4208-a0f1-2170e1987722"
      />,
    );

    expect(extension.find('span').first().text()).toEqual('inlineExtension');
    extension.unmount();
  });

  it('extension handler should receive type = inlineExtension', () => {
    const extensionHandler = jest.fn();
    const extensionHandlers: ExtensionHandlers = {
      'com.atlassian.fabric': extensionHandler,
    };

    const extension = mount(
      <InlineExtension
        providers={providerFactory}
        extensionHandlers={extensionHandlers}
        rendererContext={rendererContext}
        extensionType="com.atlassian.fabric"
        extensionKey="react"
        localId="c145e554-f571-4208-a0f1-2170e1987722"
      />,
    );

    expect(extensionHandler.mock.calls[0][0]).toEqual({
      type: 'inlineExtension',
      extensionType: 'com.atlassian.fabric',
      extensionKey: 'react',
      parameters: undefined,
      content: undefined,
      localId: 'c145e554-f571-4208-a0f1-2170e1987722',
    });

    extension.unmount();
  });

  describe('extension providers', () => {
    const ExtensionHandlerFromProvider = ({ node }: any) => (
      <div>Extension provider: {node.parameters.words}</div>
    );

    const confluenceMacrosExtensionProvider = createFakeExtensionProvider(
      'fake.confluence',
      'inline-macro',
      ExtensionHandlerFromProvider,
    );

    const providers = ProviderFactory.create({
      extensionProvider: Promise.resolve(
        combineExtensionProviders([confluenceMacrosExtensionProvider]),
      ),
    });

    it('should be able to render extensions with the extension provider', async () => {
      const extension = mount(
        <InlineExtension
          providers={providers}
          extensionHandlers={extensionHandlers}
          rendererContext={rendererContext}
          extensionType="fake.confluence"
          extensionKey="inline-macro"
          parameters={{
            words: 'lorem ipsum',
          }}
          localId="c145e554-f571-4208-a0f1-2170e1987722"
        />,
      );

      await Loadable.preloadAll();

      extension.update();

      expect(extension.text()).toEqual('Extension provider: lorem ipsum');

      extension.unmount();
    });

    it('should prioritize extension handlers (sync) over extension provider', async () => {
      const extensionHandlers: ExtensionHandlers = {
        'fake.confluence': (node: any) => (
          <div>Extension handler: {node.parameters.words}</div>
        ),
      };

      const extension = mount(
        <InlineExtension
          providers={providers}
          extensionHandlers={extensionHandlers}
          rendererContext={rendererContext}
          extensionType="fake.confluence"
          extensionKey="inline-macro"
          parameters={{
            words: 'lorem ipsum',
          }}
          localId="c145e554-f571-4208-a0f1-2170e1987722"
        />,
      );

      expect(extension.text()).toEqual('Extension handler: lorem ipsum');

      extension.unmount();
    });

    it('should fallback to extension provider if not handled by extension handlers', async () => {
      const extensionHandlers: ExtensionHandlers = {
        'fake.confluence': (node: any) => null,
      };

      const extension = mount(
        <InlineExtension
          providers={providers}
          extensionHandlers={extensionHandlers}
          rendererContext={rendererContext}
          extensionType="fake.confluence"
          extensionKey="inline-macro"
          parameters={{
            words: 'lorem ipsum',
          }}
          localId="c145e554-f571-4208-a0f1-2170e1987722"
        />,
      );

      await Loadable.preloadAll();

      extension.update();

      expect(extension.text()).toEqual('Extension provider: lorem ipsum');

      extension.unmount();
    });
  });
});
