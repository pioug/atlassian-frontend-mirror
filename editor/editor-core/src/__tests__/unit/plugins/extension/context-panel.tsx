import React from 'react';
import { IntlProvider } from 'react-intl';
import { mount } from 'enzyme';
import { ADNode } from '@atlaskit/editor-common/validator';
import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  bodiedExtension,
  extension,
  inlineExtension,
  p as paragraph,
  BuilderContent,
} from '@atlaskit/editor-test-helpers/schema-builder';
import { createFakeExtensionProvider } from '@atlaskit/editor-test-helpers/extensions';

import {
  combineExtensionProviders,
  TransformBefore,
  TransformAfter,
  UpdateExtension,
} from '@atlaskit/editor-common/extensions';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';

import EditorContext from '../../../../ui/EditorContext';
import { pluginKey } from '../../../../plugins/extension/plugin-key';
import { EditorProps } from '../../../../types';
import { waitForProvider, flushPromises } from '../../../__helpers/utils';
import { getContextPanel } from '../../../../plugins/extension/context-panel';
import { setEditingContextToContextPanel } from '../../../../plugins/extension/commands';
import EditorActions from '../../../../actions';
import { PublicProps } from '../../../../ui/ConfigPanel/FieldsLoader';

// there are many warnings due to hooks usage and async code that will be solved with the next react update.
// this function will keep then silent so we can still read the tests.
const silenceActErrors = () => {
  let consoleError: jest.SpyInstance;

  beforeAll(() => {
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    consoleError.mockRestore();
  });
};

describe('extension context panel', () => {
  const createEditor = createEditorFactory();

  const editor = (
    doc: any,
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
          allowAutoSave: true,
        },
        ...props,
      },
      pluginKey,
      providerFactory,
    });
  };

  const ExtensionHandlerComponent = () => <div>Awesome Extension</div>;

  const transformBefore: TransformBefore = parameters => parameters.macroParams;
  const transformAfter: TransformAfter = parameters =>
    Promise.resolve({
      macroParams: parameters,
    });

  const extensionUpdater: UpdateExtension = (data, actions) =>
    new Promise(resolve => {
      actions!.editInContextPanel(transformBefore, transformAfter);
    });

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

  const setupConfigPanel = async (content: BuilderContent[]) => {
    const { editorView, eventDispatcher } = editor(
      doc(...content),
      {},
      providerFactory,
    );

    await waitForProvider(providerFactory)('extensionProvider');

    setEditingContextToContextPanel(transformBefore, transformAfter)(
      editorView.state,
      editorView.dispatch,
    );

    const contextPanel = getContextPanel(true)(editorView.state);

    expect(contextPanel).toBeTruthy();
    const editorActions = new EditorActions();
    const dispatchMock = jest.spyOn(editorView, 'dispatch');
    const emitMock = jest.spyOn(eventDispatcher, 'emit');

    editorActions._privateRegisterEditor(editorView, {} as any);
    const wrapper = mount(
      <IntlProvider locale="en">
        <EditorContext editorActions={editorActions}>
          {contextPanel!}
        </EditorContext>
      </IntlProvider>,
    );

    await flushPromises();

    wrapper.update();

    const props = wrapper.find('FieldsLoader').props() as PublicProps;

    return {
      props,
      dispatchMock,
      editorView,
      emitMock,
    };
  };

  const findExtension = (content: ADNode): ADNode => {
    const isExtension = [
      'bodiedExtension',
      'extension',
      'inlineExtension',
    ].includes(content.type);
    if (isExtension) {
      return content;
    }

    return findExtension(content.content![0]);
  };

  it('should not call emit on every document change', async () => {
    const { editorView, emitMock } = await setupConfigPanel([
      '{<node>}',
      extension({
        extensionType: 'fake.confluence',
        extensionKey: 'expand',
        parameters: {
          macroParams: {
            title: 'click to see something cool',
            content: 'something cool',
          },
        },
      })(),
    ]);

    emitMock.mockClear();

    editorView.dispatch(editorView.state.tr.insertText('hello'));
    editorView.dispatch(editorView.state.tr.insertText(' world'));
    editorView.dispatch(editorView.state.tr.insertText('!'));

    expect(
      emitMock.mock.calls.filter(([e, _]) => e === 'contextPanelPluginKey$')
        .length,
    ).toEqual(1);
  });

  const testSaving = (type: string, content: BuilderContent[]) => {
    describe(`Saving ${type}`, () => {
      silenceActErrors();

      it('should unwrap parameters when injecting into the component', async () => {
        const { props } = await setupConfigPanel(content);

        expect(props.parameters).toEqual({
          title: 'click to see something cool',
          content: 'something cool',
        });
      });

      it('should wrap parameters back when saving and not scroll into view', async () => {
        const { props, dispatchMock } = await setupConfigPanel(content);

        props.onChange({
          title: 'changed',
          content: 'not that cool',
        });

        await flushPromises();

        const lastDispatchedTr = dispatchMock.mock.calls.pop();

        expect(
          findExtension(lastDispatchedTr![0].doc.toJSON().content[0]).attrs
            .parameters,
        ).toEqual({
          macroParams: {
            title: 'changed',
            content: 'not that cool',
          },
        });

        expect((lastDispatchedTr as any).scrolledIntoView).toBeFalsy();
      });
    });
  };

  testSaving('inlineExtension', [
    paragraph(
      '{<node>}',
      inlineExtension({
        extensionType: 'fake.confluence',
        extensionKey: 'expand',
        parameters: {
          macroParams: {
            title: 'click to see something cool',
            content: 'something cool',
          },
        },
      })(),
      ' text',
    ),
  ]);

  testSaving('extension', [
    '{<node>}',
    extension({
      extensionType: 'fake.confluence',
      extensionKey: 'expand',
      parameters: {
        macroParams: {
          title: 'click to see something cool',
          content: 'something cool',
        },
      },
    })(),
  ]);

  testSaving('bodiedExtension', [
    '{<node>}',
    bodiedExtension({
      extensionType: 'fake.confluence',
      extensionKey: 'expand',
      parameters: {
        macroParams: {
          title: 'click to see something cool',
          content: 'something cool',
        },
      },
    })(paragraph('text')),
  ]);

  testSaving('bodiedExtension with cursor inside', [
    bodiedExtension({
      extensionType: 'fake.confluence',
      extensionKey: 'expand',
      parameters: {
        macroParams: {
          title: 'click to see something cool',
          content: 'something cool',
        },
      },
    })(paragraph('te{<>}xt')),
  ]);
});
