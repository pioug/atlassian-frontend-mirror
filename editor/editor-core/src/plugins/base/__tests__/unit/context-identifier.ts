import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import {
  ContextIdentifierProvider,
  ProviderFactory,
} from '@atlaskit/editor-common';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { stateKey } from '../../pm-plugins/context-identifier';

describe('context-identifier', () => {
  const createEditor = createEditorFactory();

  const createProviderFactory = (
    contextIdentifier: ContextIdentifierProvider,
  ) => {
    return ProviderFactory.create({
      contextIdentifierProvider: Promise.resolve<ContextIdentifierProvider>({
        objectId: contextIdentifier.objectId,
        containerId: contextIdentifier.containerId,
        childObjectId: contextIdentifier.childObjectId,
        product: contextIdentifier.product,
      }),
    });
  };

  const initEditor = (providerFactory: ProviderFactory) => {
    const createAnalyticsEvent = jest.fn().mockReturnValue({
      fire() {},
    });

    return createEditor({
      doc: doc(p('')),
      editorProps: {},
      providerFactory,
      createAnalyticsEvent,
      pluginKey: stateKey,
    });
  };

  it('gets the correct contextIdentifier', async () => {
    const contextIdentifier = {
      objectId: 'DUMMY-OBJECT-ID',
      containerId: 'DUMMY-CONTAINER-ID',
      childObjectId: 'DUMMY-CHILD-OBJECT-ID',
      product: 'atlaskit-examples',
    };
    const editor = initEditor(createProviderFactory(contextIdentifier));

    expect(
      stateKey.getState(editor.editorView.state).contextIdentifierProvider,
    ).toBeUndefined();
    await Promise.resolve(true);
    expect(
      stateKey.getState(editor.editorView.state).contextIdentifierProvider,
    ).toEqual(contextIdentifier);
  });

  it('subscribes and unsubscribes providerFactory', async () => {
    const contextIdentifier = {
      objectId: 'DUMMY-OBJECT-ID',
      containerId: 'DUMMY-CONTAINER-ID',
      childObjectId: 'DUMMY-CHILD-OBJECT-ID',
      product: 'atlaskit-examples',
    };

    const providerFactory = createProviderFactory(contextIdentifier);

    const subscribeSpy = jest.spyOn(providerFactory, 'subscribe');
    const unsubscribeSpy = jest.spyOn(providerFactory, 'unsubscribe');

    const editor = initEditor(providerFactory);

    await Promise.resolve(true);

    expect(subscribeSpy).toHaveBeenCalledWith(
      'contextIdentifierProvider',
      expect.anything(),
    );
    editor.editorView.destroy();
    expect(unsubscribeSpy).toHaveBeenCalledWith(
      'contextIdentifierProvider',
      expect.anything(),
    );
  });
});
