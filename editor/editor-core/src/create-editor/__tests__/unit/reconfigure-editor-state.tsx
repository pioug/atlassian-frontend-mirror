import React from 'react';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import ReactEditorView from '../../ReactEditorView';
import * as FeatureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import { createPreset } from '../../create-plugins-list';

describe('ReactEditorView/reconfigureState', () => {
  const defaultProps = {
    providerFactory: ProviderFactory.create({}),
    portalProviderAPI: {} as any,
    onEditorCreated: () => {},
    onEditorDestroyed: () => {},
  };
  const featureFlagsPluginSpy = jest.spyOn(FeatureFlagsPlugin, 'default');

  afterEach(jest.clearAllMocks);

  describe('when the component is created', () => {
    it('should send the feature flag', () => {
      const editorProps = {
        featureFlags: {
          tableOverflowShadowsOptimization: true, // Needs to be a valid FF
        },
      };

      renderWithIntl(
        <ReactEditorView
          {...defaultProps}
          editorProps={editorProps}
          preset={createPreset(editorProps)}
        />,
      );

      expect(featureFlagsPluginSpy).toHaveBeenCalledTimes(1);
      expect(featureFlagsPluginSpy).toHaveBeenCalledWith(
        expect.objectContaining({ tableOverflowShadowsOptimization: true }),
        expect.objectContaining({ dependencies: {} }),
      );
    });
  });

  describe('when the editor props flag changes', () => {
    it('should reconfigure the state using new allowUndoRedoButtons', () => {
      const editorProps = {
        allowUndoRedoButtons: false,
      };
      const { rerender, unmount } = renderWithIntl(
        <ReactEditorView
          {...defaultProps}
          editorProps={editorProps}
          preset={createPreset(editorProps)}
        />,
      );

      expect(featureFlagsPluginSpy).toHaveBeenCalledTimes(1);
      expect(featureFlagsPluginSpy).toHaveBeenCalledWith(
        expect.objectContaining({ undoRedoButtons: false }),
        expect.objectContaining({ dependencies: {} }),
      );

      const nextEditorProps = {
        allowUndoRedoButtons: true,
      };
      rerender(
        <ReactEditorView
          {...defaultProps}
          editorProps={nextEditorProps}
          preset={createPreset(nextEditorProps)}
        />,
      );

      expect(featureFlagsPluginSpy).toHaveBeenCalledTimes(2);
      expect(featureFlagsPluginSpy).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({ undoRedoButtons: true }),
        expect.objectContaining({ dependencies: {} }),
      );

      unmount();
    });
  });

  describe('when the editor props flag changes on mobile appearance', () => {
    it('should reconfigure the state using the new feature flag', () => {
      const editorProps = {
        featureFlags: {
          tableOverflowShadowsOptimization: true,
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

      expect(featureFlagsPluginSpy).toHaveBeenCalledTimes(1);
      expect(featureFlagsPluginSpy).toHaveBeenCalledWith(
        expect.objectContaining({ tableOverflowShadowsOptimization: true }),
        expect.objectContaining({ dependencies: {} }),
      );

      const nextEditorProps = {
        featureFlags: {
          tableOverflowShadowsOptimization: false,
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

      expect(featureFlagsPluginSpy).toHaveBeenCalledTimes(2);
      expect(featureFlagsPluginSpy).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({ tableOverflowShadowsOptimization: false }),
        expect.objectContaining({ dependencies: {} }),
      );

      unmount();
    });
  });
});
