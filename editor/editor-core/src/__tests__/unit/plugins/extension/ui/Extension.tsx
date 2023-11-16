import React from 'react';
import { mount } from 'enzyme';
import { combineExtensionProviders } from '@atlaskit/editor-common/extensions';
import type {
  ExtensionHandlers,
  ExtensionParams,
} from '@atlaskit/editor-common/extensions';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { extensionData } from '@atlaskit/editor-test-helpers/mock-extension-data';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { macroProvider } from '@atlaskit/editor-test-helpers/mock-macro-provider';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createFakeExtensionProvider } from '@atlaskit/editor-test-helpers/extensions';

import Extension from '../../../../../plugins/extension/ui/Extension';
import ExtensionComponent from '../../../../../plugins/extension/ui/Extension/ExtensionComponent';
import Loadable from 'react-loadable';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { act } from 'react-dom/test-utils';

const macroProviderPromise = Promise.resolve(macroProvider);
const providerFactory = ProviderFactory.create({
  macroProvider: macroProviderPromise,
});

describe('@atlaskit/editor-core/ui/Extension', () => {
  const node = extensionData[0] as any;
  const noop: any = () => {};
  const mockGetPos = () => 1;
  const mockEditorView = jest.fn(
    () =>
      ({
        state: {
          doc: {
            resolve: jest.fn().mockImplementation((x: number) => ({
              depth: x,
            })),
          },
        },
        dispatch: jest.fn(),
        someProp: jest.fn(),
      } as { state: {}; dispatch: Function } as EditorView),
  );
  const view = new mockEditorView();

  it('should render macro component', () => {
    const extension = mount(
      <Extension
        editorView={{} as any}
        node={node}
        getPos={mockGetPos}
        providerFactory={providerFactory}
        handleContentDOMRef={noop}
        extensionHandlers={{}}
        pluginInjectionApi={undefined}
      />,
    );
    const component = extension.find(ExtensionComponent);

    expect(component.prop('node')).toEqual(node);
    extension.unmount();
  });

  it('should render from the extension handler when possible', () => {
    const GalleryComponent = () => <div>Gallery Extension</div>;

    const extensionHandlers: ExtensionHandlers = {
      'com.atlassian.confluence.macro.core': (ext) => {
        if (ext.extensionKey === 'gallery') {
          return <GalleryComponent />;
        }

        return null;
      },
    };

    // PM node has extension as type.name instead of just type
    const extensionNode = {
      ...node,
      type: {
        name: 'extension',
      },
    };

    const extension = mount(
      <Extension
        editorView={view}
        node={extensionNode}
        getPos={mockGetPos}
        providerFactory={providerFactory}
        handleContentDOMRef={noop}
        extensionHandlers={extensionHandlers}
        pluginInjectionApi={undefined}
      />,
    );

    const component = extension.find(ExtensionComponent);
    expect(component.find('GalleryComponent').length).toBe(1);
  });

  it('should fail silently if extension handler throws', () => {
    const invalidExtensions = () => {
      throw new Error('invalid extension');
    };
    const extensionHandlers: ExtensionHandlers = {
      'com.atlassian.confluence.macro.core': (ext) => {
        if (ext.extensionKey === 'gallery') {
          expect(invalidExtensions).toThrow('invalid extension');
        }

        return null;
      },
    };

    // PM node has extension as type.name instead of just type
    const extensionNode = {
      ...node,
      type: {
        name: 'extension',
      },
    };

    const extension = mount(
      <Extension
        editorView={view}
        node={extensionNode}
        getPos={mockGetPos}
        providerFactory={providerFactory}
        handleContentDOMRef={noop}
        extensionHandlers={extensionHandlers}
        pluginInjectionApi={undefined}
      />,
    );

    const component = extension.find(ExtensionComponent);
    expect(component.length).toBe(1);
    expect(component.find('GalleryComponent').length).toBe(0);
  });

  it('should pass the correct content to inlineExtension', () => {
    const InlineCompontent = ({ node }: { node: ExtensionParams<any> }) => (
      <div>{node.content}</div>
    );

    const extensionHandlers: ExtensionHandlers = {
      'com.atlassian.editor': (ext) => {
        if (ext.extensionKey === 'example-inline') {
          return <InlineCompontent node={ext} />;
        }

        return null;
      },
    };

    const extensionNode = {
      type: {
        name: 'inlineExtension',
      },
      attrs: {
        extensionType: 'com.atlassian.editor',
        extensionKey: 'example-inline',
        text: 'Hello inlineExtension!',
        parameters: {
          appearance: 'success',
        },
      },
    } as any;

    const extension = mount(
      <Extension
        editorView={view}
        node={extensionNode}
        getPos={mockGetPos}
        providerFactory={providerFactory}
        handleContentDOMRef={noop}
        extensionHandlers={extensionHandlers}
        pluginInjectionApi={undefined}
      />,
    );

    expect(extension.find(InlineCompontent).text()).toEqual(
      'Hello inlineExtension!',
    );

    extension.unmount();
  });

  it('should pass the correct content to extension', () => {
    const ExtensionCompontent = ({ node }: { node: ExtensionParams<any> }) => (
      <div>{node.content}</div>
    );

    const extensionHandlers: ExtensionHandlers = {
      'com.atlassian.editor': (ext) => {
        if (ext.extensionKey === 'example-extension') {
          return <ExtensionCompontent node={ext} />;
        }

        return null;
      },
    };

    const extensionNode = {
      type: {
        name: 'extension',
      },
      attrs: {
        extensionType: 'com.atlassian.editor',
        extensionKey: 'example-extension',
        text: 'Hello extension!',
        parameters: {
          appearance: 'success',
        },
      },
    } as any;

    const extension = mount(
      <Extension
        editorView={view}
        node={extensionNode}
        getPos={mockGetPos}
        providerFactory={providerFactory}
        handleContentDOMRef={noop}
        extensionHandlers={extensionHandlers}
        pluginInjectionApi={undefined}
      />,
    );

    expect(extension.find(ExtensionCompontent).text()).toEqual(
      'Hello extension!',
    );

    extension.unmount();
  });

  describe('extension provider', () => {
    const ExtensionHandlerComponent = ({ node }: any) => {
      return <div>Extension provider: {node.content}</div>;
    };
    const confluenceMacrosExtensionProvider = createFakeExtensionProvider(
      'fake.confluence',
      'expand',
      ExtensionHandlerComponent,
    );
    const providerFactory = ProviderFactory.create({
      extensionProvider: Promise.resolve(
        combineExtensionProviders([confluenceMacrosExtensionProvider]),
      ),
    });
    const extensionNode = {
      type: {
        name: 'extension',
      },
      attrs: {
        extensionType: 'fake.confluence',
        extensionKey: 'expand',
        text: 'Hello extension!',
        parameters: {},
      },
    } as any;
    it('should use the extension handler from the provider in case there is no other available', async () => {
      const extension = mount(
        <Extension
          editorView={view}
          providerFactory={providerFactory}
          node={extensionNode}
          getPos={mockGetPos}
          handleContentDOMRef={noop}
          extensionHandlers={{}}
          pluginInjectionApi={undefined}
        />,
      );
      await act(async () => {
        await Loadable.preloadAll();
      });
      extension.update();
      expect(extension.find(ExtensionHandlerComponent).text()).toEqual(
        'Extension provider: Hello extension!',
      );
      extension.unmount();
    });
    it('should prioritize extension handlers (sync) over extension providers', async () => {
      const ExtensionCompontent = ({
        node,
      }: {
        node: ExtensionParams<any>;
      }) => <div>Extension handler: {node.content}</div>;
      const extensionHandlers: ExtensionHandlers = {
        'fake.confluence': (ext) => {
          if (ext.extensionKey === 'expand') {
            return <ExtensionCompontent node={ext} />;
          }
          return null;
        },
      };
      const extension = mount(
        <Extension
          editorView={view}
          providerFactory={providerFactory}
          node={extensionNode}
          getPos={mockGetPos}
          handleContentDOMRef={noop}
          extensionHandlers={extensionHandlers}
          pluginInjectionApi={undefined}
        />,
      );
      expect(extension.find(ExtensionCompontent).text()).toEqual(
        'Extension handler: Hello extension!',
      );
      extension.unmount();
    });
    it('should fallback to extension provider in case extension handlers do not handle it', async () => {
      const extensionHandlers: ExtensionHandlers = {
        'fake.confluence': (node: any) => null,
      };
      const extension = mount(
        <Extension
          editorView={view}
          providerFactory={providerFactory}
          node={extensionNode}
          getPos={mockGetPos}
          handleContentDOMRef={noop}
          extensionHandlers={extensionHandlers}
          pluginInjectionApi={undefined}
        />,
      );
      await act(async () => {
        await Loadable.preloadAll();
      });
      extension.update();
      expect(extension.find(ExtensionHandlerComponent).text()).toEqual(
        'Extension provider: Hello extension!',
      );
      extension.unmount();
    });
  });
});
