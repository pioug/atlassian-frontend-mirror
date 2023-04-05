import React from 'react';
import EditorNext from '../../index';
import createUniversalPreset from '../../../labs/next/presets/universal';
import { render } from '@testing-library/react';
import { basePlugin } from '../../../plugins';
import featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import { EditorPresetBuilder } from '@atlaskit/editor-common/preset';

describe('EditorNext', () => {
  describe('render with presets passed in', () => {
    it('should render correctly with the preset prop', () => {
      const preset = createUniversalPreset('full-page', { paste: {} }, {});
      const { container } = render(<EditorNext preset={preset} />);
      const editorElement = container.getElementsByClassName('akEditor');
      expect(editorElement.length).toBe(1);
    });

    it('should throw if passing an empty Preset', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error');
      expect(() => {
        render(<EditorNext preset={new EditorPresetBuilder()} />);
      }).toThrow();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Presets must contain the base plugin'),
      );
      consoleErrorSpy.mockRestore();
    });

    it('should not throw if passing a Preset that contains the base plugin', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error');
      const preset = new EditorPresetBuilder()
        .add([featureFlagsPlugin, {}])
        .add(basePlugin);

      expect(() => {
        render(<EditorNext preset={preset} />);
      }).not.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalledTimes(0);
      consoleErrorSpy.mockRestore();
    });
  });
});
