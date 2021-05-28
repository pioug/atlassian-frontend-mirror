jest.mock('../../../../commands', () => ({
  updateState: jest.fn(() => () => {}),
}));

import { ExtensionProvider } from '@atlaskit/editor-common/extensions';
import * as main from '../../../../pm-plugins/main';
import { updateState } from '../../../../commands';

const { createExtensionProviderHandler: createProviderHandler } = main;

const fakeView: any = {
  state: {},
  dispatch: () => {},
};
const fakeExtensionProvider = {} as ExtensionProvider;

describe('createProviderHandler', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should set extensionProvider on success', async () => {
    const providerHandler = createProviderHandler(fakeView);
    const provider = Promise.resolve(fakeExtensionProvider);
    await providerHandler('extensionProvider', provider);

    expect(updateState).toHaveBeenCalledWith({
      extensionProvider: fakeExtensionProvider,
    });
  });

  it('should unset extensionProvider on error - provider', async () => {
    const providerHandler = createProviderHandler(fakeView);
    const provider = Promise.reject();
    await providerHandler('extensionProvider', provider);
    expect(updateState).toHaveBeenCalledWith({
      extensionProvider: undefined,
    });
  });

  it('should unset extensionProvider on error - updateEditButton', async () => {
    const providerHandler = createProviderHandler(fakeView);
    const provider = Promise.resolve(fakeExtensionProvider);
    jest.spyOn(main, 'updateEditButton').mockRejectedValueOnce('Error!!!');
    await providerHandler('extensionProvider', provider);

    expect(updateState).toHaveBeenCalledWith({
      extensionProvider: undefined,
    });
  });
});
