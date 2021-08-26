import React from 'react';
import { EditorView } from 'prosemirror-view';
import { IntlProvider } from 'react-intl';
import { mount, ReactWrapper } from 'enzyme';

import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  BuilderContent,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import {
  combineExtensionProviders,
  TransformBefore,
  TransformAfter,
  UpdateExtension,
} from '@atlaskit/editor-common/extensions';
import {
  createFakeExtensionProvider,
  NodeConfig,
} from '@atlaskit/editor-test-helpers/extensions';

import { EditorProps } from '../../types';
import { pluginKey } from '../../plugins/extension/plugin-key';
import { flushPromises, waitForProvider } from '../__helpers/utils';
import { setEditingContextToContextPanel } from '../../plugins/extension/commands';
import { getContextPanel } from '../../plugins/extension/context-panel';
import { EditorActions, EditorContext } from '../..';
import { PublicProps } from '../../ui/ConfigPanel/ConfigPanelFieldsLoader';

const defaultTransformBefore: TransformBefore = (parameters) =>
  parameters && parameters.macroParams;
const defaultTransformAfter: TransformAfter = (parameters) =>
  Promise.resolve({
    macroParams: parameters,
  });
const ExtensionHandlerComponent = () => <div>Awesome Extension</div>;

interface SetupConfigPanelOptions {
  content: BuilderContent[];
  autoSave?: boolean;
  // extensionHandler: (...args: any) => JSX.Element,
  transformBefore?: TransformBefore;
  transformAfter?: TransformAfter;
  nodes?: NodeConfig[];
}
interface SetupConfigPanelReturn {
  props: PublicProps;
  editorView: EditorView;
  wrapper: ReactWrapper;
  dispatchMock: any;
  emitMock: any;
}
export const setupConfigPanel = async (
  options: SetupConfigPanelOptions,
): Promise<SetupConfigPanelReturn> => {
  const {
    content,
    autoSave = true,
    transformBefore,
    transformAfter,
    nodes,
  } = options;

  const createEditor = createEditorFactory();

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
          allowAutoSave: true,
        },
        ...props,
      },
      pluginKey,
      providerFactory,
    });
  };

  const actualTransformBefore = transformBefore || defaultTransformBefore;
  const actualTransformAfter = transformAfter || defaultTransformAfter;

  const extensionUpdater: UpdateExtension = (data, actions) =>
    new Promise((resolve) => {
      actions!.editInContextPanel(actualTransformBefore, actualTransformAfter);
    });

  const extensionProvider = createFakeExtensionProvider(
    'fake.confluence',
    'expand',
    ExtensionHandlerComponent,
    extensionUpdater,
    nodes,
  );

  const providerFactory = ProviderFactory.create({
    extensionProvider: Promise.resolve(
      combineExtensionProviders([extensionProvider]),
    ),
  });

  const { editorView, eventDispatcher } = editor(
    doc(...content),
    {},
    providerFactory,
  );

  await waitForProvider(providerFactory)('extensionProvider');

  setEditingContextToContextPanel(actualTransformBefore, actualTransformAfter)(
    editorView.state,
    editorView.dispatch,
  );

  const contextPanel = getContextPanel(autoSave)(editorView.state);

  expect(contextPanel).toBeTruthy();
  const editorActions = new EditorActions();
  const dispatchMock = jest.spyOn(editorView, 'dispatch');
  const emitMock = jest.spyOn(eventDispatcher, 'emit');

  editorActions._privateRegisterEditor(editorView, eventDispatcher);
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
    wrapper,
  };
};
