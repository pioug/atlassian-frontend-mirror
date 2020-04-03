import React from 'react';
import { mount } from 'enzyme';
import Extension from '../../../../react/nodes/extension';
import { RendererContext } from '../../../../react';
import ReactSerializer from '../../../../react';
import { defaultSchema } from '@atlaskit/adf-schema';
import {
  ProviderFactory,
  ExtensionHandlers,
  combineExtensionProviders,
} from '@atlaskit/editor-common';
import { createFakeExtensionProvider } from '@atlaskit/editor-test-helpers/src/extensions';
import Loadable from 'react-loadable';

describe('Renderer - React/Nodes/Extension', () => {
  const providerFactory = ProviderFactory.create({});
  const extensionHandlers: ExtensionHandlers = {
    'com.atlassian.fabric': (param: any) => {
      switch (param.extensionKey) {
        case 'react':
          return <p>This is a react element</p>;
        case 'adf':
          return [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'This is a ADF node',
                },
              ],
            },
          ];
        case 'error':
          throw new Error('Tong is cursing you...');
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
          type: 'extension',
          attrs: {
            extensionType: 'com.atlassian.stride',
            extensionKey: 'default',
          },
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'This is the default content of the extension',
                },
              ],
            },
          ],
        },
      ],
    },
    schema: defaultSchema,
  };

  const serializer = new ReactSerializer({});

  it('should be able to fall back to default content', () => {
    const extension = mount(
      <Extension
        providers={providerFactory}
        serializer={serializer}
        extensionHandlers={extensionHandlers}
        rendererContext={rendererContext}
        extensionType="com.atlassian.fabric"
        extensionKey="default"
        text="This is the default text"
      />,
    );

    expect(
      extension
        .find('div')
        .first()
        .text(),
    ).toEqual('This is the default text');
    extension.unmount();
  });

  it('should be able to render React.Element from extensionHandler', () => {
    const extension = mount(
      <Extension
        providers={providerFactory}
        serializer={serializer}
        extensionHandlers={extensionHandlers}
        rendererContext={rendererContext}
        extensionType="com.atlassian.fabric"
        extensionKey="react"
      />,
    );

    expect(
      extension
        .find('div')
        .first()
        .text(),
    ).toEqual('This is a react element');
    extension.unmount();
  });

  it('should be able to render Atlassian Document from extensionHandler', () => {
    const extension = mount(
      <Extension
        providers={providerFactory}
        serializer={serializer}
        extensionHandlers={extensionHandlers}
        rendererContext={rendererContext}
        extensionType="com.atlassian.fabric"
        extensionKey="adf"
      />,
    );

    expect(
      extension
        .find('div')
        .first()
        .text(),
    ).toEqual('This is a ADF node');
    extension.unmount();
  });

  it('should render the default content if extensionHandler throws an exception', () => {
    const extension = mount(
      <Extension
        providers={providerFactory}
        serializer={serializer}
        extensionHandlers={extensionHandlers}
        rendererContext={rendererContext}
        extensionType="com.atlassian.fabric"
        extensionKey="error"
      />,
    );

    expect(
      extension
        .find('div')
        .first()
        .text(),
    ).toEqual('extension');
    extension.unmount();
  });

  it('extension handler should receive type = extension', () => {
    const extensionHandler = jest.fn();
    const extensionHandlers: ExtensionHandlers = {
      'com.atlassian.fabric': extensionHandler,
    };

    const extension = mount(
      <Extension
        providers={providerFactory}
        serializer={serializer}
        extensionHandlers={extensionHandlers}
        rendererContext={rendererContext}
        extensionType="com.atlassian.fabric"
        extensionKey="react"
      />,
    );

    expect(extensionHandler.mock.calls[0][0]).toEqual({
      type: 'extension',
      extensionType: 'com.atlassian.fabric',
      extensionKey: 'react',
      parameters: undefined,
      content: undefined,
    });

    extension.unmount();
  });

  describe('extension providers', () => {
    const ExtensionHandlerFromProvider = ({ extensionParams }: any) => (
      <div>Extension provider: {extensionParams.content}</div>
    );

    const confluenceMacrosExtensionProvider = createFakeExtensionProvider(
      'fake.confluence',
      'macro',
      ExtensionHandlerFromProvider,
    );

    const providers = ProviderFactory.create({
      extensionProvider: Promise.resolve(
        combineExtensionProviders([confluenceMacrosExtensionProvider]),
      ),
    });

    it('should be able to render extensions with the extension provider', async () => {
      const extension = mount(
        <Extension
          providers={providers}
          serializer={serializer}
          extensionHandlers={extensionHandlers}
          rendererContext={rendererContext}
          extensionType="fake.confluence"
          extensionKey="macro"
          text="Hello extension"
        />,
      );

      await Loadable.preloadAll();

      extension.update();

      expect(extension.text()).toEqual('Extension provider: Hello extension');

      extension.unmount();
    });

    it('should prioritize extension handlers (sync) over extension provider', async () => {
      const extensionHandlers: ExtensionHandlers = {
        'fake.confluence': (extensionParams: any) => (
          <div>Extension handler: {extensionParams.content}</div>
        ),
      };

      const extension = mount(
        <Extension
          providers={providers}
          serializer={serializer}
          extensionHandlers={extensionHandlers}
          rendererContext={rendererContext}
          extensionType="fake.confluence"
          extensionKey="macro"
          text="Hello extension"
        />,
      );

      expect(extension.text()).toEqual('Extension handler: Hello extension');

      extension.unmount();
    });

    it('should fallback to extension provider if not handled by extension handler', async () => {
      const extensionHandlers: ExtensionHandlers = {
        'fake.confluence': (extensionParams: any) => null,
      };

      const extension = mount(
        <Extension
          providers={providers}
          serializer={serializer}
          extensionHandlers={extensionHandlers}
          rendererContext={rendererContext}
          extensionType="fake.confluence"
          extensionKey="macro"
          text="Hello extension"
        />,
      );

      await Loadable.preloadAll();

      extension.update();

      expect(extension.text()).toEqual('Extension provider: Hello extension');

      extension.unmount();
    });
  });
});
