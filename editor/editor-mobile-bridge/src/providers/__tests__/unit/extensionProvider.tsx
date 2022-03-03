import * as crossPlatformPromise from '../../../cross-platform-promise';
import {
  ExtensionProvider,
  ExtensionManifest,
} from '@atlaskit/editor-common/extensions';
import { createExtensionProvider } from '../../extensionProvider';

jest.mock('../../../cross-platform-promise');

function mockCreatePromiseResolveValue(resolve: any) {
  const { createPromise } = require('../../../cross-platform-promise');

  createPromise.mockImplementationOnce(
    () =>
      ({
        submit: () => Promise.resolve(resolve),
      } as any),
  );
}

describe('createExtensionProvider', () => {
  let createPromise: jest.MockedFunction<typeof crossPlatformPromise.createPromise>;

  beforeEach(() => {
    ({ createPromise } = require('../../../cross-platform-promise'));
  });

  afterEach(() => {
    createPromise.mockClear();
  });

  it('should return empty provider when enableConfluenceMobileMacros is false', () => {
    return createExtensionProvider(
      false,
      () => {},
      () => {},
    )
      .then((extensionProvider: ExtensionProvider) =>
        extensionProvider.getExtensions(),
      )
      .then((extensions: ExtensionManifest[]) => {
        expect(extensions.length).toEqual(0);
      });
  });

  it('should return populated provider when enableConfluenceMobileMacros is true', () => {
    const macros = [
      {
        macroName: 'macro-name',
        title: 'macro-title',
        description: 'macro-description',
      },
      {
        macroName: 'macro-name-2',
        title: 'macro-title-2',
        description: 'macro-description-2',
      },
    ];
    mockCreatePromiseResolveValue({
      legacyMacroManifests: { macros },
      renderingStrategyMap: {},
    });

    return createExtensionProvider(
      true,
      () => {},
      () => {},
    )
      .then((extensionProvider: ExtensionProvider) =>
        extensionProvider.getExtensions(),
      )
      .then((extensions: ExtensionManifest[]) => {
        expect(extensions.length).toEqual(macros.length);
      });
  });
});
