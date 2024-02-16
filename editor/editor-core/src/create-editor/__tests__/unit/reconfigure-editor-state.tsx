import React from 'react';

import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import * as FeatureFlagsPlugin from '@atlaskit/editor-plugins/feature-flags';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';

import { createPreset } from '../../create-preset';
import ReactEditorView from '../../ReactEditorView';

jest.mock('@atlaskit/editor-plugins/feature-flags', () => ({
  ...jest.requireActual('@atlaskit/editor-plugins/feature-flags'),
  featureFlagsPlugin: jest.fn(() => ({
    name: 'featureFlags',
    sharedState: {
      currentState: () => ({}),
    },
  })),
}));

describe('ReactEditorView/reconfigureState', () => {
  const defaultProps = {
    providerFactory: ProviderFactory.create({}),
    portalProviderAPI: {} as any,
    onEditorCreated: () => {},
    onEditorDestroyed: () => {},
  };
  const featureFlagsCurrentStateSpy = jest.spyOn(
    FeatureFlagsPlugin,
    'featureFlagsPlugin',
  );

  afterEach(jest.clearAllMocks);

  describe('when the component is created', () => {
    it('should send the feature flag', () => {
      const editorProps = {
        featureFlags: {
          ufo: true,
        },
      };

      renderWithIntl(
        <ReactEditorView
          {...defaultProps}
          editorProps={editorProps}
          preset={createPreset(editorProps)}
        />,
      );

      expect(featureFlagsCurrentStateSpy).toHaveBeenCalledTimes(1);
      expect(featureFlagsCurrentStateSpy).toHaveBeenCalledWith({
        config: expect.objectContaining({ ufo: true }),
        api: expect.objectContaining({}),
      });
    });
  });

  describe('when the editor props flag changes on mobile appearance', () => {
    it('should reconfigure the state using the new feature flag', () => {
      const editorProps = {
        featureFlags: {
          ufo: true,
        },
        appearance: 'mobile',
      } as any;
      const { rerender, unmount } = renderWithIntl(
        <ReactEditorView
          {...defaultProps}
          editorProps={editorProps}
          preset={createPreset(editorProps)}
        />,
      );

      expect(featureFlagsCurrentStateSpy).toHaveBeenCalledTimes(1);
      expect(featureFlagsCurrentStateSpy).toHaveBeenCalledWith({
        config: expect.objectContaining({ ufo: true }),
        api: expect.objectContaining({}),
      });

      const nextEditorProps = {
        featureFlags: {
          ufo: false,
          appearance: 'mobile',
        },
      };
      rerender(
        <ReactEditorView
          {...defaultProps}
          editorProps={nextEditorProps}
          preset={createPreset(nextEditorProps)}
        />,
      );

      expect(featureFlagsCurrentStateSpy).toHaveBeenCalledTimes(2);
      expect(featureFlagsCurrentStateSpy).toHaveBeenNthCalledWith(2, {
        config: expect.objectContaining({ ufo: false }),
        api: expect.objectContaining({}),
      });

      unmount();
    });
  });
});
