import type { ImageUploadProvider } from '@atlaskit/editor-common/provider-factory';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';

import { imageUploadPlugin } from '../../plugin';

describe('OptionalPlugin usage should', () => {
  const createEditor = createProsemirrorEditorFactory();
  const imageUploadProviderFake: ImageUploadProvider = jest.fn();

  beforeEach(() => {
    (imageUploadProviderFake as any).mockReset();
  });

  type PluginUsingImageUpload = NextEditorPlugin<
    'usingImageUpload',
    {
      dependencies: [typeof imageUploadPlugin];
    }
  >;

  const editor = async (plugin: PluginUsingImageUpload) => {
    const providerFactory = ProviderFactory.create({
      imageUploadProvider: Promise.resolve(imageUploadProviderFake),
    });

    const result = createEditor({
      providerFactory,
      preset: new Preset().add(imageUploadPlugin).add(plugin),
    });

    let readyProvider = (arg?: unknown) => {};
    const uploadProviderReadyPromise = new Promise(resolve => {
      readyProvider = resolve;
    });
    providerFactory.subscribe('imageUploadProvider', () => {
      readyProvider();
    });

    await uploadProviderReadyPromise;

    return result;
  };

  it('call the provider correctly with uploadImage action', async () => {
    let doUpload = () => {};
    const imageUploadPlugin: PluginUsingImageUpload = (_, api) => {
      doUpload = () => {
        api?.dependencies.imageUpload.actions.startUpload()(
          jest.fn() as any,
          jest.fn() as any,
        );
      };

      return {
        name: 'usingImageUpload',
      };
    };
    await editor(imageUploadPlugin);

    doUpload();
    expect(imageUploadProviderFake).toHaveBeenCalledTimes(1);
    expect(imageUploadProviderFake).toHaveBeenCalledWith(
      undefined,
      expect.any(Function),
    );
  });
});
