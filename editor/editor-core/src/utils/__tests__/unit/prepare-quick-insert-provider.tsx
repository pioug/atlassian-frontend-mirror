import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createFakeExtensionProvider } from '@atlaskit/editor-test-helpers/extensions';
import prepareQuickInsertProvider from '../../prepare-quick-insert-provider';
import type { QuickInsertProvider } from '@atlaskit/editor-common/provider-factory';
import EditorActions from '../../../actions';
import * as extensionUtils from '../../extensions';

describe('providers', () => {
  const quickInsertProvider = Promise.resolve({} as QuickInsertProvider);

  const extensionProvider = createFakeExtensionProvider(
    'fake.confluence',
    'extension',
    () => <div>Fake extension</div>,
  );

  it('should set extensionProvider quickInsert provider even when quickInsertProvider is not provided', () => {
    const provider = prepareQuickInsertProvider(
      new EditorActions(),
      extensionProvider,
      undefined,
      undefined,
    );

    expect(provider).toBeDefined();
  });

  it('should just set quickInsertProvider if there is no extensionProvider', () => {
    const provider = prepareQuickInsertProvider(
      new EditorActions(),
      undefined,
      { provider: quickInsertProvider },
      undefined,
    );

    expect(provider).toBe(quickInsertProvider);
  });

  it('should combine them if both quickInsertProvider and extensionProvider are provided', () => {
    const combineQuickInsertProvidersSpy = jest.spyOn(
      extensionUtils,
      'combineQuickInsertProviders',
    );
    const provider = prepareQuickInsertProvider(
      new EditorActions(),
      extensionProvider,
      { provider: quickInsertProvider },
      undefined,
    );

    expect(provider).toEqual(quickInsertProvider);
    expect(combineQuickInsertProvidersSpy).toHaveBeenCalledTimes(1);
    // Call 0, Argument 0, Array item 0
    expect(combineQuickInsertProvidersSpy.mock.calls[0][0][0]).toBe(
      quickInsertProvider,
    );

    combineQuickInsertProvidersSpy.mockReset();
    combineQuickInsertProvidersSpy.mockRestore();
  });

  it('should not set quickInsertProvider if neither quickInsertProvider or extensionProvider provided', () => {
    const provider = prepareQuickInsertProvider(
      new EditorActions(),
      undefined,
      undefined,
      undefined,
    );

    expect(provider).toBeUndefined();
  });
});
